const express = require('express');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/orders — все заказы
router.get('/orders', requireAdmin, (req, res) => {
  const status = req.query.status;
  const search = req.query.search;

  let query = 'SELECT * FROM orders';
  const params = [];
  const conditions = [];

  if (status && status !== 'all') {
    conditions.push('status = ?');
    params.push(status);
  }

  if (search) {
    conditions.push('(contact_name LIKE ? OR contact_phone LIKE ? OR id LIKE ?)');
    const like = '%' + search + '%';
    params.push(like, like, like);
  }

  if (conditions.length) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC';

  const orders = db.prepare(query).all(...params);

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
      user_id: o.user_id,
      courier_id: o.courier_id,
      items: items.map(it => ({
        productId: it.product_id,
        title: it.title,
        image: it.image,
        qty: it.qty,
        unitPrice: it.unit_price,
        prepHours: it.prep_hours,
        options: JSON.parse(it.options_json || '{}'),
        optionsLabel: JSON.parse(it.options_label_json || '{}')
      }))
    };
  });

  res.json(result);
});

// PUT /api/admin/orders/:id — обновление статуса
router.put('/orders/:id', requireAdmin, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['new', 'confirmed', 'cooking', 'delivery', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Некорректный статус' });
  }

  const order = db.prepare('SELECT id FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Заказ не найден' });

  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);

  res.json({ ok: true, status });
});

// PUT /api/admin/orders/:id/courier — назначить курьера
router.put('/orders/:id/courier', requireAdmin, (req, res) => {
  const { courierId } = req.body;

  const order = db.prepare('SELECT id FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Заказ не найден' });

  db.prepare('UPDATE orders SET courier_id = ? WHERE id = ?').run(courierId || '', req.params.id);

  res.json({ ok: true });
});

// GET /api/admin/users — список пользователей
router.get('/users', requireAdmin, (req, res) => {
  const users = db.prepare('SELECT id, surname, name, patronymic, phone, email, address, role, created_at FROM users ORDER BY created_at DESC').all();
  res.json(users);
});

// ===================== PRODUCTS =====================

// GET /api/admin/products
router.get('/products', requireAdmin, (req, res) => {
  const collection = req.query.collection;
  const search = req.query.search;

  let query = 'SELECT * FROM products';
  const params = [];
  const conds = [];

  if (collection) {
    conds.push('collection = ?');
    params.push(collection);
  }
  if (search) {
    conds.push('name LIKE ?');
    params.push('%' + search + '%');
  }
  if (conds.length) query += ' WHERE ' + conds.join(' AND ');
  query += ' ORDER BY id ASC';

  res.json(db.prepare(query).all(...params));
});

// POST /api/admin/products
router.post('/products', requireAdmin, (req, res) => {
  const { name, collection, collection_label, price, min_qty, image, status } = req.body;
  if (!name || !collection) return res.status(400).json({ error: 'Название и коллекция обязательны' });

  const info = db.prepare(`
    INSERT INTO products (name, collection, collection_label, price, min_qty, image, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(name, collection, collection_label || '', price || '', min_qty || '', image || '', status || 'active');

  res.json(db.prepare('SELECT * FROM products WHERE id = ?').get(info.lastInsertRowid));
});

// PUT /api/admin/products/:id
router.put('/products/:id', requireAdmin, (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Товар не найден' });

  const { name, collection, collection_label, price, min_qty, image, status } = req.body;

  db.prepare(`
    UPDATE products SET name=?, collection=?, collection_label=?, price=?, min_qty=?, image=?, status=?
    WHERE id=?
  `).run(
    name ?? product.name,
    collection ?? product.collection,
    collection_label ?? product.collection_label,
    price ?? product.price,
    min_qty ?? product.min_qty,
    image ?? product.image,
    status ?? product.status,
    req.params.id
  );

  res.json(db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id));
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', requireAdmin, (req, res) => {
  const product = db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Товар не найден' });

  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ===================== RECIPES =====================

// GET /api/admin/recipes — список (с названием десерта и кол-вом ингредиентов)
router.get('/recipes', requireAdmin, (req, res) => {
  const rows = db.prepare(`
    SELECT r.id, r.product_id, r.description, r.updated_at,
           p.name AS product_name, p.collection,
           (SELECT COUNT(*) FROM recipe_ingredients WHERE recipe_id = r.id) AS ingredient_count
    FROM recipes r
    JOIN products p ON p.id = r.product_id
    ORDER BY p.name ASC
  `).all();
  res.json(rows);
});

// GET /api/admin/recipes/:id — детали с ингредиентами
router.get('/recipes/:id', requireAdmin, (req, res) => {
  const recipe = db.prepare(`
    SELECT r.id, r.product_id, r.description, r.prep_hours, r.updated_at, p.name AS product_name
    FROM recipes r
    JOIN products p ON p.id = r.product_id
    WHERE r.id = ?
  `).get(req.params.id);

  if (!recipe) return res.status(404).json({ error: 'Рецепт не найден' });

  recipe.ingredients = db.prepare(`
    SELECT ri.id, ri.ingredient_id, ri.amount, i.name AS ingredient_name, i.unit
    FROM recipe_ingredients ri
    JOIN ingredients i ON i.id = ri.ingredient_id
    WHERE ri.recipe_id = ?
    ORDER BY i.name ASC
  `).all(req.params.id);

  res.json(recipe);
});

// POST /api/admin/recipes
router.post('/recipes', requireAdmin, (req, res) => {
  const { product_id, description, prep_hours, ingredients } = req.body;
  if (!product_id) return res.status(400).json({ error: 'Укажите товар' });

  const existing = db.prepare('SELECT id FROM recipes WHERE product_id = ?').get(product_id);
  if (existing) return res.status(400).json({ error: 'Рецепт для этого товара уже существует' });

  const insert = db.transaction(() => {
    const info = db.prepare('INSERT INTO recipes (product_id, description, prep_hours) VALUES (?, ?, ?)').run(product_id, description || '', prep_hours || 1);
    const recipeId = info.lastInsertRowid;

    if (Array.isArray(ingredients)) {
      const stmt = db.prepare('INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount) VALUES (?, ?, ?)');
      for (const ing of ingredients) {
        stmt.run(recipeId, ing.ingredient_id, ing.amount);
      }
    }

    return recipeId;
  });

  const recipeId = insert();
  res.json(db.prepare('SELECT * FROM recipes WHERE id = ?').get(recipeId));
});

// PUT /api/admin/recipes/:id
router.put('/recipes/:id', requireAdmin, (req, res) => {
  const recipe = db.prepare('SELECT id FROM recipes WHERE id = ?').get(req.params.id);
  if (!recipe) return res.status(404).json({ error: 'Рецепт не найден' });

  const { product_id, description, prep_hours, ingredients } = req.body;

  const update = db.transaction(() => {
    if (description !== undefined || product_id !== undefined || prep_hours !== undefined) {
      const cur = db.prepare('SELECT * FROM recipes WHERE id = ?').get(req.params.id);
      db.prepare('UPDATE recipes SET product_id=?, description=?, prep_hours=?, updated_at=datetime(\'now\') WHERE id=?').run(
        product_id ?? cur.product_id,
        description ?? cur.description,
        prep_hours ?? cur.prep_hours ?? 1,
        req.params.id
      );
    }

    if (Array.isArray(ingredients)) {
      db.prepare('DELETE FROM recipe_ingredients WHERE recipe_id = ?').run(req.params.id);
      const stmt = db.prepare('INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount) VALUES (?, ?, ?)');
      for (const ing of ingredients) {
        stmt.run(req.params.id, ing.ingredient_id, ing.amount);
      }
    }
  });

  update();
  res.json({ ok: true });
});

// DELETE /api/admin/recipes/:id
router.delete('/recipes/:id', requireAdmin, (req, res) => {
  const recipe = db.prepare('SELECT id FROM recipes WHERE id = ?').get(req.params.id);
  if (!recipe) return res.status(404).json({ error: 'Рецепт не найден' });

  db.prepare('DELETE FROM recipes WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ===================== INGREDIENTS =====================

// GET /api/admin/ingredients
router.get('/ingredients', requireAdmin, (req, res) => {
  const search = req.query.search;
  let query = 'SELECT * FROM ingredients';
  const params = [];

  if (search) {
    query += ' WHERE name LIKE ?';
    params.push('%' + search + '%');
  }
  query += ' ORDER BY name ASC';

  res.json(db.prepare(query).all(...params));
});

// POST /api/admin/ingredients
router.post('/ingredients', requireAdmin, (req, res) => {
  const { name, unit, stock, threshold } = req.body;
  if (!name || !unit) return res.status(400).json({ error: 'Название и единица измерения обязательны' });

  const existing = db.prepare('SELECT id FROM ingredients WHERE name = ?').get(name);
  if (existing) return res.status(400).json({ error: 'Ингредиент с таким названием уже существует' });

  const info = db.prepare('INSERT INTO ingredients (name, unit, stock, threshold) VALUES (?, ?, ?, ?)').run(
    name, unit, stock ?? 0, threshold ?? 0
  );

  res.json(db.prepare('SELECT * FROM ingredients WHERE id = ?').get(info.lastInsertRowid));
});

// PUT /api/admin/ingredients/:id
router.put('/ingredients/:id', requireAdmin, (req, res) => {
  const ingredient = db.prepare('SELECT * FROM ingredients WHERE id = ?').get(req.params.id);
  if (!ingredient) return res.status(404).json({ error: 'Ингредиент не найден' });

  const { name, unit, stock, threshold } = req.body;

  db.prepare('UPDATE ingredients SET name=?, unit=?, stock=?, threshold=? WHERE id=?').run(
    name ?? ingredient.name,
    unit ?? ingredient.unit,
    stock ?? ingredient.stock,
    threshold ?? ingredient.threshold,
    req.params.id
  );

  res.json(db.prepare('SELECT * FROM ingredients WHERE id = ?').get(req.params.id));
});

// DELETE /api/admin/ingredients/:id
router.delete('/ingredients/:id', requireAdmin, (req, res) => {
  const ingredient = db.prepare('SELECT id FROM ingredients WHERE id = ?').get(req.params.id);
  if (!ingredient) return res.status(404).json({ error: 'Ингредиент не найден' });

  const usedIn = db.prepare('SELECT COUNT(*) AS cnt FROM recipe_ingredients WHERE ingredient_id = ?').get(req.params.id);
  if (usedIn.cnt > 0) {
    return res.status(400).json({ error: 'Ингредиент используется в ' + usedIn.cnt + ' рецептах. Сначала удалите его из рецептов.' });
  }

  db.prepare('DELETE FROM ingredients WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ====== Обращения (contact_messages) ======

// GET /api/admin/messages
router.get('/messages', requireAdmin, (req, res) => {
  const status = req.query.status;
  let query = 'SELECT * FROM contact_messages';
  const params = [];

  if (status && status !== 'all') {
    query += ' WHERE status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC';
  res.json(db.prepare(query).all(...params));
});

// PUT /api/admin/messages/:id
router.put('/messages/:id', requireAdmin, (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE contact_messages SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ ok: true });
});

// DELETE /api/admin/messages/:id
router.delete('/messages/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM contact_messages WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// POST /api/admin/messages/:id/reply — ответить на обращение
router.post('/messages/:id/reply', requireAdmin, (req, res) => {
  try {
    const { reply_text } = req.body;
    if (!reply_text || !reply_text.trim()) {
      return res.status(400).json({ error: 'Введите текст ответа' });
    }

    const msg = db.prepare('SELECT * FROM contact_messages WHERE id = ?').get(req.params.id);
    if (!msg) return res.status(404).json({ error: 'Обращение не найдено' });

    // Сохранить ответ
    db.prepare(`
      UPDATE contact_messages SET admin_reply = ?, reply_date = datetime('now'), status = 'replied'
      WHERE id = ?
    `).run(reply_text.trim(), req.params.id);

    // Если пользователь зарегистрирован — создать уведомление
    const hasUser = !!msg.user_id;
    if (hasUser) {
      db.prepare(`
        INSERT INTO notifications (user_id, type, title, text)
        VALUES (?, 'reply', 'Ответ на ваше обращение', ?)
      `).run(msg.user_id, reply_text.trim());
    }

    res.json({ ok: true, hasUser });
  } catch (err) {
    console.error('Reply to message error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ====== Отзывы (reviews) — админ ======

// GET /api/admin/reviews
router.get('/reviews', requireAdmin, (req, res) => {
  const reviews = db.prepare('SELECT * FROM reviews ORDER BY created_at DESC').all();
  reviews.forEach(r => {
    try { r.photos = JSON.parse(r.photos); }
    catch { r.photos = []; }
  });
  res.json(reviews);
});

// PUT /api/admin/reviews/:id
router.put('/reviews/:id', requireAdmin, (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE reviews SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ ok: true });
});

// DELETE /api/admin/reviews/:id
router.delete('/reviews/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM reviews WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
