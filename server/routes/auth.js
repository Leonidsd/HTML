const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const config = require('../config');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Нормализация телефона
function normalizePhone(raw) {
  return '+' + (raw || '').replace(/\D/g, '');
}

// Создание сессии
function createSession(userId, res) {
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + config.sessionMaxAge).toISOString();

  db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').run(token, userId, expiresAt);

  res.cookie(config.sessionCookieName, token, {
    httpOnly: true,
    maxAge: config.sessionMaxAge,
    sameSite: 'lax',
    path: '/'
  });

  return token;
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { surname, name, patronymic, phone, email, password } = req.body;

    if (!name || !name.trim()) return res.status(400).json({ error: 'Введите имя' });
    if (!phone || normalizePhone(phone).length < 12) return res.status(400).json({ error: 'Введите корректный телефон' });
    if (!password || password.length < 4) return res.status(400).json({ error: 'Пароль должен быть не менее 4 символов' });

    const normPhone = normalizePhone(phone);
    const normEmail = email ? email.trim().toLowerCase() : '';

    // Проверка дублей
    const existingPhone = db.prepare('SELECT id FROM users WHERE phone = ?').get(normPhone);
    if (existingPhone) return res.status(400).json({ error: 'Пользователь с таким телефоном уже зарегистрирован' });

    if (normEmail) {
      const existingEmail = db.prepare('SELECT id FROM users WHERE email = ?').get(normEmail);
      if (existingEmail) return res.status(400).json({ error: 'Пользователь с таким email уже зарегистрирован' });
    }

    const passwordHash = await bcrypt.hash(password, config.bcryptRounds);
    const userId = uuidv4();

    db.prepare(`
      INSERT INTO users (id, surname, name, patronymic, phone, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'client')
    `).run(userId, (surname || '').trim(), name.trim(), (patronymic || '').trim(), normPhone, normEmail, passwordHash);

    createSession(userId, res);

    const user = db.prepare('SELECT id, surname, name, patronymic, phone, email, address, role FROM users WHERE id = ?').get(userId);
    res.json({ user });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) return res.status(400).json({ error: 'Введите логин и пароль' });

    const normLogin = login.includes('@')
      ? login.trim().toLowerCase()
      : normalizePhone(login);

    // Проверка admin
    if (normLogin === config.adminLogin && password === config.adminPassword) {
      // Для админа не создаём сессию в БД, просто возвращаем redirect
      res.cookie(config.sessionCookieName, 'admin-session', {
        httpOnly: true,
        maxAge: config.sessionMaxAge,
        sameSite: 'lax',
        path: '/'
      });
      return res.json({ role: 'admin', redirect: 'admin.html' });
    }

    // Проверка courier
    if (normLogin === config.courierLogin && password === config.courierPassword) {
      res.cookie(config.sessionCookieName, 'courier-session', {
        httpOnly: true,
        maxAge: config.sessionMaxAge,
        sameSite: 'lax',
        path: '/'
      });
      return res.json({ role: 'courier', redirect: 'courier.html' });
    }

    // Обычный пользователь
    const user = db.prepare('SELECT * FROM users WHERE phone = ? OR email = ?').get(normLogin, normLogin);
    if (!user) return res.status(401).json({ error: 'Неверный логин или пароль' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Неверный логин или пароль' });

    createSession(user.id, res);

    res.json({
      user: {
        id: user.id,
        surname: user.surname,
        name: user.name,
        patronymic: user.patronymic,
        phone: user.phone,
        email: user.email,
        address: user.address,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  const token = req.cookies[config.sessionCookieName];
  if (token) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    res.clearCookie(config.sessionCookieName, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    });
  }
  res.json({ ok: true });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Не авторизован' });
  res.json(req.user);
});

module.exports = router;
