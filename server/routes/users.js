const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// PUT /api/users/:id — обновление профиля
router.put('/:id', requireAuth, (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'Можно редактировать только свой профиль' });
  }

  const { surname, name, patronymic, phone, email, address } = req.body;

  const normPhone = phone ? '+' + phone.replace(/\D/g, '') : req.user.phone;
  const normEmail = email ? email.trim().toLowerCase() : req.user.email;

  // Проверяем, не занят ли телефон другим пользователем
  if (normPhone !== req.user.phone) {
    const existing = db.prepare('SELECT id FROM users WHERE phone = ? AND id != ?').get(normPhone, req.user.id);
    if (existing) return res.status(400).json({ error: 'Этот телефон уже используется' });
  }

  db.prepare(`
    UPDATE users SET surname = ?, name = ?, patronymic = ?, phone = ?, email = ?, address = ?
    WHERE id = ?
  `).run(
    (surname || '').trim(),
    (name || '').trim(),
    (patronymic || '').trim(),
    normPhone,
    normEmail,
    (address || '').trim(),
    req.user.id
  );

  const updated = db.prepare('SELECT id, surname, name, patronymic, phone, email, address, role FROM users WHERE id = ?').get(req.user.id);
  res.json(updated);
});

module.exports = router;
