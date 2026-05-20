const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');

const router = express.Router();

// Настройка multer для загрузки фото/видео
const uploadsDir = path.join(__dirname, '..', '..', 'uploads', 'reviews');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '_' + Math.random().toString(36).slice(2, 8) + ext;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 МБ
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|mp4|mov|webm)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('Неподдерживаемый формат файла'));
    }
  }
});

// GET /api/reviews — публичный список отзывов
router.get('/', (req, res) => {
  try {
    const reviews = db.prepare(`
      SELECT id, name, rating, text, photos, created_at
      FROM reviews
      WHERE status = 'published'
      ORDER BY created_at DESC
    `).all();

    // Парсим JSON поле photos
    reviews.forEach(r => {
      try { r.photos = JSON.parse(r.photos); }
      catch { r.photos = []; }
    });

    res.json(reviews);
  } catch (err) {
    console.error('Get reviews error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /api/reviews — создать отзыв
router.post('/', upload.array('photos', 5), (req, res) => {
  try {
    const { name, rating, text } = req.body;

    if (!name || !name.trim()) return res.status(400).json({ error: 'Введите имя' });
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Укажите оценку от 1 до 5' });
    if (!text || !text.trim()) return res.status(400).json({ error: 'Введите текст отзыва' });

    const userId = req.user ? req.user.id : null;
    const photos = (req.files || []).map(f => '/uploads/reviews/' + f.filename);

    db.prepare(`
      INSERT INTO reviews (user_id, name, rating, text, photos)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, name.trim(), Number(rating), text.trim(), JSON.stringify(photos));

    res.json({ ok: true });
  } catch (err) {
    console.error('Create review error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
