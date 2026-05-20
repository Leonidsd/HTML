const express = require('express');
const db = require('../db');

const router = express.Router();

// POST /api/contact — отправить сообщение администратору
router.post('/', (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !name.trim()) return res.status(400).json({ error: 'Введите имя' });
    if (!message || !message.trim()) return res.status(400).json({ error: 'Введите сообщение' });

    const userId = req.user ? req.user.id : null;

    db.prepare(`
      INSERT INTO contact_messages (user_id, name, email, phone, message)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, name.trim(), (email || '').trim(), (phone || '').trim(), message.trim());

    res.json({ ok: true });
  } catch (err) {
    console.error('Contact message error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
