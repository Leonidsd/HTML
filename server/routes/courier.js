const express = require('express');
const db = require('../db');
const { requireCourier } = require('../middleware/auth');

const router = express.Router();

// GET /api/courier/orders — заказы для доставки
router.get('/orders', requireCourier, (req, res) => {
  const date = req.query.date; // YYYY-MM-DD

  let query = "SELECT * FROM orders WHERE status IN ('confirmed', 'cooking', 'delivery', 'delivered')";
  const params = [];

  if (date) {
    query += ' AND delivery_date = ?';
    params.push(date);
  }

  query += ' ORDER BY delivery_time ASC';

  const orders = db.prepare(query).all(...params);

  const result = orders.map(o => {
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(o.id);
    return {
      id: o.id,
      createdAtISO: o.created_at,
      status: o.status,
      totalPrice: o.total_price,
      address: o.address,
      deliveryDateISO: o.delivery_date,
      deliveryTime: o.delivery_time,
      contactName: o.contact_name,
      contactPhone: o.contact_phone,
      items: items.map(it => ({
        title: it.title,
        image: it.image,
        qty: it.qty,
        unitPrice: it.unit_price,
        optionsLabel: JSON.parse(it.options_label_json || '{}')
      }))
    };
  });

  res.json(result);
});

// PUT /api/courier/orders/:id/status — обновление статуса курьером
router.put('/orders/:id/status', requireCourier, (req, res) => {
  const { status } = req.body;
  const allowed = ['delivery', 'delivered'];

  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Курьер может только менять статус на "В доставке" или "Доставлен"' });
  }

  const order = db.prepare('SELECT id FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Заказ не найден' });

  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);

  res.json({ ok: true, status });
});

module.exports = router;
