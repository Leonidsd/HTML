const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const config = require('./config');
const { authMiddleware } = require('./middleware/auth');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(authMiddleware);

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/courier', require('./routes/courier'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/fillings', require('./routes/fillings'));

// Загруженные файлы (фото отзывов)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Статические файлы из корня проекта
app.use(express.static(path.join(__dirname, '..')));

app.listen(config.port, () => {
  console.log(`Сервер запущен: http://localhost:${config.port}`);
});
