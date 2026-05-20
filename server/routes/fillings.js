const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

// GET /api/fillings — список всех начинок (для клиентов тоже, но видимые)
router.get('/', (req, res) => {
  const showHidden = req.query.showHidden === 'true';
  let sql = 'SELECT * FROM fillings';
  if (!showHidden) {
    sql += ' WHERE is_hidden = 0';
  }
  sql += ' ORDER BY sort_order ASC, name ASC';
  const fillings = db.prepare(sql).all();
  res.json(fillings);
});

// GET /api/fillings/:id — детали начинки
router.get('/:id', (req, res) => {
  const filling = db.prepare('SELECT * FROM fillings WHERE id = ?').get(req.params.id);
  if (!filling) return res.status(404).json({ error: 'Начинка не найдена' });
  res.json(filling);
});

// POST /api/fillings — создать новую начинку (только админ)
router.post('/', requireAdmin, (req, res) => {
  const { id, name, price, recipe_id } = req.body;
  if (!id || !name) return res.status(400).json({ error: 'Укажите ID и название' });

  const existing = db.prepare('SELECT id FROM fillings WHERE id = ?').get(id);
  if (existing) return res.status(400).json({ error: 'Начинка с таким ID уже существует' });

  const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM fillings').get().max || 0;

  try {
    db.prepare('INSERT INTO fillings (id, name, price, recipe_id, sort_order) VALUES (?, ?, ?, ?, ?)').run(
      id,
      name,
      price || 0,
      recipe_id || null,
      maxOrder + 1
    );
    const created = db.prepare('SELECT * FROM fillings WHERE id = ?').get(id);
    res.json(created);
  } catch (e) {
    res.status(500).json({ error: 'Ошибка создания начинки' });
  }
});

// PUT /api/fillings/:id — обновить начинку (только админ)
router.put('/:id', requireAdmin, (req, res) => {
  const filling = db.prepare('SELECT id FROM fillings WHERE id = ?').get(req.params.id);
  if (!filling) return res.status(404).json({ error: 'Начинка не найдена' });

  const { name, price, is_hidden, recipe_id, sort_order } = req.body;
  const current = db.prepare('SELECT * FROM fillings WHERE id = ?').get(req.params.id);

  try {
    db.prepare(`UPDATE fillings
                SET name = ?, price = ?, is_hidden = ?, recipe_id = ?, sort_order = ?
                WHERE id = ?`).run(
      name !== undefined ? name : current.name,
      price !== undefined ? price : current.price,
      is_hidden !== undefined ? is_hidden : current.is_hidden,
      recipe_id !== undefined ? recipe_id : current.recipe_id,
      sort_order !== undefined ? sort_order : current.sort_order,
      req.params.id
    );
    const updated = db.prepare('SELECT * FROM fillings WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'Ошибка обновления начинки' });
  }
});

// DELETE /api/fillings/:id — удалить начинку (только админ)
router.delete('/:id', requireAdmin, (req, res) => {
  const filling = db.prepare('SELECT id FROM fillings WHERE id = ?').get(req.params.id);
  if (!filling) return res.status(404).json({ error: 'Начинка не найдена' });

  try {
    db.prepare('DELETE FROM fillings WHERE id = ?').run(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Ошибка удаления начинки' });
  }
});

// ========== РЕЦЕПТЫ НАЧИНОК ==========

// GET /api/fillings/:id/recipe — получить рецепт начинки
router.get('/:id/recipe', requireAdmin, (req, res) => {
  const filling = db.prepare('SELECT * FROM fillings WHERE id = ?').get(req.params.id);
  if (!filling) return res.status(404).json({ error: 'Начинка не найдена' });

  const ingredients = db.prepare(`
    SELECT fr.id, fr.ingredient_id, fr.amount, i.name AS ingredient_name, i.unit
    FROM filling_recipes fr
    JOIN ingredients i ON i.id = fr.ingredient_id
    WHERE fr.filling_id = ?
    ORDER BY i.name ASC
  `).all(req.params.id);

  res.json({ filling, ingredients });
});

// PUT /api/fillings/:id/recipe — обновить рецепт начинки
router.put('/:id/recipe', requireAdmin, (req, res) => {
  const filling = db.prepare('SELECT id FROM fillings WHERE id = ?').get(req.params.id);
  if (!filling) return res.status(404).json({ error: 'Начинка не найдена' });

  const { ingredients } = req.body;

  const update = db.transaction(() => {
    // Удалить старые ингредиенты
    db.prepare('DELETE FROM filling_recipes WHERE filling_id = ?').run(req.params.id);

    // Добавить новые
    if (Array.isArray(ingredients)) {
      const stmt = db.prepare('INSERT INTO filling_recipes (filling_id, ingredient_id, amount) VALUES (?, ?, ?)');
      for (const ing of ingredients) {
        if (ing.ingredient_id && ing.amount) {
          stmt.run(req.params.id, ing.ingredient_id, ing.amount);
        }
      }
    }

    // Обновить время изменения
    db.prepare('UPDATE filling_recipes SET updated_at = datetime(\'now\') WHERE filling_id = ?').run(req.params.id);
  });

  try {
    update();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Ошибка обновления рецепта' });
  }
});

module.exports = router;
