const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'vkus.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    surname TEXT DEFAULT '',
    name TEXT NOT NULL,
    patronymic TEXT DEFAULT '',
    phone TEXT UNIQUE NOT NULL,
    email TEXT DEFAULT '',
    password_hash TEXT NOT NULL,
    address TEXT DEFAULT '',
    role TEXT DEFAULT 'client',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    expires_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    status TEXT DEFAULT 'new',
    total_price REAL,
    total_prep_hours REAL,
    address TEXT,
    delivery_date TEXT,
    delivery_time TEXT,
    prep_date TEXT,
    contact_name TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL,
    product_id TEXT,
    title TEXT,
    image TEXT,
    qty INTEGER,
    unit_price REAL,
    prep_hours REAL DEFAULT 1,
    option_key TEXT,
    options_json TEXT,
    options_label_json TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
  CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
  CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(delivery_date);
  CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

  -- ====== Каталог, рецептуры, ингредиенты ======
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    collection TEXT NOT NULL,
    collection_label TEXT NOT NULL,
    price TEXT NOT NULL,
    min_qty TEXT NOT NULL,
    image TEXT DEFAULT '',
    status TEXT DEFAULT 'active',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    unit TEXT NOT NULL,
    stock REAL DEFAULT 0,
    threshold REAL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    description TEXT DEFAULT '',
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER NOT NULL,
    ingredient_id INTEGER NOT NULL,
    amount TEXT NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
  );

  CREATE INDEX IF NOT EXISTS idx_recipes_product ON recipes(product_id);
  CREATE INDEX IF NOT EXISTS idx_ri_recipe ON recipe_ingredients(recipe_id);

  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    name TEXT NOT NULL,
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'reply',
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id, is_read);

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    text TEXT NOT NULL,
    photos TEXT DEFAULT '[]',
    status TEXT DEFAULT 'published',
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// ====== Сидирование каталога ======
const needsSeed = db.prepare('SELECT COUNT(*) as c FROM products').get().c === 0;

if (needsSeed) {
  const insertProduct = db.prepare('INSERT INTO products (name, collection, collection_label, price, min_qty, image) VALUES (?,?,?,?,?,?)');
  const insertIngredient = db.prepare('INSERT OR IGNORE INTO ingredients (name, unit, stock, threshold) VALUES (?,?,?,?)');
  const insertRecipe = db.prepare('INSERT INTO recipes (product_id, description) VALUES (?,?)');
  const insertRI = db.prepare('INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount) VALUES (?,?,?)');

  const seed = db.transaction(() => {
    // -- Ингредиенты --
    const ings = [
      ['Мука пшеничная в/с','кг',25,5], ['Сахар','кг',18,3], ['Сахарная пудра','кг',8,2],
      ['Масло сливочное 82.5%','кг',8,3], ['Яйца куриные С0','шт',120,30],
      ['Сливки 33%','л',2,5], ['Сливочный сыр (крем-чиз)','кг',6,3],
      ['Молоко 3.2%','л',10,3], ['Шоколад тёмный 70%','кг',4,2],
      ['Шоколад белый','кг',3,2], ['Какао-порошок','кг',2.5,1],
      ['Какао-масло','кг',1.5,1], ['Ванильный экстракт','л',0.8,0.3],
      ['Желатин листовой','кг',1.2,0.5], ['Глюкозный сироп','кг',4,1.5],
      ['Разрыхлитель','кг',1,0.3], ['Лимонная кислота','кг',0.3,0.1],
      ['Соль','кг',1.5,0.3], ['Крахмал кукурузный','кг',2,0.5],
      ['Творог 9%','кг',5,2], ['Молоко сгущённое','кг',6,2],
      ['Фисташковая паста','кг',0,1], ['Пюре клубничное','кг',3,1],
      ['Пюре малиновое','кг',2.5,1], ['Пюре манго','кг',1.8,1],
      ['Пюре маракуйя','кг',0.5,1], ['Голубика свежая','кг',1,0.5],
      ['Клубника свежая','кг',2,1], ['Малина свежая','кг',0.8,0.5],
      ['Лимоны','кг',3,1], ['Глицерин пищевой','л',0.5,0.2],
      ['Красители пищевые','шт',12,4], ['Миндальная мука','кг',3,1],
      ['Кофе молотый','кг',1,0.3], ['Маршмеллоу','кг',2,0.5],
      ['Вафельная бумага','лист',50,15], ['Мастика готовая','кг',3,1],
      ['Сливки растительные','л',5,2], ['Дрожжи сухие','кг',0.5,0.2],
      ['Арахис жареный','кг',2,0.5], ['Карамель','кг',3,1],
      ['Бананы','кг',4,1], ['Вишня замороженная','кг',2,1],
      ['Кокосовая стружка','кг',1.5,0.5], ['Ликёр Амаретто','л',0.3,0.1]
    ];
    ings.forEach(i => insertIngredient.run(...i));

    // Хелпер: id ингредиента по имени
    const ingId = (name) => db.prepare('SELECT id FROM ingredients WHERE name=?').get(name)?.id;

    // -- Продукты + рецепты --
    const products = [
      // Casual / Летняя
      ['Торт «Ягодное лукошко»','casual','Casual / Летняя','от 3 300 ₽','от 3 кг','img/summer-1.jpg'],
      ['3D Пирожные с малиной','casual','Casual / Летняя','от 750 ₽','от 4 шт','img/summer-2.jpg'],
      ['Зефир в вафельном стаканчике','casual','Casual / Летняя','от 400 ₽','от 6 шт','img/summer-3.jpg'],
      ['Торт «Праздничный шик»','casual','Casual / Летняя','от 4 500 ₽','от 3 кг','img/summer-4.jpg'],
      ['Бенто-Торт «Любящие сердца»','casual','Casual / Летняя','1 000 ₽','от 1 шт','img/summer-5.jpg'],
      ['Меренговый рулет с ягодами','casual','Casual / Летняя','1 100 ₽','1 кг','img/summer-6.jpg'],
      // Бенто
      ['Бенто «Клубника»','casual','Casual / Бенто','1 000 ₽','от 1 шт','img/bento-1.jpg'],
      ['Бенто «Любовь»','casual','Casual / Бенто','1 250 ₽','от 1 шт','img/bento-2.jpg'],
      ['Бенто «Капибара»','casual','Casual / Бенто','1 100 ₽','от 1 шт','img/bento-3.jpg'],
      ['Бенто «Любимой маме»','casual','Casual / Бенто','1 200 ₽','от 1 шт','img/bento-4.jpg'],
      ['Бенто «Моей булочке»','casual','Casual / Бенто','1 150 ₽','от 1 шт','img/bento-5.jpg'],
      ['Бенто «Happy Birthday»','casual','Casual / Бенто','1 050 ₽','от 1 шт','img/bento-6.jpg'],
      // 23 февраля
      ['Десерт «Пиво»','casual','Casual / 23 февраля','700 ₽','от 1 шт','img/february-1.jpg'],
      ['Macarons «23»','casual','Casual / 23 февраля','1 670 ₽','от 8 шт','img/february-2.jpg'],
      ['Пирожные «Защитник»','casual','Casual / 23 февраля','900 ₽','от 4 шт','img/february-3.jpg'],
      ['Бенто «23 февраля»','casual','Casual / 23 февраля','1 100 ₽','от 1 шт','img/february-4.jpg'],
      ['Конфеты «Пельмени»','casual','Casual / 23 февраля','550 ₽','от 1 шт','img/february-5.jpg'],
      // Пасха
      ['Десерт «Пасхальные яйца»','casual','Casual / Пасха','900 ₽','от 7 шт','img/easter-1.jpg'],
      ['Творожная пасха','casual','Casual / Пасха','1 300 ₽','от 1 шт','img/easter-2.jpg'],
      ['Пасхальный кулич','casual','Casual / Пасха','350 ₽','от 1 шт','img/easter-3.jpg'],
      ['Творожный чизкейк','casual','Casual / Пасха','1 300 ₽','от 3 шт','img/easter-4.jpg'],
      // Пирожные
      ['Мини Чизкейк','casual','Casual / Пирожные','от 300 ₽','от 2 шт','img/cakes-1.jpg'],
      ['Ассорти пирожных','casual','Casual / Пирожные','1 200 ₽','набор 4 шт','img/cakes-2.jpg'],
      ['Муссовые сердца','casual','Casual / Пирожные','от 750 ₽','от 4 шт','img/cakes-3.jpg'],
      ['Пирожное картошка','casual','Casual / Пирожные','от 600 ₽','от 4 шт','img/cakes-4.jpg'],
      ['Мадлен','casual','Casual / Пирожные','от 860 ₽','от 8 шт','img/cakes-5.jpg'],
      // Муссовые
      ['Шоколадный муссовый бенто','casual','Casual / Муссовые','1 280 ₽','от 1 шт','img/mousse-1.jpg'],
      ['Ягодный муссовый бенто','casual','Casual / Муссовые','1 150 ₽','от 1 шт','img/mousse-2.jpg'],
      ['Кремовый муссовый бенто','casual','Casual / Муссовые','1 150 ₽','от 1 шт','img/mousse-3.jpg'],
      ['Лимонный муссовый бенто','casual','Casual / Муссовые','900 ₽','от 1 шт','img/mousse-4.jpg'],
      ['Кофейный муссовый бенто','casual','Casual / Муссовые','850 ₽','от 1 шт','img/mousse-5.jpg'],
      // Macarons
      ['Набор Macarons №1','casual','Casual / Macarons','1 800 ₽','от 1 шт','img/macarons-1.jpg'],
      ['Набор Macarons №2','casual','Casual / Macarons','1 890 ₽','от 1 шт','img/macarons-2.jpg'],
      ['Набор Macarons №3','casual','Casual / Macarons','1 900 ₽','от 1 шт','img/macarons-3.jpg'],
      ['Набор Macarons №4','casual','Casual / Macarons','1 700 ₽','от 1 шт','img/macarons-4.jpg'],
      ['Классические Macarons','casual','Casual / Macarons','1 200 ₽','от 1 шт','img/macarons-5.jpg'],
      ['Набор Macarons №5','casual','Casual / Macarons','1 400 ₽','от 1 шт','img/macarons-6.jpg'],
      // Конфеты
      ['Дубайский шоколад','casual','Casual / Конфеты','1 200 ₽','от 1 шт','img/candies-1.jpg'],
      ['Конфеты «Галактическая любовь»','casual','Casual / Конфеты','450 ₽','от 1 шт','img/candies-2.jpg'],
      ['Набор конфет №1','casual','Casual / Конфеты','500 ₽','от 1 шт','img/candies-3.jpg'],
      ['Набор конфет №2','casual','Casual / Конфеты','300 ₽','от 1 шт','img/candies-4.jpg'],
      ['Набор конфет «Поцелуй»','casual','Casual / Конфеты','780 ₽','от 1 шт','img/candies-5.jpg'],
      ['Конфеты «Сердечки»','casual','Casual / Конфеты','570 ₽','от 1 шт','img/candies-6.jpg'],
      // Чизкейки
      ['Чизкейк «Дубайский шоколад»','casual','Casual / Чизкейки','1 200 ₽','от 1 шт','img/cheesecake-1.jpg'],
      ['Чизкейк «Малина-маракуйя»','casual','Casual / Чизкейки','1 150 ₽','от 1 шт','img/cheesecake-2.jpg'],
      ['Чизкейк «Тирамису»','casual','Casual / Чизкейки','1 000 ₽','от 1 шт','img/cheesecake-3.jpg'],
      ['Чизкейк «С голубикой»','casual','Casual / Чизкейки','1 170 ₽','от 1 шт','img/cheesecake-4.jpg'],
      // To order / Торты
      ['Торт наполеон с ягодами','order','To order / Торты','4 500 ₽','от 2 кг','img/картинки для сайта/Торты/Торт наполеон с ягодами.jpg'],
      ['Торт «Праздничный шик» (To order)','order','To order / Торты','6 800 ₽','от 3 кг','img/картинки для сайта/Торты/Торт Праздничный шик.jpg'],
      ['Торт расписной цветами','order','To order / Торты','3 200 ₽','от 3 кг','img/картинки для сайта/Торты/Торт расписной цветами.jpg'],
      ['Торт с бабочками из вафельной бумаги','order','To order / Торты','6 500 ₽','от 3 кг','img/картинки для сайта/Торты/Торт с бабочками из вафельной бумаги.jpg'],
      ['Торт «Ягодное лукошко» (To order)','order','To order / Торты','7 200 ₽','от 3 кг','img/картинки для сайта/Торты/Торт Ягодное лукошко.jpg'],
      // 3D-торты
      ['Торт «LouisVuitton»','order','To order / 3D-торты','9 600 ₽','от 4 кг','img/картинки для сайта/3D-торты/Торт «LouisVuitton».jpg'],
      ['Торт KFC','order','To order / 3D-торты','6 200 ₽','от 3 кг','img/картинки для сайта/3D-торты/Торт KFC.jpg'],
      ['Торт «Кастрюля с пельменями»','order','To order / 3D-торты','5 900 ₽','от 3 кг','img/картинки для сайта/3D-торты/Торт Кастрюля с пельменями.jpg'],
      ['Торт «Кино»','order','To order / 3D-торты','7 400 ₽','от 6 кг','img/картинки для сайта/3D-торты/Торт Кино.jpg'],
      ['Торт с бабочками 3D','order','To order / 3D-торты','6 500 ₽','от 3 кг','img/картинки для сайта/3D-торты/Торт с бабочками.jpg'],
      // Детские
      ['Мультяшный торт со свечкой','order','To order / Детские','4 800 ₽','от 3 кг','img/картинки для сайта/Детские торты/Мультяшный торт со свечкой.jpg'],
      ['Торт Лабубу','order','To order / Детские','5 500 ₽','от 3 кг','img/картинки для сайта/Детские торты/Торт Лабубу.jpg'],
      ['Торт с маршмеллоу','order','To order / Детские','4 200 ₽','от 2 кг','img/картинки для сайта/Детские торты/Торт с маршмеллоу.jpg'],
      ['Торт с цветными мазками','order','To order / Детские','3 900 ₽','от 2 кг','img/картинки для сайта/Детские торты/Торт с небрежными цветными мазками.jpg'],
      ['Торт с фигуркой корабля','order','To order / Детские','6 500 ₽','от 4 кг','img/картинки для сайта/Детские торты/Торт с фигуркой корабля.jpg'],
      // Свадебные
      ['Свадебный с вафельными рюшами','order','To order / Свадебные','7 800 ₽','от 5 кг','img/картинки для сайта/Свадебные торты/Свадебный с вафельными рюшами.jpg'],
      ['Свадебный торт «Винтаж»','order','To order / Свадебные','6 900 ₽','от 4 кг','img/картинки для сайта/Свадебные торты/Свадебный торт винтаж.jpg'],
      ['Свадебный торт «Воспоминания»','order','To order / Свадебные','7 400 ₽','от 5 кг','img/картинки для сайта/Свадебные торты/Свадебный торт Воспоминания.jpg'],
      ['Свадебный торт с бусинами','order','To order / Свадебные','6 200 ₽','от 4 кг','img/картинки для сайта/Свадебные торты/Свадебный торт с бусинами.jpg'],
      ['Свадебный с цветами и фруктами','order','To order / Свадебные','8 000 ₽','от 6 кг','img/картинки для сайта/Свадебные торты/Свадебный торт с цветами и фруктами.jpg'],
      // День рождения
      ['Торт с котиками','order','To order / День рождения','5 300 ₽','от 3 кг','img/картинки для сайта/На день рождение/Торт с котиками.jpg'],
      ['Торт с цветами','order','To order / День рождения','4 700 ₽','от 3 кг','img/картинки для сайта/На день рождение/Торт с цветами.jpg'],
      ['Торт со свечами-вишнями','order','To order / День рождения','5 900 ₽','от 3 кг','img/картинки для сайта/На день рождение/Торт со свечами вишнями.jpg'],
      ['Торт «Хоккей»','order','To order / День рождения','6 400 ₽','от 4 кг','img/картинки для сайта/На день рождение/Торт Хоккей.jpg'],
      ['Торт-календарь','order','To order / День рождения','5 100 ₽','от 3 кг','img/картинки для сайта/На день рождение/Торт-календарь.jpg']
    ];
    products.forEach(p => insertProduct.run(...p));

    // -- Рецепты для каждого десерта --
    // Шаблоны рецептов по типу десерта (количество в базовых единицах)
    const torte = [['Мука пшеничная в/с','0.3'],['Яйца куриные С0','6'],['Сахар','0.2'],['Масло сливочное 82.5%','0.15'],['Сливки 33%','0.4'],['Сливочный сыр (крем-чиз)','0.3'],['Ванильный экстракт','0.005'],['Разрыхлитель','0.01']];
    const bento = [['Мука пшеничная в/с','0.1'],['Яйца куриные С0','2'],['Сахар','0.08'],['Масло сливочное 82.5%','0.06'],['Сливочный сыр (крем-чиз)','0.15'],['Сливки 33%','0.1'],['Красители пищевые','1']];
    const macaron = [['Миндальная мука','0.15'],['Сахарная пудра','0.15'],['Яйца куриные С0','3'],['Сахар','0.15'],['Красители пищевые','1']];
    const candy = [['Шоколад тёмный 70%','0.2'],['Сливки 33%','0.1'],['Масло сливочное 82.5%','0.03'],['Глюкозный сироп','0.02']];
    const cheesecake = [['Сливочный сыр (крем-чиз)','0.5'],['Сахарная пудра','0.1'],['Яйца куриные С0','3'],['Сливки 33%','0.2'],['Масло сливочное 82.5%','0.08'],['Мука пшеничная в/с','0.1'],['Ванильный экстракт','0.005']];
    const mousse = [['Сливки 33%','0.3'],['Шоколад белый','0.15'],['Желатин листовой','0.01'],['Сахар','0.06'],['Яйца куриные С0','2']];
    const meringue = [['Яйца куриные С0','4'],['Сахарная пудра','0.2'],['Лимонная кислота','0.003'],['Сливки 33%','0.2']];
    const zefir = [['Яйца куриные С0','2'],['Сахар','0.15'],['Пюре клубничное','0.1'],['Желатин листовой','0.008'],['Сахарная пудра','0.05']];
    const pirozhki = [['Мука пшеничная в/с','0.15'],['Яйца куриные С0','2'],['Сахар','0.1'],['Масло сливочное 82.5%','0.08'],['Какао-порошок','0.02'],['Молоко сгущённое','0.05']];
    const tort3d = [['Мука пшеничная в/с','0.4'],['Яйца куриные С0','8'],['Сахар','0.3'],['Масло сливочное 82.5%','0.2'],['Мастика готовая','0.5'],['Красители пищевые','2'],['Сливочный сыр (крем-чиз)','0.4'],['Сливки 33%','0.3']];
    const wedding = [['Мука пшеничная в/с','0.5'],['Яйца куриные С0','10'],['Сахар','0.35'],['Масло сливочное 82.5%','0.3'],['Сливки 33%','0.5'],['Сливочный сыр (крем-чиз)','0.5'],['Ванильный экстракт','0.01'],['Разрыхлитель','0.015']];
    const napoleon = [['Мука пшеничная в/с','0.4'],['Масло сливочное 82.5%','0.3'],['Яйца куриные С0','4'],['Молоко 3.2%','0.5'],['Сахар','0.2'],['Ванильный экстракт','0.005'],['Крахмал кукурузный','0.04']];
    const kulich = [['Мука пшеничная в/с','0.5'],['Яйца куриные С0','5'],['Сахар','0.15'],['Масло сливочное 82.5%','0.1'],['Молоко 3.2%','0.2'],['Дрожжи сухие','0.01'],['Ванильный экстракт','0.005']];
    const tvorog = [['Творог 9%','0.4'],['Сливочный сыр (крем-чиз)','0.2'],['Сахарная пудра','0.08'],['Сливки 33%','0.1'],['Желатин листовой','0.008'],['Ванильный экстракт','0.003']];

    // Маппинг: product id → шаблон рецепта + дополнения
    const allProducts = db.prepare('SELECT id, name FROM products').all();

    allProducts.forEach(p => {
      const n = p.name.toLowerCase();
      let template;
      if (n.includes('macarons') || n.includes('макарон')) template = macaron;
      else if (n.includes('чизкейк')) template = cheesecake;
      else if (n.includes('муссовый') || n.includes('муссовые')) template = mousse;
      else if (n.includes('бенто') || n.includes('любящие сердца')) template = bento;
      else if (n.includes('конфет') || n.includes('шоколад') || n.includes('галактическ') || n.includes('сердечки') || n.includes('пельмени') || n.includes('поцелуй')) template = candy;
      else if (n.includes('меренговый')) template = meringue;
      else if (n.includes('зефир')) template = zefir;
      else if (n.includes('пирожн') || n.includes('картошка') || n.includes('мадлен') || n.includes('ассорти') || n.includes('мини чиз') || n.includes('десерт «пиво»') || n.includes('защитник')) template = pirozhki;
      else if (n.includes('3d') || n.includes('louisvuitton') || n.includes('kfc') || n.includes('кастрюля') || n.includes('кино') || n.includes('бабочками 3d') || n.includes('фигурк') || n.includes('лабубу')) template = tort3d;
      else if (n.includes('свадебн')) template = wedding;
      else if (n.includes('наполеон')) template = napoleon;
      else if (n.includes('кулич')) template = kulich;
      else if (n.includes('творожн') || n.includes('пасха')) template = tvorog;
      else if (n.includes('пасхальные яйца')) template = candy;
      else template = torte;

      // Специфичные добавки
      let extras = [];
      if (n.includes('ягод') || n.includes('лукошко')) extras = [['Клубника свежая','0.2'],['Голубика свежая','0.1'],['Малина свежая','0.1']];
      else if (n.includes('клубник')) extras = [['Клубника свежая','0.15'],['Пюре клубничное','0.05']];
      else if (n.includes('малин')) extras = [['Малина свежая','0.15'],['Пюре малиновое','0.05']];
      else if (n.includes('лимон')) extras = [['Лимоны','0.2'],['Крахмал кукурузный','0.02']];
      else if (n.includes('кофейн')) extras = [['Кофе молотый','0.03']];
      else if (n.includes('шоколадн') && !n.includes('дубайск')) extras = [['Какао-порошок','0.03'],['Шоколад тёмный 70%','0.1']];
      else if (n.includes('дубайск')) extras = [['Фисташковая паста','0.05'],['Шоколад тёмный 70%','0.15']];
      else if (n.includes('маршмеллоу')) extras = [['Маршмеллоу','200 г']];
      else if (n.includes('бабочк') && n.includes('вафельн')) extras = [['Вафельная бумага','10 лист'],['Красители пищевые','2 шт']];
      else if (n.includes('манго') || n.includes('маракуй') || n.includes('тропик')) extras = [['Пюре манго','100 г'],['Пюре маракуйя','80 г']];
      else if (n.includes('голубик')) extras = [['Голубика свежая','200 г']];
      else if (n.includes('тирамису')) extras = [['Кофе молотый','20 г'],['Какао-порошок','15 г']];
      else if (n.includes('расписной') || n.includes('цветами') || n.includes('цветных')) extras = [['Красители пищевые','3 шт']];
      else if (n.includes('фисташк')) extras = [['Фисташковая паста','80 г']];

      const rid = insertRecipe.run(p.id, 'Рецепт для ' + p.name).lastInsertRowid;
      const allIngs = [...template, ...extras];
      const seen = new Set();
      allIngs.forEach(([iName, amt]) => {
        if (seen.has(iName)) return;
        seen.add(iName);
        const iid = ingId(iName);
        if (iid) insertRI.run(rid, iid, amt);
      });
    });
  });

  seed();
  console.log('Сидирование БД завершено: продукты, ингредиенты, рецепты');
}

// Добавить колонки admin_reply и reply_date к contact_messages (если ещё нет)
try { db.exec("ALTER TABLE contact_messages ADD COLUMN admin_reply TEXT DEFAULT ''"); } catch(e) {}
try { db.exec("ALTER TABLE contact_messages ADD COLUMN reply_date TEXT DEFAULT ''"); } catch(e) {}

// Поле для назначения курьера
try { db.exec("ALTER TABLE orders ADD COLUMN courier_id TEXT DEFAULT ''"); } catch(e) {}

// Время приготовления для рецептов
try { db.exec("ALTER TABLE recipes ADD COLUMN prep_hours REAL DEFAULT 1"); } catch(e) {}

// Таблица начинок
db.exec(`
  CREATE TABLE IF NOT EXISTS fillings (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL DEFAULT 0,
    is_hidden INTEGER DEFAULT 0,
    recipe_id INTEGER,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE SET NULL
  );
`);

// Заполнить начинками, если таблица пустая
const fillingsCount = db.prepare('SELECT COUNT(*) as c FROM fillings').get().c;
if (fillingsCount === 0) {
  const insertFilling = db.prepare('INSERT INTO fillings (id, name, price, sort_order) VALUES (?, ?, ?, ?)');
  const defaultFillings = [
    ['snikers', '«Сникерс»', 0, 1],
    ['red-velvet', '«Красный бархат»', 0, 2],
    ['carrot', '«Морковный»', 0, 3],
    ['berry', '«Ягодный»', 0, 4],
    ['banana-choco', '«Банан-Шоколад»', 300, 5],
    ['cherry', '«Вишневый»', 350, 6],
    ['tropical', '«Тропик»', 400, 7],
    ['tiramisu', '«Тирамису»', 400, 8]
  ];
  defaultFillings.forEach(f => insertFilling.run(...f));
  console.log('Начинки добавлены в БД');
}

// Таблица рецептов начинок (ингредиенты на 100г)
db.exec(`
  CREATE TABLE IF NOT EXISTS filling_recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filling_id TEXT NOT NULL,
    ingredient_id INTEGER NOT NULL,
    amount TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (filling_id) REFERENCES fillings(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
  );
  CREATE INDEX IF NOT EXISTS idx_filling_recipes_filling ON filling_recipes(filling_id);
`);

// Заполнить рецепты начинок, если таблица пустая
const fillingRecipesCount = db.prepare('SELECT COUNT(*) as c FROM filling_recipes').get().c;
if (fillingRecipesCount === 0) {
  const ingId = (name) => db.prepare('SELECT id FROM ingredients WHERE name=?').get(name)?.id;
  const insertFR = db.prepare('INSERT INTO filling_recipes (filling_id, ingredient_id, amount) VALUES (?, ?, ?)');

  // Рецепты для начинок (на 100г крема, количество в базовых единицах)
  const fillingRecipes = {
    'snikers': [
      [ingId('Сливочный сыр (крем-чиз)'), '0.035'],
      [ingId('Карамель'), '0.02'],
      [ingId('Шоколад тёмный 70%'), '0.018'],
      [ingId('Арахис жареный'), '0.015'],
      [ingId('Масло сливочное 82.5%'), '0.008'],
      [ingId('Какао-порошок'), '0.004']
    ],
    'red-velvet': [
      [ingId('Сливочный сыр (крем-чиз)'), '0.055'],
      [ingId('Сахарная пудра'), '0.025'],
      [ingId('Сливки 33%'), '0.015'],
      [ingId('Какао-порошок'), '0.004'],
      [ingId('Красители пищевые'), '1']
    ],
    'carrot': [
      [ingId('Сливочный сыр (крем-чиз)'), '0.05'],
      [ingId('Творог 9%'), '0.02'],
      [ingId('Сахарная пудра'), '0.018'],
      [ingId('Сливки 33%'), '0.01'],
      [ingId('Ванильный экстракт'), '0.002']
    ],
    'berry': [
      [ingId('Сливочный сыр (крем-чиз)'), '0.04'],
      [ingId('Пюре малиновое'), '0.025'],
      [ingId('Пюре клубничное'), '0.02'],
      [ingId('Сахарная пудра'), '0.012'],
      [ingId('Желатин листовой'), '0.003']
    ],
    'banana-choco': [
      [ingId('Сливочный сыр (крем-чиз)'), '0.035'],
      [ingId('Бананы'), '0.025'],
      [ingId('Шоколад тёмный 70%'), '0.018'],
      [ingId('Молоко сгущённое'), '0.015'],
      [ingId('Сливки 33%'), '0.005'],
      [ingId('Какао-порошок'), '0.002']
    ],
    'cherry': [
      [ingId('Сливочный сыр (крем-чиз)'), '0.045'],
      [ingId('Вишня замороженная'), '0.03'],
      [ingId('Сахарная пудра'), '0.018'],
      [ingId('Сливки 33%'), '0.005'],
      [ingId('Лимонная кислота'), '0.002']
    ],
    'tropical': [
      [ingId('Сливочный сыр (крем-чиз)'), '0.04'],
      [ingId('Пюре манго'), '0.025'],
      [ingId('Пюре маракуйя'), '0.02'],
      [ingId('Кокосовая стружка'), '0.01'],
      [ingId('Сахарная пудра'), '0.003'],
      [ingId('Желатин листовой'), '0.002']
    ],
    'tiramisu': [
      [ingId('Сливочный сыр (крем-чиз)'), '0.045'],
      [ingId('Сливки 33%'), '0.025'],
      [ingId('Молоко сгущённое'), '0.015'],
      [ingId('Какао-порошок'), '0.01'],
      [ingId('Кофе молотый'), '0.004'],
      [ingId('Ликёр Амаретто'), '0.001']
    ]
  };

  Object.keys(fillingRecipes).forEach(fillingId => {
    fillingRecipes[fillingId].forEach(([ingredientId, amount]) => {
      if (ingredientId) {
        insertFR.run(fillingId, ingredientId, amount);
      }
    });
  });

  console.log('Рецепты начинок добавлены в БД');
}

module.exports = db;
