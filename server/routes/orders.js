const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/orders — создание заказа
router.post('/', (req, res) => {
  try {
    const { items, address, deliveryDateISO, deliveryTime, prepDateISO, contactName, contactPhone, contactEmail, payment_timing, payment_method, payment_status } = req.body;

    if (!items || !items.length) return res.status(400).json({ error: 'Корзина пуста' });
    if (!address) return res.status(400).json({ error: 'Укажите адрес доставки' });
    if (!deliveryDateISO) return res.status(400).json({ error: 'Выберите дату доставки' });
    if (!deliveryTime) return res.status(400).json({ error: 'Выберите время доставки' });
    if (!contactName) return res.status(400).json({ error: 'Укажите имя' });
    if (!contactPhone || contactPhone.replace(/\D/g, '').length < 11) return res.status(400).json({ error: 'Укажите корректный телефон' });

    const totalPrice = items.reduce((sum, it) => sum + (it.unitPrice || 0) * (it.qty || 0), 0);
    const totalPrepHours = items.reduce((sum, it) => sum + (it.prepHours || 1) * (it.qty || 0), 0);

    // Вычисляем дату приготовления (день до доставки)
    const deliveryDate = new Date(deliveryDateISO);
    const prepDate = new Date(deliveryDate);
    prepDate.setDate(prepDate.getDate() - 1);
    const prepISO = prepDate.toISOString().slice(0, 10);

    const orderId = uuidv4();
    const normPhone = '+' + contactPhone.replace(/\D/g, '');
    const userId = req.user ? req.user.id : null;

    // Вставляем заказ
    db.prepare(`
      INSERT INTO orders (id, user_id, status, total_price, total_prep_hours, address, delivery_date, delivery_time, prep_date, contact_name, contact_phone, contact_email, payment_timing, payment_method, payment_status)
      VALUES (?, ?, 'new', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(orderId, userId, totalPrice, totalPrepHours, address.trim(), deliveryDateISO, deliveryTime, prepISO, contactName.trim(), normPhone, (contactEmail || '').trim(), payment_timing || 'on_delivery', payment_method || 'cash', payment_status || 'pending');

    // Вставляем позиции
    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, title, image, qty, unit_price, prep_hours, option_key, options_json, options_label_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((orderItems) => {
      for (const it of orderItems) {
        insertItem.run(
          orderId,
          it.productId || '',
          it.title || '',
          it.image || '',
          it.qty || 1,
          it.unitPrice || 0,
          it.prepHours || 1,
          it.optionKey || null,
          JSON.stringify(it.options || {}),
          JSON.stringify(it.optionsLabel || {})
        );
      }
    });

    insertMany(items);

    // Возвращаем созданный заказ
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    const orderItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);

    res.json({
      orderId: orderId,
      order: {
        ...order,
        createdAtISO: order.created_at,
        deliveryDateISO: order.delivery_date,
        items: orderItems.map(it => ({
          productId: it.product_id,
          title: it.title,
          image: it.image,
          qty: it.qty,
          unitPrice: it.unit_price,
          prepHours: it.prep_hours,
          optionKey: it.option_key,
          options: JSON.parse(it.options_json || '{}'),
          optionsLabel: JSON.parse(it.options_label_json || '{}')
        }))
      }
    });

  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/orders — заказы текущего пользователя
router.get('/', requireAuth, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);

  const result = orders.map(o => {
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(o.id);
    return {
      id: o.id,
      createdAtISO: o.created_at,
      status: o.status,
      totalPrice: o.total_price,
      totalPrepHours: o.total_prep_hours,
      address: o.address,
      deliveryDateISO: o.delivery_date,
      deliveryTime: o.delivery_time,
      prepDateISO: o.prep_date,
      contactName: o.contact_name,
      contactPhone: o.contact_phone,
      contactEmail: o.contact_email,
      userId: o.user_id,
      items: items.map(it => ({
        productId: it.product_id,
        title: it.title,
        image: it.image,
        qty: it.qty,
        unitPrice: it.unit_price,
        prepHours: it.prep_hours,
        optionKey: it.option_key,
        options: JSON.parse(it.options_json || '{}'),
        optionsLabel: JSON.parse(it.options_label_json || '{}')
      }))
    };
  });

  res.json(result);
});

// GET /api/orders/availability?from=YYYY-MM-DD&days=21
// Возвращает данные загрузки для календаря (без персональных данных)
router.get('/availability', (req, res) => {
  const from = req.query.from || new Date().toISOString().slice(0, 10);
  const days = parseInt(req.query.days) || 21;

  // Собираем все заказы с prep_date и delivery_date в диапазоне
  const orders = db.prepare(`
    SELECT id, status, total_prep_hours, address, delivery_date, delivery_time, prep_date
    FROM orders
    WHERE status NOT IN ('cancelled')
  `).all();

  // Формируем ответ, совместимый с loadOrders() на фронте
  const result = orders.map(o => ({
    id: o.id,
    status: o.status,
    totalPrepHours: o.total_prep_hours,
    address: o.address,
    deliveryDateISO: o.delivery_date,
    deliveryTime: o.delivery_time,
    prepDateISO: o.prep_date
  }));

  res.json(result);
});

module.exports = router;
