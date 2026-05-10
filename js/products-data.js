// База данных всех продуктов
const productsData = {
  // Капкейки
  'cupcake-happy-box': {
    name: 'Капкейки «Happy Box»',
    price: 1800,
    images: ['img/casual-1.jpg', 'img/casual-2.jpg'],
    type: 'dessert',
    quantityPerPack: 6,
    quantityStep: 6, // продается наборами по 6
    servings: '6-12 человек',
    description: `Happy Box – это шанс попробовать наши лучшие капкейки и найти свой любимый вкус!
      В наборе собраны самые популярные вкусы, каждый из которых приготовлен с душой и вниманием к деталям.`,
    descriptionFull: `Идеальный выбор для небольшого праздника, встречи с друзьями или просто чтобы порадовать себя и близких.`,
    assortment: [
      'Капкейк Сникерс – с арахисовым кремом и карамелью',
      'Капкейк Малина – с малиновым муссом',
      'Капкейк Шоколад – с нежным шоколадным кремом',
      'Капкейк Ванильное небо – классический ванильный крем',
      'Капкейк Фисташка – с фисташковым кремом',
      'Капкейк Клубника – со свежей клубникой'
    ]
  },

  'cupcake-vanilla': {
    name: 'Капкейк Ванильный',
    price: 350,
    images: ['img/casual-2.jpg', 'img/casual-1.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1, // поштучно
    minQuantity: 4, // минимум 4 штуки
    servings: '1-2 человека',
    description: 'Классический ванильный капкейк с нежнейшим сливочным кремом.',
    descriptionFull: 'Минимальный заказ - 4 штуки. Идеален для небольшого чаепития или как дополнение к основному десерту.',
    assortment: []
  },

  // Бенто
  'bento-classic': {
    name: 'Bento классический',
    price: 890,
    images: ['img/bento-1.jpg', 'img/bento-2.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    servings: '1-2 человека',
    description: 'Изысканный десерт в стильной упаковке. Идеален для подарка или личного удовольствия.',
    descriptionFull: 'Каждый Bento - это маленькое произведение искусства. Включает 4-5 различных десертов, идеально сбалансированных по вкусу.',
    assortment: [
      'Муссовое пирожное',
      'Макарон',
      'Эклер мини',
      'Шоколадная конфета',
      'Сезонные ягоды'
    ]
  },

  'bento-premium': {
    name: 'Bento премиум',
    price: 1290,
    images: ['img/bento-2.jpg', 'img/bento-1.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    servings: '1-2 человека',
    description: 'Премиальный набор авторских десертов в элегантной упаковке.',
    descriptionFull: 'Роскошный набор для истинных ценителей. Включает эксклюзивные десерты с использованием premium ингредиентов.',
    assortment: [
      'Муссовое пирожное с золотом',
      'Макарон премиум',
      'Эклер с экзотическими начинками',
      'Шоколадные конфеты ручной работы',
      'Свежие ягоды и фрукты'
    ]
  },

  // Пирожные
  'cake-raspberry-mousse': {
    name: 'Пирожное «Малиновый мусс»',
    price: 420,
    images: ['img/mousse-1.jpg', 'img/mousse-2.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    minQuantity: 4,
    servings: '1 человек',
    description: 'Воздушное муссовое пирожное с насыщенным малиновым вкусом.',
    descriptionFull: 'Нежный малиновый мусс на основе из миндального бисквита с хрустящим слоем. Минимальный заказ - 4 штуки.',
    assortment: []
  },

  'cake-chocolate-mousse': {
    name: 'Пирожное «Шоколадный мусс»',
    price: 420,
    images: ['img/mousse-2.jpg', 'img/mousse-1.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    minQuantity: 4,
    servings: '1 человек',
    description: 'Роскошное пирожное с насыщенным вкусом бельгийского шоколада.',
    descriptionFull: 'Три слоя шоколадного мусса разной насыщенности на хрустящей основе. Минимальный заказ - 4 штуки.',
    assortment: []
  },

  // Макаронс
  'macarons-set-6': {
    name: 'Макаронс набор 6 шт',
    price: 720,
    images: ['img/macarons-1.jpg', 'img/macarons-2.jpg'],
    type: 'dessert',
    quantityPerPack: 6,
    quantityStep: 1,
    servings: '3-6 человек',
    description: 'Классические французские макаронс с разнообразными начинками.',
    descriptionFull: 'В набор входят 6 макаронс разных вкусов. Каждый макарон готовится по традиционному французскому рецепту.',
    assortment: [
      'Малина',
      'Фисташка',
      'Шоколад',
      'Ваниль',
      'Клубника',
      'Лимон'
    ]
  },

  'macarons-set-12': {
    name: 'Макаронс набор 12 шт',
    price: 1320,
    images: ['img/macarons-2.jpg', 'img/macarons-1.jpg'],
    type: 'dessert',
    quantityPerPack: 12,
    quantityStep: 1,
    servings: '6-12 человек',
    description: 'Большой набор изысканных французских макаронс.',
    descriptionFull: 'Идеальный выбор для праздника или в подарок. 12 макаронс классических и сезонных вкусов в элегантной упаковке.',
    assortment: []
  },

  // Чизкейки
  'cheesecake-classic': {
    name: 'Чизкейк Классический',
    price: 520,
    images: ['img/cheesecake-1.jpg', 'img/cheesecake-2.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    minQuantity: 4,
    servings: '1-2 человека',
    description: 'Нежный чизкейк по классическому рецепту.',
    descriptionFull: 'Воздушный сливочный сыр на песочной основе. Минимальный заказ - 4 порции.',
    assortment: []
  },

  'cheesecake-berry': {
    name: 'Чизкейк Ягодный',
    price: 580,
    images: ['img/cheesecake-2.jpg', 'img/cheesecake-1.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    minQuantity: 4,
    servings: '1-2 человека',
    description: 'Классический чизкейк с ягодным конфитюром.',
    descriptionFull: 'Нежный чизкейк с прослойкой из свежего ягодного конфитюра. Минимальный заказ - 4 порции.',
    assortment: []
  },

  // Торты на заказ
  'cake-raspberry': {
    name: 'Торт «Малиновый»',
    price: 0, // цена рассчитывается от веса
    images: ['img/cake-1.jpg', 'img/cake-2.jpg'],
    type: 'cake',
    weights: [
      { kg: 3, price: 3500, servings: '12-15 человек' },
      { kg: 6, price: 6500, servings: '25-30 человек' },
      { kg: 9, price: 9000, servings: '35-40 человек' },
      { kg: 12, price: 11500, servings: '45-50 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Роскошный торт с малиновым муссом и нежным бисквитом.',
    descriptionFull: 'Многослойный торт с воздушным малиновым муссом, хрустящим слоем и нежным бисквитом. Идеален для любого торжества.',
    assortment: []
  },

  'cake-chocolate': {
    name: 'Торт «Шоколадный»',
    price: 0,
    images: ['img/cake-2.jpg', 'img/cake-1.jpg'],
    type: 'cake',
    weights: [
      { kg: 3, price: 3800, servings: '12-15 человек' },
      { kg: 6, price: 7000, servings: '25-30 человек' },
      { kg: 9, price: 9500, servings: '35-40 человек' },
      { kg: 12, price: 12000, servings: '45-50 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Насыщенный шоколадный торт для истинных ценителей.',
    descriptionFull: 'Роскошный торт из бельгийского шоколада с различными текстурами: воздушный мусс, хрустящий слой и влажный бисквит.',
    assortment: []
  },

  'cake-vanilla': {
    name: 'Торт «Ванильный»',
    price: 0,
    images: ['img/casual-3.jpg', 'img/casual-1.jpg'],
    type: 'cake',
    weights: [
      { kg: 3, price: 3200, servings: '12-15 человек' },
      { kg: 6, price: 6000, servings: '25-30 человек' },
      { kg: 9, price: 8500, servings: '35-40 человек' },
      { kg: 12, price: 11000, servings: '45-50 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Классический ванильный торт – вечная классика.',
    descriptionFull: 'Нежный ванильный торт с воздушным кремом и свежими ягодами. Универсальный выбор для любого праздника.',
    assortment: []
  },

  // ЛЕТНЯЯ КОЛЛЕКЦИЯ
  'summer-berry-basket': {
    name: 'Торт «Ягодное лукошко»',
    price: 0,
    images: ['img/summer-1.jpg', 'img/summer-1b.jpg'],
    type: 'cake',
    weights: [
      { kg: 3, price: 3300, servings: '12-15 человек' },
      { kg: 6, price: 6200, servings: '25-30 человек' },
      { kg: 9, price: 8800, servings: '35-40 человек' },
      { kg: 12, price: 11000, servings: '45-50 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Воздушный торт с летними ягодами в виде изящного лукошка.',
    descriptionFull: 'Нежный бисквитный торт с ванильным кремом, украшенный свежими сезонными ягодами: клубникой, малиной, голубикой и ежевикой. Оригинальное оформление в виде плетёного лукошка создаёт атмосферу летнего праздника.',
    assortment: []
  },

  'summer-3d-raspberry': {
    name: '3D Пирожные с сублимированной малиной',
    price: 750,
    images: ['img/summer-2.jpg', 'img/summer-2b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    minQuantity: 4,
    servings: '1 человек',
    description: 'Муссовые пирожные с хрустящей малиной и изысканным декором.',
    descriptionFull: 'Авторские муссовые пирожные с ярким малиновым вкусом, украшенные сублимированной малиной и белым шоколадом. Минимальный заказ - 4 штуки.',
    assortment: []
  },

  'summer-marshmallow-cup': {
    name: 'Зефир в вафельном стаканчике',
    price: 2400,
    images: ['img/summer-3.jpg', 'img/summer-3b.jpg'],
    type: 'dessert',
    quantityPerPack: 6,
    quantityStep: 1,
    servings: '6 человек',
    description: 'Воздушный зефир в хрустящем вафельном стаканчике.',
    descriptionFull: 'Домашний зефир на агаре с натуральными ягодными добавками в хрустящем вафельном стаканчике. Идеален для детских праздников и сладких столов. Продаётся наборами по 6 штук.',
    assortment: []
  },

  'summer-festive-chic': {
    name: 'Торт Праздничный шик',
    price: 0,
    images: ['img/summer-4.jpg', 'img/summer-4b.jpg'],
    type: 'cake',
    weights: [
      { kg: 3, price: 4500, servings: '12-15 человек' },
      { kg: 6, price: 8500, servings: '25-30 человек' },
      { kg: 9, price: 12000, servings: '35-40 человек' },
      { kg: 12, price: 15000, servings: '45-50 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Роскошный многоярусный торт для особых торжеств.',
    descriptionFull: 'Элегантный торт с кремовыми цветами и золотым декором. Сочетание ванильного и шоколадного бисквита с нежным кремом. Создан для незабываемых праздников.',
    assortment: []
  },

  'summer-loving-hearts': {
    name: 'Бенто-Торт «Любящие сердца»',
    price: 1000,
    images: ['img/summer-5.jpg', 'img/summer-5b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    servings: '2-3 человека',
    description: 'Романтичный бенто-торт с декором из сердечек.',
    descriptionFull: 'Компактный бенто-торт с нежным кремом и романтичным декором. Идеален для признаний в любви, свиданий или просто чтобы порадовать близкого человека.',
    assortment: []
  },

  'summer-meringue-roll': {
    name: 'Меренговый рулет с ягодами',
    price: 1100,
    images: ['img/summer-6.jpg', 'img/summer-6b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    servings: '4-6 человек',
    description: 'Воздушная меренга с нежным кремом и свежими ягодами.',
    descriptionFull: 'Лёгкий меренговый рулет весом 1 кг с воздушным сливочным кремом и свежими летними ягодами. Тает во рту и восхищает сочетанием текстур.',
    assortment: []
  },

  // БЕНТО-ТОРТЫ
  'bento-strawberry': {
    name: 'Бенто «Клубника»',
    price: 1000,
    images: ['img/bento-1.jpg', 'img/bento-1b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    servings: '2-3 человека',
    description: 'Бенто-торт с клубничным кремом и свежими ягодами.',
    descriptionFull: 'Нежный бисквитный торт с клубничным кремом и украшением из свежей клубники. Компактный размер идеален для небольшого праздника или романтического вечера.',
    assortment: []
  },

  'bento-love': {
    name: 'Бенто «Любовь»',
    price: 1250,
    images: ['img/bento-2.jpg', 'img/bento-2b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    servings: '2-3 человека',
    description: 'Романтичный бенто с надписью и сердечками.',
    descriptionFull: 'Изысканный бенто-торт с нежным кремом, украшенный сахарными сердечками и персональной надписью. Идеальный подарок для выражения чувств.',
    assortment: []
  },

  'bento-capybara': {
    name: 'Бенто «Капибара»',
    price: 1100,
    images: ['img/bento-3.jpg', 'img/bento-3b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    servings: '2-3 человека',
    description: 'Милый бенто с декором в виде капибары.',
    descriptionFull: 'Оригинальный бенто-торт с шоколадным кремом и забавным декором в виде капибары из мастики. Вызовет улыбку у любого получателя!',
    assortment: []
  },

  'bento-dear-mom': {
    name: 'Бенто «Любимой маме»',
    price: 1200,
    images: ['img/bento-4.jpg', 'img/bento-4b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    servings: '2-3 человека',
    description: 'Трогательный подарок для мамы с цветочным декором.',
    descriptionFull: 'Нежный бенто-торт с ванильным кремом и элегантным цветочным декором. С надписью "Любимой маме" – идеальный подарок на День матери или просто так.',
    assortment: []
  },

  'bento-my-bun': {
    name: 'Бенто «Моей булочке»',
    price: 1150,
    images: ['img/bento-5.jpg', 'img/bento-5b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    servings: '2-3 человека',
    description: 'Милый бенто с тёплой надписью для близкого человека.',
    descriptionFull: 'Бенто-торт с нежным кремом и трогательным декором. Надпись "Моей булочке" сделает ваш подарок особенным и запоминающимся.',
    assortment: []
  },

  'bento-happy-birthday': {
    name: 'Бенто «Happy Birthday»',
    price: 1050,
    images: ['img/bento-6.jpg', 'img/bento-6b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    servings: '2-3 человека',
    description: 'Праздничный бенто с надписью и свечами.',
    descriptionFull: 'Классический бенто-торт для дня рождения с яркой надписью, свечами и конфетти. Компактный размер идеален для камерного празднования.',
    assortment: []
  },

  // 23 ФЕВРАЛЯ
  'february-beer': {
    name: 'Десерт «Пиво»',
    price: 700,
    images: ['img/february-1.jpg', 'img/february-1b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    servings: '1-2 человека',
    description: 'Оригинальный десерт в виде кружки пива.',
    descriptionFull: 'Креативное муссовое пирожное в форме кружки пива с карамельным вкусом. Реалистичная "пенка" из белого шоколада. Отличный подарок на 23 февраля!',
    assortment: []
  },

  'february-macarons-23': {
    name: 'Macarons «23»',
    price: 1670,
    images: ['img/february-2.jpg', 'img/february-2b.jpg'],
    type: 'dessert',
    quantityPerPack: 8,
    quantityStep: 1,
    servings: '4-8 человек',
    description: 'Набор макаронс в военной тематике.',
    descriptionFull: 'Эксклюзивный набор из 8 макаронс с изображением звёзд, камуфляжа и цифры 23. Разнообразные начинки: шоколад, карамель, фисташка.',
    assortment: []
  },

  'february-defender': {
    name: 'Пирожные «Защитник»',
    price: 3600,
    images: ['img/february-3.jpg', 'img/february-3b.jpg'],
    type: 'dessert',
    quantityPerPack: 4,
    quantityStep: 1,
    servings: '4 человека',
    description: 'Мужские пирожные с брутальным декором.',
    descriptionFull: 'Шоколадные муссовые пирожные с орехами и карамелью, украшенные военной символикой. Продаётся наборами по 4 штуки.',
    assortment: []
  },

  'february-bento-23': {
    name: 'Бенто «23 февраля»',
    price: 1100,
    images: ['img/february-4.jpg', 'img/february-4b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    servings: '2-3 человека',
    description: 'Тематический бенто для защитников.',
    descriptionFull: 'Бенто-торт в сдержанной цветовой гамме с декором в виде звёзд и военной символики. Шоколадный крем с ореховой ноткой.',
    assortment: []
  },

  'february-dumplings': {
    name: 'Конфеты «Пельмени»',
    price: 550,
    images: ['img/february-5.jpg', 'img/february-5b.jpg'],
    type: 'dessert',
    quantityPerPack: 9,
    quantityStep: 1,
    servings: '1-2 человека',
    description: 'Забавные шоколадные конфеты в виде пельменей.',
    descriptionFull: 'Оригинальные шоколадные конфеты ручной работы в форме пельменей. Начинка из карамели и орехов. Упакованы в стилизованную "тарелку" – отличная шутка к празднику!',
    assortment: []
  },

  // ПАСХА
  'easter-eggs': {
    name: 'Десерт «Пасхальные яйца»',
    price: 900,
    images: ['img/easter-1.jpg', 'img/easter-1b.jpg'],
    type: 'dessert',
    quantityPerPack: 7,
    quantityStep: 7,
    servings: '7 человек',
    description: 'Шоколадные яйца с расписным декором.',
    descriptionFull: 'Набор из 7 шоколадных яиц ручной работы с традиционной пасхальной росписью. Внутри - нежная ореховая паста. Станут украшением праздничного стола.',
    assortment: []
  },

  'easter-paskha-1': {
    name: 'Творожная пасха',
    price: 1300,
    images: ['img/easter-2.jpg', 'img/easter-2b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    servings: '6-8 человек',
    description: 'Классическая творожная пасха с изюмом.',
    descriptionFull: 'Традиционная творожная пасха из отборного творога с добавлением сливочного масла, изюма и цукатов. Готовится по старинному рецепту.',
    assortment: []
  },

  'easter-kulich': {
    name: 'Пасхальный кулич',
    price: 350,
    images: ['img/easter-3.jpg', 'img/easter-3b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    servings: '4-6 человек',
    description: 'Ароматный кулич с белоснежной глазурью.',
    descriptionFull: 'Классический пасхальный кулич на сдобном тесте с изюмом и цедрой. Покрыт белоснежной сахарной глазурью и украшен разноцветной посыпкой.',
    assortment: []
  },

  'easter-cheesecake': {
    name: 'Творожный чизкейк',
    price: 1300,
    images: ['img/easter-4.jpg', 'img/easter-4b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    minQuantity: 3,
    servings: '1 человек',
    description: 'Порционный чизкейк с пасхальным декором.',
    descriptionFull: 'Нежный творожный чизкейк на песочной основе, украшенный пасхальной символикой. Минимальный заказ - 3 порции.',
    assortment: []
  },

  'easter-paskha-2': {
    name: 'Творожная пасха мини',
    price: 600,
    images: ['img/easter-5.jpg', 'img/easter-5b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    servings: '2-3 человека',
    description: 'Компактная творожная пасха для небольшой семьи.',
    descriptionFull: 'Порционная творожная пасха с классической рецептурой. Идеальный размер для небольшого празднования.',
    assortment: []
  },

  // ПИРОЖНЫЕ
  'cakes-mini-cheesecake': {
    name: 'Мини Чизкейк',
    price: 300,
    images: ['img/cakes-1.jpg', 'img/cakes-1b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    minQuantity: 2,
    servings: '1 человек',
    description: 'Маленький чизкейк - большое удовольствие.',
    descriptionFull: 'Классический нью-йоркский чизкейк в мини-формате. Плотная текстура, насыщенный сливочный вкус. Минимальный заказ - 2 штуки.',
    assortment: []
  },

  'cakes-assortment': {
    name: 'Ассорти пирожных',
    price: 1200,
    images: ['img/cakes-2.jpg', 'img/cakes-2b.jpg'],
    type: 'dessert',
    quantityPerPack: 4,
    quantityStep: 1,
    servings: '2-4 человека',
    description: 'Набор из разных видов пирожных.',
    descriptionFull: 'Ассорти из 4-х разных пирожных: эклер, корзиночка, муссовое, бисквитное. Идеально для чаепития с гостями. Продаётся наборами по 4 штуки.',
    assortment: ['Эклер', 'Корзиночка', 'Муссовое', 'Бисквитное']
  },

  'cakes-mousse-hearts': {
    name: 'Муссовые сердца',
    price: 3000,
    images: ['img/cakes-3.jpg', 'img/cakes-3b.jpg'],
    type: 'dessert',
    quantityPerPack: 4,
    quantityStep: 1,
    servings: '4 человека',
    description: 'Романтичные пирожные в форме сердца.',
    descriptionFull: 'Воздушные муссовые пирожные в форме сердечек с ягодной начинкой. Покрыты зеркальной глазурью. Продаётся наборами по 4 штуки.',
    assortment: []
  },

  'cakes-potato': {
    name: 'Пирожное картошка',
    price: 600,
    images: ['img/cakes-4.jpg', 'img/cakes-4b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    minQuantity: 4,
    servings: '1 человек',
    description: 'Классическое пирожное из детства.',
    descriptionFull: 'Традиционная "картошка" из бисквитной крошки с какао и сливочным маслом. Вкус ностальгии в каждом кусочке. Минимальный заказ - 4 штуки.',
    assortment: []
  },

  'cakes-madeleine': {
    name: 'Мадлен',
    price: 860,
    images: ['img/cakes-5.jpg', 'img/cakes-5b.jpg'],
    type: 'dessert',
    quantityPerPack: 8,
    quantityStep: 8,
    servings: '4-8 человек',
    description: 'Французское печенье-пирожное.',
    descriptionFull: 'Классический французский мадлен - нежное бисквитное печенье с ароматом лимона и ванили. Набор из 8 штук в изящной упаковке.',
    assortment: []
  },

  // МУССОВЫЕ БЕНТО
  'mousse-chocolate': {
    name: 'Шоколадный муссовый бенто-торт',
    price: 1280,
    images: ['img/mousse-1.jpg', 'img/mousse-1b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    servings: '2-3 человека',
    description: 'Насыщенный шоколадный мусс в компактном формате.',
    descriptionFull: 'Трёхслойный шоколадный мусс: тёмный, молочный и белый шоколад. Хрустящая ореховая прослойка. Покрыт зеркальной глазурью.',
    assortment: []
  },

  'mousse-berry': {
    name: 'Ягодный муссовый бенто-торт',
    price: 1150,
    images: ['img/mousse-2.jpg', 'img/mousse-2b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    servings: '2-3 человека',
    description: 'Лёгкий ягодный мусс с летним вкусом.',
    descriptionFull: 'Воздушный мусс из лесных ягод на миндальном бисквите. Яркий вкус и эффектная зеркальная глазурь.',
    assortment: []
  },

  'mousse-cream': {
    name: 'Кремовый муссовый бенто-торт',
    price: 1150,
    images: ['img/mousse-3.jpg', 'img/mousse-3b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    servings: '2-3 человека',
    description: 'Нежный кремовый мусс для истинных ценителей.',
    descriptionFull: 'Деликатный мусс из маскарпоне с ванилью и карамельными нотками. Минималистичный декор подчёркивает изысканность вкуса.',
    assortment: []
  },

  'mousse-lemon': {
    name: 'Лимонный муссовый бенто-торт',
    price: 900,
    images: ['img/mousse-4.jpg', 'img/mousse-4b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    servings: '2-3 человека',
    description: 'Освежающий лимонный мусс с цитрусовой ноткой.',
    descriptionFull: 'Яркий лимонный мусс с лаймовым конфи. Идеальный баланс сладости и кислинки. Покрыт жёлтой зеркальной глазурью.',
    assortment: []
  },

  'mousse-coffee': {
    name: 'Кофейный муссовый бенто-торт',
    price: 850,
    images: ['img/mousse-5.jpg', 'img/mousse-5b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    servings: '2-3 человека',
    description: 'Бодрящий кофейный мусс для кофеманов.',
    descriptionFull: 'Мусс на основе натурального эспрессо с карамельной прослойкой. Украшен кофейными зёрнами в шоколаде.',
    assortment: []
  },

  // МАКАРОНС
  'macarons-set-1': {
    name: 'Набор Французских Macarons №1',
    price: 1800,
    images: ['img/macarons-1.jpg', 'img/macarons-1b.jpg'],
    type: 'dessert',
    quantityPerPack: 12,
    quantityStep: 1,
    servings: '6-12 человек',
    description: 'Классический набор макаронс в подарочной упаковке.',
    descriptionFull: 'Набор из 12 макаронс разных вкусов: малина, фисташка, шоколад, ваниль, лимон, клубника. В элегантной подарочной коробке.',
    assortment: ['Малина', 'Фисташка', 'Шоколад', 'Ваниль', 'Лимон', 'Клубника']
  },

  'macarons-set-2': {
    name: 'Набор Французских Macarons №2',
    price: 1890,
    images: ['img/macarons-2.jpg', 'img/macarons-2b.jpg'],
    type: 'dessert',
    quantityPerPack: 12,
    quantityStep: 1,
    servings: '6-12 человек',
    description: 'Премиум набор с экзотическими вкусами.',
    descriptionFull: 'Коллекция из 12 макаронс с необычными начинками: маракуйя, солёная карамель, лаванда, роза, чёрная смородина, манго.',
    assortment: ['Маракуйя', 'Солёная карамель', 'Лаванда', 'Роза', 'Чёрная смородина', 'Манго']
  },

  'macarons-set-3': {
    name: 'Набор Французских Macarons №3',
    price: 1900,
    images: ['img/macarons-3.jpg', 'img/macarons-3b.jpg'],
    type: 'dessert',
    quantityPerPack: 12,
    quantityStep: 1,
    servings: '6-12 человек',
    description: 'Ассорти для истинных гурманов.',
    descriptionFull: 'Эксклюзивная коллекция из 12 макаронс: белый шоколад с базиликом, тирамису, кокос-лайм, имбирь, голубика.',
    assortment: ['Белый шоколад с базиликом', 'Тирамису', 'Кокос-лайм', 'Имбирь', 'Голубика']
  },

  'macarons-set-4': {
    name: 'Набор Французских Macarons №4',
    price: 1700,
    images: ['img/macarons-4.jpg', 'img/macarons-4b.jpg'],
    type: 'dessert',
    quantityPerPack: 10,
    quantityStep: 1,
    servings: '5-10 человек',
    description: 'Компактный набор популярных вкусов.',
    descriptionFull: 'Набор из 10 макаронс классических вкусов в удобной коробке. Идеален для подарка или домашнего чаепития.',
    assortment: ['Шоколад', 'Ваниль', 'Малина', 'Карамель', 'Фисташка']
  },

  'macarons-classic': {
    name: 'Классические Французские Macarons',
    price: 1200,
    images: ['img/macarons-5.jpg', 'img/macarons-5b.jpg'],
    type: 'dessert',
    quantityPerPack: 6,
    quantityStep: 1,
    servings: '3-6 человек',
    description: 'Стартовый набор для знакомства с макаронс.',
    descriptionFull: 'Набор из 6 макаронс базовых вкусов. Идеален для первого знакомства с этим французским десертом.',
    assortment: ['Шоколад', 'Ваниль', 'Малина']
  },

  'macarons-set-5': {
    name: 'Набор Французских Macarons №5',
    price: 1400,
    images: ['img/macarons-6.jpg', 'img/macarons-6b.jpg'],
    type: 'dessert',
    quantityPerPack: 8,
    quantityStep: 1,
    servings: '4-8 человек',
    description: 'Средний набор с сезонными вкусами.',
    descriptionFull: 'Набор из 8 макаронс с сезонными начинками. Состав обновляется в зависимости от времени года.',
    assortment: []
  },

  // КОНФЕТЫ И ШОКОЛАД
  'candies-dubai-chocolate': {
    name: 'Дубайский шоколад',
    price: 1200,
    images: ['img/candies-1.jpg', 'img/candies-1b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    servings: '2-4 человека',
    description: 'Трендовый дубайский шоколад с фисташковой пастой.',
    descriptionFull: 'Вирусный десерт - шоколадная плитка с хрустящей кадаифью и фисташковой пастой. Идеальное сочетание текстур и вкусов.',
    assortment: []
  },

  'candies-galactic-love': {
    name: 'Конфеты «Галактическая любовь»',
    price: 450,
    images: ['img/candies-2.jpg', 'img/candies-2b.jpg'],
    type: 'dessert',
    quantityPerPack: 6,
    quantityStep: 1,
    servings: '1-2 человека',
    description: 'Шоколадные конфеты с космическим декором.',
    descriptionFull: 'Набор шоколадных конфет ручной работы с зеркальной галактической глазурью. Начинки: ганаш, карамель, пралине.',
    assortment: []
  },

  'candies-set-1': {
    name: 'Набор конфет №1',
    price: 500,
    images: ['img/candies-3.jpg', 'img/candies-3b.jpg'],
    type: 'dessert',
    quantityPerPack: 9,
    quantityStep: 1,
    servings: '2-3 человека',
    description: 'Классический ассортимент шоколадных конфет.',
    descriptionFull: 'Набор из 9 конфет с разными начинками: молочный шоколад с орехами, тёмный с вишней, белый с кокосом.',
    assortment: []
  },

  'candies-set-2': {
    name: 'Набор конфет №2',
    price: 300,
    images: ['img/candies-4.jpg', 'img/candies-4b.jpg'],
    type: 'dessert',
    quantityPerPack: 6,
    quantityStep: 1,
    servings: '1-2 человека',
    description: 'Компактный набор конфет-ассорти.',
    descriptionFull: 'Небольшой набор из 6 конфет разных вкусов. Идеален как дополнение к основному подарку.',
    assortment: []
  },

  'candies-kiss': {
    name: 'Набор конфет «Поцелуй»',
    price: 780,
    images: ['img/candies-5.jpg', 'img/candies-5b.jpg'],
    type: 'dessert',
    quantityPerPack: 9,
    quantityStep: 1,
    servings: '2-3 человека',
    description: 'Романтичный набор для признания в чувствах.',
    descriptionFull: 'Конфеты в форме губ из молочного и белого шоколада с клубничной начинкой. Упакованы в стильную коробку.',
    assortment: []
  },

  'candies-hearts': {
    name: 'Конфеты «Сердечки»',
    price: 570,
    images: ['img/candies-6.jpg', 'img/candies-6b.jpg'],
    type: 'dessert',
    quantityPerPack: 9,
    quantityStep: 1,
    servings: '2-3 человека',
    description: 'Милые конфеты в форме сердечек.',
    descriptionFull: 'Набор шоколадных конфет-сердечек с разными начинками: карамель, пралине, ганаш. Отличный подарок для любимых.',
    assortment: []
  },

  // ЧИЗКЕЙКИ
  'cheesecake-dubai': {
    name: 'Чизкейк «Дубайский шоколад»',
    price: 1200,
    images: ['img/cheesecake-1.jpg', 'img/cheesecake-1b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    servings: '6-8 человек',
    description: 'Чизкейк с трендовым дубайским шоколадом.',
    descriptionFull: 'Классический чизкейк с прослойкой из дубайского шоколада с фисташковой пастой и кадаифью. Новый хит сезона!',
    assortment: []
  },

  'cheesecake-raspberry-passion': {
    name: 'Чизкейк «Малина-маракуйя»',
    price: 1150,
    images: ['img/cheesecake-2.jpg', 'img/cheesecake-2b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    servings: '6-8 человек',
    description: 'Экзотическое сочетание малины и маракуйи.',
    descriptionFull: 'Нежный чизкейк с прослойкой из малины и маракуйи. Яркий тропический вкус и эффектная подача.',
    assortment: []
  },

  'cheesecake-tiramisu': {
    name: 'Чизкейк «Тирамису»',
    price: 1000,
    images: ['img/cheesecake-3.jpg', 'img/cheesecake-3b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    servings: '6-8 человек',
    description: 'Сочетание чизкейка и классического тирамису.',
    descriptionFull: 'Чизкейк на основе маскарпоне с кофейной пропиткой и какао. Объединяет лучшее из двух миров.',
    assortment: []
  },

  'cheesecake-blueberry': {
    name: 'Чизкейк «С голубикой»',
    price: 1170,
    images: ['img/cheesecake-4.jpg', 'img/cheesecake-4b.jpg'],
    type: 'dessert',
    quantityPerPack: 1,
    quantityStep: 1,
    servings: '6-8 человек',
    description: 'Классический чизкейк с голубичным соусом.',
    descriptionFull: 'Нежный нью-йоркский чизкейк с домашним голубичным конфитюром. Лёгкая кислинка ягод идеально дополняет сливочную основу.',
    assortment: []
  },

  // ==========================================
  // TO ORDER — ТОРТЫ
  // ==========================================

  'torty-napoleon': {
    name: 'Торт наполеон с ягодами',
    price: 0,
    images: ['img/картинки для сайта/Торты/Торт наполеон с ягодами.jpg', 'img/картинки для сайта/Торты/Торт наполеон с ягодами 2.jpg'],
    type: 'cake',
    weights: [
      { kg: 2, price: 4500, servings: '8-10 человек' },
      { kg: 3, price: 6500, servings: '12-15 человек' },
      { kg: 5, price: 10000, servings: '20-25 человек' },
      { kg: 7, price: 13500, servings: '28-35 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Классический наполеон со свежими сезонными ягодами.',
    descriptionFull: 'Многослойный торт наполеон с нежным заварным кремом и хрустящими слоями теста, украшенный свежими сезонными ягодами. Каждый кусочек тает во рту.',
    assortment: []
  },

  'torty-prazdnichny-shik': {
    name: 'Торт праздничный шик',
    price: 0,
    images: ['img/картинки для сайта/Торты/Торт Праздничный шик.jpg', 'img/картинки для сайта/Торты/Торт праздничный шик 2.jpg'],
    type: 'cake',
    weights: [
      { kg: 3, price: 6800, servings: '12-15 человек' },
      { kg: 5, price: 11000, servings: '20-25 человек' },
      { kg: 7, price: 15000, servings: '28-35 человек' },
      { kg: 10, price: 20000, servings: '40-50 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Роскошный торт для особых торжеств.',
    descriptionFull: 'Элегантный торт с кремовыми цветами и изысканным декором. Сочетание нежного бисквита и воздушного крема создаёт незабываемый вкус.',
    assortment: []
  },

  'torty-raspisnoy': {
    name: 'Торт расписной цветами',
    price: 0,
    images: ['img/картинки для сайта/Торты/Торт расписной цветами.jpg', 'img/картинки для сайта/Торты/Торт расписной цветами 2.jpg'],
    type: 'cake',
    weights: [
      { kg: 3, price: 3200, servings: '12-15 человек' },
      { kg: 5, price: 5200, servings: '20-25 человек' },
      { kg: 7, price: 7000, servings: '28-35 человек' },
      { kg: 10, price: 9500, servings: '40-50 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Торт с ручной росписью цветочными мотивами.',
    descriptionFull: 'Авторский торт с нежной росписью кремовыми цветами. Каждый торт уникален — кондитер расписывает его вручную, создавая произведение искусства.',
    assortment: []
  },

  'torty-babochki': {
    name: 'Торт с бабочками из вафельной бумаги',
    price: 0,
    images: ['img/картинки для сайта/Торты/Торт с бабочками из вафельной бумаги.jpg', 'img/картинки для сайта/Торты/Торт с бабочками из вафельной бумаги 2.jpg'],
    type: 'cake',
    weights: [
      { kg: 3, price: 6500, servings: '12-15 человек' },
      { kg: 5, price: 10500, servings: '20-25 человек' },
      { kg: 7, price: 14000, servings: '28-35 человек' },
      { kg: 10, price: 19000, servings: '40-50 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Воздушный торт с декоративными бабочками из вафельной бумаги.',
    descriptionFull: 'Нежный торт, украшенный реалистичными бабочками из съедобной вафельной бумаги. Лёгкий и воздушный десерт для романтических и весенних торжеств.',
    assortment: []
  },

  'torty-yagodnoe-lukoshko': {
    name: 'Торт Ягодное лукошко',
    price: 0,
    images: ['img/картинки для сайта/Торты/Торт Ягодное лукошко.jpg', 'img/картинки для сайта/Торты/Торт Ягодное лукошко 2.jpg'],
    type: 'cake',
    weights: [
      { kg: 3, price: 7200, servings: '12-15 человек' },
      { kg: 5, price: 11500, servings: '20-25 человек' },
      { kg: 7, price: 15500, servings: '28-35 человек' },
      { kg: 10, price: 21000, servings: '40-50 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Торт в виде лукошка с обилием свежих ягод.',
    descriptionFull: 'Авторский торт в форме плетёного лукошка, наполненный свежими сезонными ягодами. Нежный бисквит с ванильным кремом и ягодной прослойкой.',
    assortment: []
  },

  // ==========================================
  // TO ORDER — 3D-ТОРТЫ
  // ==========================================

  'torty3d-louis-vuitton': {
    name: 'Торт «LouisVuitton»',
    price: 0,
    images: ['img/картинки для сайта/3D-торты/Торт «LouisVuitton».jpg', 'img/картинки для сайта/3D-торты/Торт «LouisVuitton» 2.jpg'],
    type: 'cake',
    weights: [
      { kg: 4, price: 9600, servings: '16-20 человек' },
      { kg: 6, price: 14000, servings: '25-30 человек' },
      { kg: 8, price: 18000, servings: '32-40 человек' },
      { kg: 10, price: 22000, servings: '40-50 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: '3D-торт в стиле легендарного бренда Louis Vuitton.',
    descriptionFull: 'Эксклюзивный 3D-торт, выполненный в стиле Louis Vuitton с фирменным узором-монограммой. Каждая деталь проработана вручную из мастики и шоколада.',
    assortment: []
  },

  'torty3d-kfc': {
    name: 'Торт KFC',
    price: 0,
    images: ['img/картинки для сайта/3D-торты/Торт KFC.jpg', 'img/картинки для сайта/3D-торты/Торт KFC 2.jpg'],
    type: 'cake',
    weights: [
      { kg: 3, price: 6200, servings: '12-15 человек' },
      { kg: 5, price: 10000, servings: '20-25 человек' },
      { kg: 7, price: 13500, servings: '28-35 человек' },
      { kg: 10, price: 18500, servings: '40-50 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: '3D-торт в виде ведёрка KFC — оригинальный подарок.',
    descriptionFull: 'Реалистичный 3D-торт в виде фирменного ведёрка KFC. Идеальный подарок для любителей фастфуда и оригинальных сюрпризов.',
    assortment: []
  },

  'torty3d-dumplings': {
    name: 'Торт Кастрюля с пельменями',
    price: 0,
    images: ['img/картинки для сайта/3D-торты/Торт Кастрюля с пельменями.jpg', 'img/картинки для сайта/3D-торты/Торт Кастрюля с пельменями 2.jpg'],
    type: 'cake',
    weights: [
      { kg: 3, price: 5900, servings: '12-15 человек' },
      { kg: 5, price: 9500, servings: '20-25 человек' },
      { kg: 7, price: 13000, servings: '28-35 человек' },
      { kg: 10, price: 17500, servings: '40-50 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: '3D-торт в виде кастрюли с пельменями — настоящий шедевр.',
    descriptionFull: 'Невероятно реалистичный 3D-торт в виде кастрюли с пельменями. Каждый пельмень вылеплен вручную из мастики. Гарантированно вызовет восторг на любом празднике.',
    assortment: []
  },

  'torty3d-cinema': {
    name: 'Торт Кино',
    price: 0,
    images: ['img/картинки для сайта/3D-торты/Торт Кино.jpg', 'img/картинки для сайта/3D-торты/Торт Кино 2.jpg'],
    type: 'cake',
    weights: [
      { kg: 6, price: 7400, servings: '25-30 человек' },
      { kg: 8, price: 9500, servings: '32-40 человек' },
      { kg: 10, price: 11500, servings: '40-50 человек' },
      { kg: 12, price: 13500, servings: '48-60 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: '3D-торт в кинематографической тематике.',
    descriptionFull: 'Тематический 3D-торт для киноманов с элементами кинематографа: хлопушка, плёнка, попкорн. Все детали съедобные и выполнены вручную.',
    assortment: []
  },

  'torty3d-butterflies': {
    name: 'Торт с бабочками',
    price: 0,
    images: ['img/картинки для сайта/3D-торты/Торт с бабочками.jpg', 'img/картинки для сайта/3D-торты/Торт с бабочками 2.jpg'],
    type: 'cake',
    weights: [
      { kg: 3, price: 6500, servings: '12-15 человек' },
      { kg: 5, price: 10500, servings: '20-25 человек' },
      { kg: 7, price: 14000, servings: '28-35 человек' },
      { kg: 10, price: 19000, servings: '40-50 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Нежный 3D-торт с объёмными бабочками.',
    descriptionFull: 'Многоярусный торт с объёмными бабочками из мастики и вафельной бумаги. Каждая бабочка уникальна и создаёт эффект парящего полёта.',
    assortment: []
  },

  // ==========================================
  // TO ORDER — ДЕТСКИЕ ТОРТЫ
  // ==========================================

  'detskie-cartoon-candle': {
    name: 'Мультяшный торт со свечкой',
    price: 0,
    images: ['img/картинки для сайта/Детские торты/Мультяшный торт со свечкой.jpg', 'img/картинки для сайта/Детские торты/Мультяшный торт со свечкой 2.jpg'],
    type: 'cake',
    weights: [
      { kg: 3, price: 4800, servings: '12-15 человек' },
      { kg: 5, price: 7800, servings: '20-25 человек' },
      { kg: 7, price: 10500, servings: '28-35 человек' },
      { kg: 10, price: 14500, servings: '40-50 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Яркий мультяшный торт с праздничной свечкой.',
    descriptionFull: 'Весёлый торт с мультяшным дизайном, яркими цветами и праздничной свечой. Идеально подойдёт для детского дня рождения.',
    assortment: []
  },

  'detskie-labubu': {
    name: 'Торт Лабубу',
    price: 0,
    images: ['img/картинки для сайта/Детские торты/Торт Лабубу.jpg', 'img/картинки для сайта/Детские торты/Торт Лабубу 2.jpg'],
    type: 'cake',
    weights: [
      { kg: 3, price: 5500, servings: '12-15 человек' },
      { kg: 5, price: 8800, servings: '20-25 человек' },
      { kg: 7, price: 12000, servings: '28-35 человек' },
      { kg: 10, price: 16500, servings: '40-50 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Торт с популярным персонажем Лабубу.',
    descriptionFull: 'Торт с фигуркой популярного персонажа Лабубу из мастики. Яркий и модный дизайн, который порадует детей и подростков.',
    assortment: []
  },

  'detskie-marshmallow': {
    name: 'Торт с маршмеллоу',
    price: 0,
    images: ['img/картинки для сайта/Детские торты/Торт с маршмеллоу.jpg', 'img/картинки для сайта/Детские торты/Торт с маршмеллоу 2.jpg'],
    type: 'cake',
    weights: [
      { kg: 2, price: 4200, servings: '8-10 человек' },
      { kg: 3, price: 6000, servings: '12-15 человек' },
      { kg: 5, price: 9500, servings: '20-25 человек' },
      { kg: 7, price: 13000, servings: '28-35 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Нежный торт, украшенный воздушными маршмеллоу.',
    descriptionFull: 'Яркий детский торт с россыпью разноцветных маршмеллоу. Нежный бисквит и лёгкий сливочный крем — любимое сочетание маленьких сладкоежек.',
    assortment: []
  },

  'detskie-colorful': {
    name: 'Торт с небрежными цветными мазками',
    price: 0,
    images: ['img/картинки для сайта/Детские торты/Торт с небрежными цветными мазками.jpg', 'img/картинки для сайта/Детские торты/Торт с небрежными цветными мазками 2.jpg'],
    type: 'cake',
    weights: [
      { kg: 2, price: 3900, servings: '8-10 человек' },
      { kg: 3, price: 5600, servings: '12-15 человек' },
      { kg: 5, price: 9000, servings: '20-25 человек' },
      { kg: 7, price: 12000, servings: '28-35 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Стильный торт с яркими акварельными мазками.',
    descriptionFull: 'Торт в стиле современной акварельной живописи с яркими цветными мазками на кремовом покрытии. Выглядит как настоящее произведение искусства.',
    assortment: []
  },

  'detskie-ship': {
    name: 'Торт с фигуркой корабля',
    price: 0,
    images: ['img/картинки для сайта/Детские торты/Торт с фигуркой корабля.jpg', 'img/картинки для сайта/Детские торты/Торт с фигуркой корабля 2.jpg'],
    type: 'cake',
    weights: [
      { kg: 4, price: 6500, servings: '16-20 человек' },
      { kg: 6, price: 9500, servings: '25-30 человек' },
      { kg: 8, price: 12000, servings: '32-40 человек' },
      { kg: 10, price: 15000, servings: '40-50 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Торт с детализированной фигуркой корабля.',
    descriptionFull: 'Приключенческий торт с детальной фигуркой корабля из мастики. Идеальный выбор для маленьких моряков и любителей пиратских историй.',
    assortment: []
  },

  // ==========================================
  // TO ORDER — СВАДЕБНЫЕ ТОРТЫ
  // ==========================================

  'svadebnye-wafer-ruffles': {
    name: 'Свадебный с вафельными рюшами',
    price: 0,
    images: ['img/картинки для сайта/Свадебные торты/Свадебный с вафельными рюшами.jpg', 'img/картинки для сайта/Свадебные торты/Свадебный с вафельными рюшами 2.jpg'],
    type: 'cake',
    weights: [
      { kg: 5, price: 7800, servings: '20-25 человек' },
      { kg: 7, price: 10500, servings: '28-35 человек' },
      { kg: 10, price: 14500, servings: '40-50 человек' },
      { kg: 12, price: 17000, servings: '48-60 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Элегантный свадебный торт с нежными вафельными рюшами.',
    descriptionFull: 'Многоярусный свадебный торт с изящными рюшами из вафельной бумаги. Воздушный и невесомый декор создаёт ощущение лёгкости и романтики.',
    assortment: []
  },

  'svadebnye-vintage': {
    name: 'Свадебный торт винтаж',
    price: 0,
    images: ['img/картинки для сайта/Свадебные торты/Свадебный торт винтаж.jpg', 'img/картинки для сайта/Свадебные торты/Свадебный торт винтаж 2.jpg'],
    type: 'cake',
    weights: [
      { kg: 4, price: 6900, servings: '16-20 человек' },
      { kg: 6, price: 10000, servings: '25-30 человек' },
      { kg: 8, price: 13000, servings: '32-40 человек' },
      { kg: 10, price: 16000, servings: '40-50 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Свадебный торт в винтажном стиле с нежным декором.',
    descriptionFull: 'Торт в стиле ретро с кружевными элементами, жемчужинами и пастельной цветовой гаммой. Утончённый выбор для классической свадьбы.',
    assortment: []
  },

  'svadebnye-memories': {
    name: 'Свадебный торт Воспоминания',
    price: 0,
    images: ['img/картинки для сайта/Свадебные торты/Свадебный торт Воспоминания.jpg', 'img/картинки для сайта/Свадебные торты/Свадебный торт Воспоминания 2.jpg'],
    type: 'cake',
    weights: [
      { kg: 5, price: 7400, servings: '20-25 человек' },
      { kg: 7, price: 10000, servings: '28-35 человек' },
      { kg: 10, price: 14000, servings: '40-50 человек' },
      { kg: 12, price: 16500, servings: '48-60 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Романтический свадебный торт «Воспоминания».',
    descriptionFull: 'Многоярусный свадебный торт с нежным цветочным декором и элегантными деталями. Каждый ярус — это новая глава вашей истории любви.',
    assortment: []
  },

  'svadebnye-beads': {
    name: 'Свадебный торт с бусинами',
    price: 0,
    images: ['img/картинки для сайта/Свадебные торты/Свадебный торт с бусинами.jpg', 'img/картинки для сайта/Свадебные торты/Свадебный торт с бусинами 2.jpg'],
    type: 'cake',
    weights: [
      { kg: 4, price: 6200, servings: '16-20 человек' },
      { kg: 6, price: 9000, servings: '25-30 человек' },
      { kg: 8, price: 11500, servings: '32-40 человек' },
      { kg: 10, price: 14000, servings: '40-50 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Свадебный торт с элегантными съедобными бусинами.',
    descriptionFull: 'Утончённый свадебный торт, украшенный каскадом перламутровых съедобных бусин. Минималистичный и стильный дизайн для современной свадьбы.',
    assortment: []
  },

  'svadebnye-flowers-fruits': {
    name: 'Свадебный торт с цветами и фруктами',
    price: 0,
    images: ['img/картинки для сайта/Свадебные торты/Свадебный торт с цветами и фруктами.jpg', 'img/картинки для сайта/Свадебные торты/Свадебный торт с цветами и фруктами 2.jpg'],
    type: 'cake',
    weights: [
      { kg: 6, price: 8000, servings: '25-30 человек' },
      { kg: 8, price: 10500, servings: '32-40 человек' },
      { kg: 10, price: 12800, servings: '40-50 человек' },
      { kg: 12, price: 15000, servings: '48-60 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Пышный свадебный торт с живыми цветами и фруктами.',
    descriptionFull: 'Роскошный многоярусный торт, украшенный композицией из свежих цветов и фруктов. Натуральный и изысканный стиль для незабываемого торжества.',
    assortment: []
  },

  // ==========================================
  // TO ORDER — ТОРТЫ НА ДЕНЬ РОЖДЕНИЯ
  // ==========================================

  'dr-cats': {
    name: 'Торт с котиками',
    price: 0,
    images: ['img/картинки для сайта/На день рождение/Торт с котиками.jpg', 'img/картинки для сайта/На день рождение/Торт с котиками 2.jpg'],
    type: 'cake',
    weights: [
      { kg: 3, price: 5300, servings: '12-15 человек' },
      { kg: 5, price: 8500, servings: '20-25 человек' },
      { kg: 7, price: 11500, servings: '28-35 человек' },
      { kg: 10, price: 16000, servings: '40-50 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Милый торт с фигурками котиков из мастики.',
    descriptionFull: 'Нежный торт с очаровательными фигурками котиков, выполненными вручную из мастики. Каждый котик уникален — идеальный подарок для любителей кошек.',
    assortment: []
  },

  'dr-flowers': {
    name: 'Торт с цветами',
    price: 0,
    images: ['img/картинки для сайта/На день рождение/Торт с цветами.jpg', 'img/картинки для сайта/На день рождение/Торт с цветами 2.jpg'],
    type: 'cake',
    weights: [
      { kg: 3, price: 4700, servings: '12-15 человек' },
      { kg: 5, price: 7500, servings: '20-25 человек' },
      { kg: 7, price: 10000, servings: '28-35 человек' },
      { kg: 10, price: 14000, servings: '40-50 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Элегантный торт с цветочным декором на день рождения.',
    descriptionFull: 'Торт с нежными кремовыми цветами и изящным декором. Универсальный выбор для дня рождения — подойдёт и для мамы, и для подруги.',
    assortment: []
  },

  'dr-cherry-candles': {
    name: 'Торт со свечами вишнями',
    price: 0,
    images: ['img/картинки для сайта/На день рождение/Торт со свечами вишнями.jpg', 'img/картинки для сайта/На день рождение/Торт со свечами вишнями 2.jpg'],
    type: 'cake',
    weights: [
      { kg: 3, price: 5900, servings: '12-15 человек' },
      { kg: 5, price: 9500, servings: '20-25 человек' },
      { kg: 7, price: 13000, servings: '28-35 человек' },
      { kg: 10, price: 17500, servings: '40-50 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Оригинальный торт со свечами в виде вишенок.',
    descriptionFull: 'Креативный торт с декоративными свечами-вишенками. Нежный бисквит с вишнёвой прослойкой и воздушным кремом создают незабываемый вкус.',
    assortment: []
  },

  'dr-hockey': {
    name: 'Торт Хоккей',
    price: 0,
    images: ['img/картинки для сайта/На день рождение/Торт Хоккей.jpg', 'img/картинки для сайта/На день рождение/Торт Хоккей 2.jpg'],
    type: 'cake',
    weights: [
      { kg: 4, price: 6400, servings: '16-20 человек' },
      { kg: 6, price: 9500, servings: '25-30 человек' },
      { kg: 8, price: 12000, servings: '32-40 человек' },
      { kg: 10, price: 15000, servings: '40-50 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Тематический торт для хоккейного болельщика.',
    descriptionFull: 'Торт в хоккейной тематике с элементами ледовой арены, клюшкой и шайбой из мастики. Отличный подарок для спортивного праздника.',
    assortment: []
  },

  'dr-calendar': {
    name: 'Торт-календарь',
    price: 0,
    images: ['img/картинки для сайта/На день рождение/Торт-календарь.jpg', 'img/картинки для сайта/На день рождение/Торт-календарь 2.jpg'],
    type: 'cake',
    weights: [
      { kg: 3, price: 5100, servings: '12-15 человек' },
      { kg: 5, price: 8200, servings: '20-25 человек' },
      { kg: 7, price: 11000, servings: '28-35 человек' },
      { kg: 10, price: 15000, servings: '40-50 человек' }
    ],
    fillings: [
      { id: 'snikers', name: '«Сникерс»', price: 0 },
      { id: 'red-velvet', name: '«Красный бархат»', price: 0 },
      { id: 'carrot', name: '«Морковный»', price: 0 },
      { id: 'berry', name: '«Ягодный»', price: 0 },
      { id: 'banana-choco', name: '«Банан-Шоколад»', price: 300 },
      { id: 'cherry', name: '«Вишневый»', price: 350 },
      { id: 'tropical', name: '«Тропик»', price: 400 },
      { id: 'tiramisu', name: '«Тирамису»', price: 400 }
    ],
    description: 'Торт в виде листка календаря с датой рождения.',
    descriptionFull: 'Оригинальный торт в форме календарного листка с отмеченной датой именинника. Персонализированный дизайн — укажите нужную дату при заказе.',
    assortment: []
  }
};

// Стандартные тексты для табов (одинаковые для всех)
const standardTabs = {
  composition: {
    title: 'Состав',
    content: `
      <h3>Состав</h3>
      <p>
        Мы используем только качественные и свежие ингредиенты. Все наши десерты готовятся
        без искусственных красителей и консервантов.
      </p>
      <h3>Основные ингредиенты:</h3>
      <ul>
        <li>Мука пшеничная высшего сорта</li>
        <li>Сливочное масло премиум качества</li>
        <li>Яйца куриные</li>
        <li>Сахар</li>
        <li>Натуральные сливки 33%</li>
        <li>Бельгийский шоколад</li>
        <li>Свежие ягоды и фрукты</li>
        <li>Натуральные ореховые пасты</li>
      </ul>
      <p style="margin-top: 24px; font-size: 14px; color: #d4a088;">
        <strong>Внимание:</strong> Продукт может содержать следы орехов, глютена и молочных продуктов.
      </p>
    `
  },
  production: {
    title: 'Срок изготовления',
    content: `
      <h3>Срок изготовления</h3>
      <p>
        Доставка пирожных и десертов из раздела Casual осуществляется на следующий день
        при заказе до 13:00. Все десерты готовятся свежими специально под ваш заказ.
      </p>
      <h3>Условия хранения:</h3>
      <ul>
        <li>Хранить в холодильнике при температуре +2...+6°C</li>
        <li>Срок годности: 3 дня с момента изготовления</li>
        <li>Перед подачей достаньте из холодильника за 30 минут</li>
        <li>Не замораживать</li>
      </ul>
      <p>
        Мы рекомендуем насладиться десертом в первые 24 часа после получения,
        чтобы оценить его вкус в полной мере.
      </p>
    `
  },
  delivery: {
    title: 'Доставка и оплата',
    content: `
      <h3>Доставка и оплата</h3>
      <p>
        Мы осуществляем доставку по городу Дубна на следующий день при заказе от 3 500 ₽.
        Обратите внимание, минимальная сумма заказа для доставки в праздничные дни – от 5000 ₽.
      </p>
      <h3>Условия доставки:</h3>
      <ul>
        <li>Доставка курьером по Дубне – 300 ₽</li>
        <li>Бесплатная доставка при заказе от 5000 ₽</li>
        <li>Самовывоз с производства – бесплатно</li>
        <li>В стоимость доставки включены 15 минут на приём/передачу товара</li>
      </ul>
      <h3>Способы оплаты:</h3>
      <ul>
        <li>Онлайн оплата картой на сайте</li>
        <li>Оплата картой курьеру при получении</li>
        <li>Наличными курьеру</li>
      </ul>
      <p>
        <strong>Адрес самовывоза:</strong><br>
        Дубна, ул. Примерная, д.1, к.1<br>
        График работы: пн-пт 10:00–20:00, сб-вс 10:00–16:00
      </p>
    `
  }
};
