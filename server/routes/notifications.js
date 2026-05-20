const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/notifications — список уведомлений текущего пользователя
router.get('/', requireAuth, (req, res) => {
  try {
    const notifs = db.prepare(`
      SELECT id, type, title, text, is_read, created_at
      FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(req.user.id);
    res.json(notifs);
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/notifications/unread-count — количество непрочитанных
router.get('/unread-count', requireAuth, (req, res) => {
  try {
    const row = db.prepare(`
      SELECT COUNT(*) as count FROM notifications
      WHERE user_id = ? AND is_read = 0
    `).get(req.user.id);
    res.json({ count: row.count });
  } catch (err) {
    console.error('Unread count error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// PUT /api/notifications/:id/read — пометить как прочитанное
router.put('/:id/read', requireAuth, (req, res) => {
  try {
    db.prepare(`
      UPDATE notifications SET is_read = 1
      WHERE id = ? AND user_id = ?
    `).run(req.params.id, req.user.id);
    res.json({ ok: true });
  } catch (err) {
    console.error('Mark read error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// PUT /api/notifications/read-all — пометить все как прочитанные
router.put('/read-all', requireAuth, (req, res) => {
  try {
    db.prepare(`
      UPDATE notifications SET is_read = 1
      WHERE user_id = ? AND is_read = 0
    `).run(req.user.id);
    res.json({ ok: true });
  } catch (err) {
    console.error('Mark all read error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
