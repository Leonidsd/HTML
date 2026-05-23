/* =========================
   ДАННЫЕ (позже вынесем в JSON)
   ========================= */

const PRODUCTS = [
  {
    id: "cheesecake",
    title: "Чизкейк классический",
    category: "cheesecake",
    basePrice: 1800,
    prepHours: 1.5, // участвует в расчёте доступности дат
    options: {
      coulis: [
        { value: "lemon", label: "Лимонное", priceDelta: 150 },
        { value: "berry", label: "Ягодное", priceDelta: 200 },
        { value: "none", label: "Без кули", priceDelta: 0 },
      ],
      base: [
        { value: "classic", label: "Классическая", priceDelta: 0 },
        { value: "choco", label: "Шоколадная", priceDelta: 120 },
      ]
    }
  },
  {
    id: "prague",
    title: "Торт «Прага»",
    category: "cakes",
    basePrice: 2600,
    prepHours: 2.0,
    options: {
      coulis: [
        { value: "choco", label: "Шоколадная прослойка", priceDelta: 0 },
        { value: "cherry", label: "Вишнёвая", priceDelta: 250 },
      ],
      base: [
        { value: "classic", label: "Классическая", priceDelta: 0 },
        { value: "nut", label: "Ореховая", priceDelta: 180 },
      ]
    }
  },
  {
    id: "tart",
    title: "Тарталетка «Пекан»",
    category: "desserts",
    basePrice: 650,
    prepHours: 0.75,
    options: {
      coulis: [
        { value: "caramel", label: "Карамель", priceDelta: 0 },
        { value: "salted", label: "Солёная карамель", priceDelta: 80 },
      ],
      base: [
        { value: "classic", label: "Классическая", priceDelta: 0 },
        { value: "choco", label: "Шоколадная", priceDelta: 60 },
      ]
    }
  },
  {
    id: "cupcakes",
    title: "Капкейки набор (6 шт.)",
    category: "desserts",
    basePrice: 1200,
    prepHours: 1.0,
    options: {
      coulis: [
        { value: "vanilla", label: "Ваниль", priceDelta: 0 },
        { value: "raspberry", label: "Малина", priceDelta: 120 },
      ],
      base: [
        { value: "classic", label: "Классика", priceDelta: 0 },
        { value: "redvelvet", label: "Red Velvet", priceDelta: 200 },
      ]
    }
  }
];

/* =========================
   ХРАНИЛИЩЕ
   ========================= */

const LS_KEYS = {
  cart: "sweet_cart_v1"
};

// Ключ корзины: для авторизованного пользователя — персональный
function getCartKey() {
  if (_cachedUser && _cachedUser.id) {
    return LS_KEYS.cart + '_' + _cachedUser.id;
  }
  return LS_KEYS.cart;
}

// Корзина — остаётся в localStorage (данные до оформления заказа)
function loadCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(getCartKey())) || [];
    // Миграция: если товар имеет unitPrice но не price, копируем
    cart.forEach(item => {
      if (item.unitPrice && !item.price) {
        item.price = item.unitPrice;
      }
    });
    return cart;
  }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem(getCartKey(), JSON.stringify(cart));
}

// Перенос анонимной корзины в корзину пользователя (при входе/регистрации)
function migrateCartToUser(userId) {
  try {
    const anonKey = LS_KEYS.cart;
    const userKey = LS_KEYS.cart + '_' + userId;
    const anonCart = JSON.parse(localStorage.getItem(anonKey) || '[]');
    if (anonCart.length === 0) return;

    const userCart = JSON.parse(localStorage.getItem(userKey) || '[]');

    for (const item of anonCart) {
      const existing = userCart.find(m =>
        m.productId === item.productId &&
        JSON.stringify(m.options) === JSON.stringify(item.options)
      );
      if (existing) {
        existing.qty += item.qty;
      } else {
        userCart.push(item);
      }
    }

    localStorage.setItem(userKey, JSON.stringify(userCart));
    localStorage.removeItem(anonKey);
  } catch (e) {
    console.error('Cart migration error:', e);
  }
}

// Заказы — кэш из API (для синхронного доступа в renderCalendar/renderTimes)
let _cachedOrders = [];
function loadOrders() {
  return _cachedOrders;
}
async function fetchOrdersFromServer() {
  try {
    if (typeof API !== 'undefined') {
      _cachedOrders = await API.getAvailability();
    }
  } catch { _cachedOrders = []; }
  return _cachedOrders;
}

/* =========================
   ПОЛЬЗОВАТЕЛИ И АВТОРИЗАЦИЯ (API)
   ========================= */

let _cachedUser = null;

function getCurrentUser() {
  return _cachedUser;
}

async function initAuth() {
  try {
    if (typeof API !== 'undefined') {
      _cachedUser = await API.getMe();
    }
  } catch { _cachedUser = null; }
  return _cachedUser;
}

function normalizePhone(raw) {
  return '+' + raw.replace(/\D/g, '');
}

async function registerUser(data) {
  if (typeof API !== 'undefined') {
    return await API.register(data);
  }
  return { error: 'API недоступен' };
}

async function loginUser(login, password) {
  if (typeof API !== 'undefined') {
    return await API.login(login, password);
  }
  return { error: 'API недоступен' };
}

async function updateUserProfile(userId, data) {
  if (typeof API !== 'undefined') {
    const result = await API.updateProfile(userId, data);
    if (result && !result.error) {
      _cachedUser = result;
    }
    return result;
  }
  return false;
}

async function logoutUser() {
  if (typeof API !== 'undefined') {
    await API.logout();
  }
  _cachedUser = null;
}

async function getUserOrders(userId) {
  if (typeof API !== 'undefined') {
    return await API.getMyOrders();
  }
  return [];
}

function updateProfileIcon() {
  const user = getCurrentUser();
  const links = document.querySelectorAll('a[href="auth.html"][aria-label="Профиль"]');
  links.forEach(a => {
    if (user) a.href = 'profile.html';
  });
}

async function setNotifBellBadge() {
  const bell = document.getElementById('notifBell');
  const badge = document.getElementById('notifBellBadge');
  if (!bell || !badge) return;
  const user = getCurrentUser();
  if (!user) { bell.style.display = 'none'; return; }
  bell.style.display = '';
  try {
    const data = await API.getUnreadNotifCount();
    if (data.count > 0) {
      badge.textContent = data.count;
      badge.style.display = '';
    } else {
      badge.style.display = 'none';
    }
  } catch(e) { badge.style.display = 'none'; }
}

function formatRUB(n) {
  return new Intl.NumberFormat("ru-RU").format(Math.round(n)) + " ₽";
}

function cartCount(cart) {
  return cart.reduce((sum, it) => sum + it.qty, 0);
}

function cartTotal(cart) {
  return cart.reduce((sum, it) => sum + it.price * it.qty, 0);
}

function cartPrepHours(cart) {
  return cart.reduce((sum, it) => sum + (it.prepHours || 1) * it.qty, 0);
}

/* =========================
   UI HELPERS
   ========================= */

function $(sel, root = document) { return root.querySelector(sel); }
function $all(sel, root = document) { return [...root.querySelectorAll(sel)]; }

function setCartBadge() {
  const cart = loadCart();
  const el = $("#cartCount");
  if (el) el.textContent = String(cartCount(cart));
}

function openDrawer() {
  const drawer = $("#cartDrawer");
  if (!drawer) return;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  const drawer = $("#cartDrawer");
  if (!drawer) return;
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
}

function openModal(id) {
  const modal = $(id);
  if (!modal) return;
  modal.style.display = 'flex';
  modal.hidden = false;
  modal.classList.add("open");
}
function closeModal(id) {
  const modal = $(id);
  if (!modal) return;
  modal.classList.remove("open");
  modal.style.display = 'none';
  modal.hidden = true;
}


function initCasualSlider(){
  const viewport = $("#casualViewport");
  if (!viewport) return;

  const prev = $("#casualPrev");
  const next = $("#casualNext");

  const getStep = () => {
    const firstCard = viewport.querySelector(".casual-card");
    if (!firstCard) return Math.round(viewport.clientWidth * 0.85);

    const cardW = firstCard.getBoundingClientRect().width;
    const track = $("#casualTrack");
    const gap = track ? parseFloat(getComputedStyle(track).gap || "0") : 0;

    return Math.round(cardW + gap);
  };

  function updateDisabled(){
    const maxScroll = viewport.scrollWidth - viewport.clientWidth - 2;
    const x = viewport.scrollLeft;

    if (prev) prev.disabled = x <= 2;
    if (next) next.disabled = x >= maxScroll;
  }

  prev?.addEventListener("click", () => {
    viewport.scrollBy({ left: -getStep(), behavior: "smooth" });
  });

  next?.addEventListener("click", () => {
    viewport.scrollBy({ left: getStep(), behavior: "smooth" });
  });

  viewport.addEventListener("scroll", updateDisabled, { passive: true });
  window.addEventListener("resize", updateDisabled);
  updateDisabled();
}

(function initToOrderSlider(){
  const viewport = document.getElementById("toorderViewport");
  const prevBtn = document.getElementById("toorderPrev");
  const nextBtn = document.getElementById("toorderNext");

  if (!viewport || !prevBtn || !nextBtn) return;

  // шаг = ширина одной карточки + gap между ними
  function getStep() {
    const card = viewport.querySelector(".toorder-card");
    if (!card) return viewport.clientWidth;

    const track = card.parentElement; // .toorder__track
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || 0) || 0;

    return card.getBoundingClientRect().width + gap;
  }

  function updateDisabled() {
    const maxScroll = viewport.scrollWidth - viewport.clientWidth - 2;
    const x = viewport.scrollLeft;
    prevBtn.disabled = x <= 2;
    nextBtn.disabled = x >= maxScroll;
  }

  prevBtn.addEventListener("click", () => {
    viewport.scrollBy({ left: -getStep(), behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    viewport.scrollBy({ left: getStep(), behavior: "smooth" });
  });

  viewport.addEventListener("scroll", updateDisabled, { passive: true });
  window.addEventListener("resize", updateDisabled);
  updateDisabled();
})();


/* =========================
   КАТАЛОГ
   ========================= */

function renderCatalog() {
  const grid = $("#catalogGrid");
  if (!grid) return;

  const q = ($("#searchInput")?.value || "").trim().toLowerCase();
  const cat = ($("#categorySelect")?.value || "all");

  const items = PRODUCTS.filter(p => {
    const okQ = !q || p.title.toLowerCase().includes(q);
    const okC = (cat === "all") || p.category === cat;
    return okQ && okC;
  });

  grid.innerHTML = items.map(p => `
    <article class="catalog-card">
      <div class="catalog-card__product-img" aria-hidden="true">
        <div class="catalog-card__order">
          <a class="catalog-card__btn" href="#" data-open-product="${p.id}">Выбрать варианты</a>
          <a class="catalog-card__btn" href="checkout.html">Бронирование</a>
        </div>
      </div>
      <div class="catalog-card__product-name">
        <a class="catalog-card__product-name_cake" href="#" data-open-product="${p.id}">${escapeHtml(p.title)}</a>
        <div class="catalog-card__product-name_price">
          ${formatRUB(p.basePrice)} <span class="subtitle">от</span>
        </div>
        <div class="subtitle">Время приготовления: ${p.prepHours} ч</div>
      </div>
    </article>
  `).join("");

  $all("[data-open-product]").forEach(a => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const id = a.getAttribute("data-open-product");
      openProductModal(id);
    });
  });
}

function escapeHtml(s) {
  return s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
}

/* =========================
   MODAL: ВЫБОР ВАРИАНТОВ + ДОБАВЛЕНИЕ В КОРЗИНУ
   ========================= */

let pmState = { productId: null, qty: 1 };

function openProductModal(productId) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;

  pmState = { productId, qty: 1 };

  $("#pmTitle").textContent = p.title;
  $("#pmSubtitle").textContent = `Базовая цена: ${formatRUB(p.basePrice)} · Время: ${p.prepHours} ч`;

  const coulisSel = $("#pmCoulis");
  const baseSel = $("#pmBase");

  coulisSel.innerHTML = p.options.coulis.map(o =>
    `<option value="${o.value}" data-delta="${o.priceDelta}">${o.label} (+${o.priceDelta})</option>`
  ).join("");
  baseSel.innerHTML = p.options.base.map(o =>
    `<option value="${o.value}" data-delta="${o.priceDelta}">${o.label} (+${o.priceDelta})</option>`
  ).join("");

  $("#pmQty").value = "1";
  updatePmPrice();

  openModal("#productModal");
}

function getSelectedOptionDelta(selectEl) {
  const opt = selectEl.selectedOptions[0];
  return Number(opt?.getAttribute("data-delta") || 0);
}

function updatePmPrice() {
  const p = PRODUCTS.find(x => x.id === pmState.productId);
  if (!p) return;

  const coulisDelta = getSelectedOptionDelta($("#pmCoulis"));
  const baseDelta = getSelectedOptionDelta($("#pmBase"));
  const unitPrice = p.basePrice + coulisDelta + baseDelta;

  $("#pmPrice").textContent = formatRUB(unitPrice * pmState.qty);
}

function addToCartFromModal() {
  const p = PRODUCTS.find(x => x.id === pmState.productId);
  if (!p) return;

  const coulisSel = $("#pmCoulis");
  const baseSel = $("#pmBase");

  const coulisValue = coulisSel.value;
  const baseValue = baseSel.value;

  const coulisLabel = coulisSel.selectedOptions[0]?.textContent || "";
  const baseLabel = baseSel.selectedOptions[0]?.textContent || "";

  const price = p.basePrice + getSelectedOptionDelta(coulisSel) + getSelectedOptionDelta(baseSel);

  const cart = loadCart();
  // если такая же конфигурация уже есть — увеличим qty
  const existing = cart.find(it =>
    it.productId === p.id &&
    it.options?.coulis === coulisValue &&
    it.options?.base === baseValue
  );

  if (existing) {
    existing.qty += pmState.qty;
  } else {
    cart.push({
      id: crypto.randomUUID?.() || String(Date.now() + Math.random()),
      productId: p.id,
      title: p.title,
      image: p.image || '',
      qty: pmState.qty,
      price,
      prepHours: p.prepHours,
      minQty: 1,
      qtyStep: 1,
      options: { coulis: coulisValue, base: baseValue },
      optionsLabel: { coulis: coulisLabel, base: baseLabel }
    });
  }

  saveCart(cart);
  setCartBadge();
  renderCartDrawer();
  closeModal("#productModal");
  openDrawer();
}

/* =========================
   КОРЗИНА (drawer)
   ========================= */

function renderCartDrawer() {
  const cart = loadCart();
  const itemsEl = $("#cartItems");
  const totalEl = $("#cartTotal") || $("#drawerTotal");

  if (itemsEl) {
    if (cart.length === 0) {
      itemsEl.innerHTML = `<div class="muted">Корзина пустая. Добавьте десерт из каталога.</div>`;
    } else {
      itemsEl.innerHTML = cart.map(it => `
        <div class="cart-item">
          <div class="cart-item__top">
            <div class="cart-item__name">${escapeHtml(it.title)}</div>
            <div class="price">${formatRUB(it.price * it.qty)}</div>
          </div>
          <div class="cart-item__meta">
            ${[it.optionsLabel?.coulis, it.optionsLabel?.base].filter(Boolean).map(s => escapeHtml(s)).join(' · ')}
          </div>
          <div class="cart-item__meta">${it.prepHours ? '⏱ ' + it.prepHours + ' ч/шт' : ''}</div>
          <div class="cart-item__actions">
            <button class="icon-btn" data-dec="${it.id}" type="button">−</button>
            <div class="subtitle">Кол-во: <b>${it.qty}</b></div>
            <button class="icon-btn" data-inc="${it.id}" type="button">+</button>
            <button class="icon-btn" data-del="${it.id}" type="button">Удалить</button>
          </div>
        </div>
      `).join("");

      $all("[data-inc]").forEach(btn => btn.addEventListener("click", () => changeQty(btn.dataset.inc, +1)));
      $all("[data-dec]").forEach(btn => btn.addEventListener("click", () => changeQty(btn.dataset.dec, -1)));
      $all("[data-del]").forEach(btn => btn.addEventListener("click", () => removeItem(btn.dataset.del)));
    }
  }

  if (totalEl) totalEl.textContent = formatRUB(cartTotal(cart));

  // мини-корзина на checkout
  const mini = $("#cartMini");
  if (mini) {
    mini.innerHTML = cart.length
      ? cart.map(it => `<div class="cart-item cart-item--mini">
          ${it.image ? `<img class="cart-item__img" src="${escapeHtml(it.image)}" alt="">` : ''}
          <div class="cart-item__body">
            <div class="cart-item__name">${escapeHtml(it.title)} × ${it.qty}</div>
            <div class="cart-item__meta">${[it.optionsLabel?.coulis, it.optionsLabel?.base].filter(Boolean).map(s => escapeHtml(s)).join(' · ')}</div>
            <div class="price">${formatRUB(it.price * it.qty)}</div>
          </div>
        </div>`).join("")
      : `<div class="muted">Корзина пустая. Вернитесь в каталог и добавьте товары.</div>`;
  }

  const checkoutTotal = $("#cartTotal");
  if (checkoutTotal && mini) checkoutTotal.textContent = formatRUB(cartTotal(cart));
}

function changeQty(itemId, delta) {
  const cart = loadCart();
  const it = cart.find(x => x.id === itemId);
  if (!it) return;

  const minQty = it.minQty || 1;
  const newQty = it.qty + delta;

  if (newQty < minQty) {
    if (confirm('Минимальный заказ: ' + minQty + ' шт. Удалить товар из корзины?')) {
      cart.splice(cart.indexOf(it), 1);
    } else {
      return;
    }
  } else {
    it.qty = newQty;
  }
  saveCart(cart);
  setCartBadge();
  renderCartDrawer();
  // при изменении корзины — перерисуем календарь/время на checkout
  if ($("#calendar")) initBookingUI();
}

function removeItem(itemId) {
  const cart = loadCart().filter(x => x.id !== itemId);
  saveCart(cart);
  setCartBadge();
  renderCartDrawer();
  if ($("#calendar")) initBookingUI();
}

/* =========================
   БРОНИРОВАНИЕ (checkout)
   ========================= */

const BOOKING_SETTINGS = {
  leadDays: 3,                 // не ранее чем через 3 дня
  daysToShow: 21,              // показываем 3 недели
  productionHoursPerDay: 8,    // лимит рабочих часов на день приготовления
  deliveryFrom: "10:00",
  deliveryTo: "18:00",
  slotStepMin: 15,
  serviceMin: 8,               // время вручения (передача заказа)
  bufferMin: 6                 // буфер
};

let bookingPick = {
  address: "",
  dateISO: null,
  time: null
};

function initBookingUI() {
  const calendarEl = $("#calendar");
  if (!calendarEl) return;

  // 1) Адрес
  const addressInput = $("#addressInput");
  bookingPick.address = (addressInput?.value || "").trim();

  // Рендер календаря
  renderCalendar();

  // Если дата уже выбрана — обновим времена
  renderTimes();
  renderSummary();

  // обработчики
  addressInput?.addEventListener("input", () => {
    bookingPick.address = addressInput.value.trim();
    renderTimes();
    renderSummary();
  });
}

function renderCalendar() {
  const calendarEl = $("#calendar");
  if (!calendarEl) return;

  const cart = loadCart();
  const cartHours = cartPrepHours(cart);
  const orders = loadOrders();

  const today = new Date();
  const start = addDays(startOfDay(today), BOOKING_SETTINGS.leadDays);

  const days = [];
  for (let i = 0; i < BOOKING_SETTINGS.daysToShow; i++) {
    const d = addDays(start, i);
    const iso = toISODate(d);

    const prepDay = addDays(d, -1);
    const prepISO = toISODate(prepDay);

    const busyHours = orders
      .filter(o => o.prepDateISO === prepISO)
      .reduce((sum, o) => sum + o.totalPrepHours, 0);

    const willBeBusy = busyHours + cartHours;
    const available = willBeBusy <= BOOKING_SETTINGS.productionHoursPerDay;

    days.push({
      date: d,
      iso,
      available,
      busyHours,
      willBeBusy
    });
  }

  calendarEl.innerHTML = days.map(x => {
    const dow = x.date.toLocaleDateString("ru-RU", { weekday: "short" });
    const day = x.date.getDate();
    const month = x.date.toLocaleDateString("ru-RU", { month: "short" });

    const selected = bookingPick.dateISO === x.iso;
    const cls = ["day", !x.available ? "disabled" : "", selected ? "selected" : ""].join(" ");
    const meta = x.available ? '' : 'Недоступно';

    return `
      <button class="${cls}" type="button" data-day="${x.iso}" ${x.available ? "" : "disabled"}>
        <div class="day__top">
          <div class="day__num">${day}</div>
          <div class="day__meta">${dow}</div>
        </div>
        <div class="day__meta">${month}</div>
        <div class="day__meta">${meta}</div>
      </button>
    `;
  }).join("");

  $all("[data-day]", calendarEl).forEach(btn => {
    btn.addEventListener("click", () => {
      bookingPick.dateISO = btn.dataset.day;
      bookingPick.time = null;
      renderCalendar();
      renderTimes();
      renderSummary();
    });
  });
}

function renderTimes() {
  const timesEl = $("#times");
  if (!timesEl) return;

    if (!bookingPick.dateISO) {
    timesEl.innerHTML = `<div class="muted">Сначала выберите дату в календаре.</div>`;
    return;
  }
  if (!bookingPick.address) {
    timesEl.innerHTML = `<div class="muted">Введите адрес доставки — после этого появятся доступные времена.</div>`;
    return;
  }

  const orders = loadOrders().filter(o => o.deliveryDateISO === bookingPick.dateISO);
  const slots = buildTimeSlots(
    BOOKING_SETTINGS.deliveryFrom,
    BOOKING_SETTINGS.deliveryTo,
    BOOKING_SETTINGS.slotStepMin
  );

  const availableSlots = slots.filter(t => isSlotFeasible({
    candidateTime: t,
    candidateAddress: bookingPick.address,
    existing: orders,
    serviceMin: BOOKING_SETTINGS.serviceMin,
    bufferMin: BOOKING_SETTINGS.bufferMin
  }));

  if (!availableSlots.length) {
    timesEl.innerHTML = `<div class="muted">На выбранную дату нет доступного времени доставки для указанного адреса.</div>`;
    return;
  }

  timesEl.innerHTML = availableSlots.map(t => {
    const selected = bookingPick.time === t;
    return `
      <button class="time-slot ${selected ? "selected" : ""}" type="button" data-time="${t}">
        ${t}
      </button>
    `;
  }).join("");

  $all("[data-time]", timesEl).forEach(btn => {
    btn.addEventListener("click", () => {
      bookingPick.time = btn.dataset.time;
      renderTimes();
      renderSummary();
    });
  });
}

function renderSummary() {
  const el = $("#bookingSummary");
  if (!el) return;

  const cart = loadCart();
  const total = cartTotal(cart);
  const prep = cartPrepHours(cart);

  const parts = [];

  parts.push(`<div class="subtitle">Итого: <b>${formatRUB(total)}</b></div>`);

  if (bookingPick.address) parts.push(`<div class="subtitle">Адрес: <b>${escapeHtml(bookingPick.address)}</b></div>`);
  if (bookingPick.dateISO) parts.push(`<div class="subtitle">Дата: <b>${humanDate(bookingPick.dateISO)}</b></div>`);
  if (bookingPick.time) parts.push(`<div class="subtitle">Время: <b>${bookingPick.time}</b></div>`);

  // подсказка, чего не хватает
  const missing = [];
  if (!cart.length) missing.push("добавьте товары в корзину");
  if (!bookingPick.address) missing.push("укажите адрес");
  if (!bookingPick.dateISO) missing.push("выберите дату");
  if (!bookingPick.time) missing.push("выберите время");

  if (missing.length) {
    parts.push(`<div class="muted">Чтобы оформить заказ: ${missing.join(", ")}.</div>`);
  }

  el.innerHTML = parts.join("");
}

async function placeOrder() {
  const cart = loadCart();
  if (!cart.length) {
    alert("Корзина пустая. Добавьте десерты в каталоге.");
    return;
  }
  if (!bookingPick.address) {
    alert("Введите адрес доставки.");
    return;
  }
  if (!bookingPick.dateISO) {
    alert("Выберите дату бронирования.");
    return;
  }
  if (!bookingPick.time) {
    alert("Выберите время доставки.");
    return;
  }

  // Контактные данные
  const contactName = ($("#contactName")?.value || "").trim();
  const contactPhone = ($("#contactPhone")?.value || "").trim();
  const contactEmail = ($("#contactEmail")?.value || "").trim();

  if (!contactName) { alert("Укажите имя для связи."); return; }
  if (!contactPhone || contactPhone.replace(/\D/g, '').length < 11) { alert("Укажите корректный телефон."); return; }

  try {
    const result = await API.createOrder({
      items: cart,
      address: bookingPick.address,
      deliveryDateISO: bookingPick.dateISO,
      deliveryTime: bookingPick.time,
      contactName,
      contactPhone,
      contactEmail
    });

    if (result.error) {
      alert(result.error);
      return;
    }

    // очистим корзину
    saveCart([]);
    setCartBadge();
    renderCartDrawer();

    // красивое подтверждение
    const okModal = $("#successModal");
    if (okModal) {
      $("#successOrderId") && ($("#successOrderId").textContent = result.order.id);
      // Для незарегистрированных показываем hint о почте
      const isGuest = !getCurrentUser();
      const emailHint = $("#successEmailHint");
      if (emailHint) {
        emailHint.style.display = isGuest ? 'block' : 'none';
      }
      openModal("#successModal");
    } else {
      alert(`Заказ оформлен! Номер: ${result.order.id.slice(0, 8)}`);
      if (location.pathname.endsWith("checkout.html")) location.href = "profile.html";
    }

    // сброс выбора
    bookingPick.time = null;
    bookingPick.dateISO = null;
    renderSummary();
    if ($("#calendar")) renderCalendar();
    if ($("#times")) renderTimes();

  } catch (err) {
    console.error('placeOrder error:', err);
    alert("Ошибка при оформлении заказа. Попробуйте ещё раз.");
  }
}

/* =========================
   ЛОГИКА ДОСТАВКИ (упрощённая)
   ========================= */

function isSlotFeasible({ candidateTime, candidateAddress, existing, serviceMin, bufferMin }) {
  const t = timeToMin(candidateTime);
  const events = existing
    .map(o => ({ timeMin: timeToMin(o.deliveryTime), address: o.address }))
    .sort((a, b) => a.timeMin - b.timeMin);

  // найдём “соседей” по времени
  let prev = null, next = null;
  for (let i = 0; i < events.length; i++) {
    if (events[i].timeMin < t) prev = events[i];
    if (events[i].timeMin > t) { next = events[i]; break; }
    // если точное время уже занято — запрещаем
    if (events[i].timeMin === t) return false;
  }

  const pad = serviceMin + bufferMin;

  if (prev) {
    const need = estimateTravelMin(prev.address, candidateAddress) + pad;
    if (t - prev.timeMin < need) return false;
  }
  if (next) {
    const need = estimateTravelMin(candidateAddress, next.address) + pad;
    if (next.timeMin - t < need) return false;
  }

  // граничные условия рабочего времени доставки
  const from = timeToMin(BOOKING_SETTINGS.deliveryFrom);
  const to = timeToMin(BOOKING_SETTINGS.deliveryTo);
  if (t < from || t > to) return false;

  return true;
}

// Здесь можно позже заменить на реальный API (Яндекс/Google).
// Сейчас — стабильная “псевдо-оценка” времени в пути на основе строк адресов.
function estimateTravelMin(a, b) {
  if (!a || !b) return 12;
  const aa = a.trim().toLowerCase();
  const bb = b.trim().toLowerCase();
  if (aa === bb) return 6;

  // Псевдо-случайное, но детерминированное число 7..24
  const h = hashString(aa + "|" + bb);
  const minutes = 7 + (h % 18); // 7..24
  return minutes;
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/* =========================
   ДАТЫ/ВРЕМЯ — утилиты
   ========================= */

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function toISODate(d) {
  // YYYY-MM-DD по локальному времени
  const x = new Date(d);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const day = String(x.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function fromISODate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m - 1), d);
}
function humanDate(iso) {
  const d = fromISODate(iso);
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" });
}

function timeToMin(t) {
  const [hh, mm] = t.split(":").map(Number);
  return hh * 60 + mm;
}
function minToTime(m) {
  const hh = String(Math.floor(m / 60)).padStart(2, "0");
  const mm = String(m % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}
function buildTimeSlots(fromHHMM, toHHMM, stepMin) {
  const from = timeToMin(fromHHMM);
  const to = timeToMin(toHHMM);
  const out = [];
  for (let t = from; t <= to; t += stepMin) out.push(minToTime(t));
  return out;
}

/* =========================
   INIT + ГЛОБАЛЬНЫЕ СЛУШАТЕЛИ
   ========================= */

function bindGlobalUI() {
  // Drawer open/close
  const openBtn = $("#cartOpenBtn") || $("[data-open-cart]");
  const closeBtn = $("#cartCloseBtn") || $("[data-close-cart]");
  const overlay = $("#cartOverlay");

  openBtn?.addEventListener("click", (e) => { e.preventDefault(); renderCartDrawer(); openDrawer(); });
  closeBtn?.addEventListener("click", (e) => { e.preventDefault(); closeDrawer(); });
  overlay?.addEventListener("click", () => closeDrawer());

  // Кнопка корзины в шапке — переход на cart.html
  const cartBtn = $("#btnCart");
  cartBtn?.addEventListener("click", (e) => { e.preventDefault(); location.href = "cart.html"; });

  // ESC для drawer и модалок
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDrawer();
      // закрыть открытые модалки
      $all(".modal.open").forEach(m => { m.classList.remove("open"); m.hidden = true; });
          closeMobileMenu?.();

    }

  });

  // Product modal controls
  $("#pmClose")?.addEventListener("click", () => closeModal("#productModal"));
  $("#pmAdd")?.addEventListener("click", (e) => { e.preventDefault(); addToCartFromModal(); });

  $("#pmCoulis")?.addEventListener("change", () => updatePmPrice());
  $("#pmBase")?.addEventListener("change", () => updatePmPrice());
  $("#pmQty")?.addEventListener("input", () => {
    const v = Math.max(1, Math.min(99, Number($("#pmQty").value || 1)));
    pmState.qty = v;
    $("#pmQty").value = String(v);
    updatePmPrice();
  });

  // Закрытие модалки кликом по фону (если структура позволяет)
  $all("[data-close-modal]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-close-modal");
      if (id) closeModal(id);
    });
  });

  // Success modal close (если есть)
  $("#successClose")?.addEventListener("click", () => {
    closeModal("#successModal");
    location.href = "index.html";
  });
}

  // Mobile menu (burger)
  const btnMenu = $("#btnMenu");
  const mobileMenu = $("#mobileMenu");
  const btnMenuClose = $("#btnMenuClose");

  function openMobileMenu(){
    if (!mobileMenu) return;
    mobileMenu.hidden = false;
    mobileMenu.classList.add("open");
    document.body.classList.add("menu-open");
  }
  function closeMobileMenu(){
    if (!mobileMenu) return;
    mobileMenu.classList.remove("open");
    mobileMenu.hidden = true;
    document.body.classList.remove("menu-open");
  }

  btnMenu?.addEventListener("click", openMobileMenu);
  btnMenuClose?.addEventListener("click", closeMobileMenu);

  mobileMenu?.addEventListener("click", (e) => {
    const t = e.target;
    if (t?.matches?.("[data-mobile-close='true']")) closeMobileMenu();
  });



function bindCatalogFilters() {
  $("#searchInput")?.addEventListener("input", () => renderCatalog());
  $("#categorySelect")?.addEventListener("change", () => renderCatalog());
}

function bindCheckoutSubmit() {
  const btn = $("#placeOrder");
  btn?.addEventListener("click", (e) => {
    e.preventDefault();
    placeOrder();
  });

  // если у тебя форма с submit
  $("#checkoutForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    placeOrder();
  });
}

function bindMegaMenu(){
  const header = document.querySelector(".header");
  const mega = document.getElementById("mega");
  const triggers = document.querySelectorAll('[data-mega]');

  if (!header || !mega || !triggers.length) return;

  let closeTimer = null;

  const open = (key) => {
    clearTimeout(closeTimer);
    mega.dataset.active = key;
    mega.setAttribute("aria-hidden", "false");
    header.classList.add("header--mega-open");
    if (key === "city") initDeliveryMap(); // ← ДОБАВЬ ЭТУ СТРОКУ
    if (key === "city") initCityIframeMap();

  };

  const close = () => {
    clearTimeout(closeTimer);
    mega.dataset.active = "";
    mega.setAttribute("aria-hidden", "true");
    header.classList.remove("header--mega-open");
  };

  const scheduleClose = () => {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(close, 120);
  };

  triggers.forEach((a) => {
    a.addEventListener("mouseenter", () => open(a.dataset.mega));
    a.addEventListener("focus", () => open(a.dataset.mega));
  });

  header.addEventListener("mouseleave", scheduleClose);
  header.addEventListener("mouseenter", () => clearTimeout(closeTimer));

  mega.addEventListener("mouseenter", () => clearTimeout(closeTimer));
  mega.addEventListener("mouseleave", scheduleClose);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}


document.addEventListener("DOMContentLoaded", async () => {
  // Загружаем авторизацию и заказы с сервера
  await initAuth();
  await fetchOrdersFromServer();

  setCartBadge();
  renderCartDrawer();
  renderCatalog();
  initCasualSlider();
  bindGlobalUI();
  initBookingUI();
  bindMegaMenu();
  updateProfileIcon();
  setNotifBellBadge();

  // index/catalog
  if ($("#catalogGrid")) {
    renderCatalog();
    bindCatalogFilters();
  }

  // checkout
  if ($("#calendar")) {
    renderCartDrawer();
    initBookingUI();
    bindCheckoutSubmit();
    renderSummary();
  }
});

// FAQ: открывать только один пункт
document.querySelectorAll('.faq-item').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq-item').forEach((other) => {
      if (other !== item) other.removeAttribute('open');
    });
  });
});


function initMegaMenu() {
  const mega = document.getElementById("megaMenu");
  const header = document.querySelector(".header__section");
  const triggers = document.querySelectorAll(".header__nav--center [data-mega]");
  if (!mega || !header || !triggers.length) return;

  const panels = mega.querySelectorAll("[data-panel]");
  let closeTimer = null;

  const open = (name) => {
    // только для десктопа
    if (window.matchMedia("(max-width: 900px)").matches) return;

    clearTimeout(closeTimer);
    mega.classList.add("is-open");
    mega.setAttribute("aria-hidden", "false");

    panels.forEach(p => p.hidden = (p.dataset.panel !== name));
    triggers.forEach(t => t.classList.toggle("is-open", t.dataset.mega === name));
  };

  const close = () => {
    mega.classList.remove("is-open");
    mega.setAttribute("aria-hidden", "true");
    panels.forEach(p => p.hidden = true);
    triggers.forEach(t => t.classList.remove("is-open"));
  };

  triggers.forEach(t => {
    t.addEventListener("mouseenter", () => open(t.dataset.mega));
    t.addEventListener("focus", () => open(t.dataset.mega)); // клавиатура
  });

  // чтобы панель не закрывалась при переходе мышки с пункта меню на панель
  header.addEventListener("mouseleave", () => {
    closeTimer = setTimeout(close, 140);
  });
  mega.addEventListener("mouseenter", () => clearTimeout(closeTimer));
  mega.addEventListener("mouseleave", () => {
    closeTimer = setTimeout(close, 140);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  // если ресайзнули на мобилку — закрыть
  window.addEventListener("resize", () => {
    if (window.matchMedia("(max-width: 900px)").matches) close();
  });
}

let deliveryMapInited = false;

function initDeliveryMap() {
  if (deliveryMapInited) return;
  const el = document.getElementById('deliveryMap');
  if (!el) return;

  deliveryMapInited = true;

  ymaps.ready(() => {
    // Центр Дубны (примерный). Можно оставить.
    const dubnaCenter = [56.7419, 37.1756];

    const map = new ymaps.Map('deliveryMap', {
      center: dubnaCenter,
      zoom: 12,
      controls: ['zoomControl']
    });

    // 1) ВСТАВЬ СЮДА КООРДИНАТЫ ПОЛИГОНА ДУБНЫ
    // Формат: [[lat, lon], [lat, lon], ...]
    const dubnaPolygonCoords = [
      // Пример-заглушка (НЕ настоящая граница!)
      [56.76, 37.10],
      [56.77, 37.24],
      [56.70, 37.28],
      [56.69, 37.14],
      [56.76, 37.10]
    ];

    const polygon = new ymaps.Polygon([dubnaPolygonCoords], {
      hintContent: 'Зона доставки: г. Дубна'
    }, {
      fillColor: 'rgba(199,164,106,0.18)',
      strokeColor: 'rgba(199,164,106,0.85)',
      strokeWidth: 2
    });

    map.geoObjects.add(polygon);

    // Подогнать карту под полигон
    map.setBounds(polygon.geometry.getBounds(), {
      checkZoomRange: true,
      zoomMargin: 20
    });

    // Если панель сначала скрыта — иногда нужно “переизмерить” карту
    setTimeout(() => map.container.fitToViewport(), 100);
  });
}

function initCityIframeMap() {
  const frame = document.querySelector('.mega__panel--city iframe[data-src]');
  if (!frame) return;

  if (!frame.src) {
    frame.src = frame.dataset.src;
  }
}


/* =========================
   COLLECTION PAGE (summer.html)
   ========================= */



const SUMMER_CATEGORIES = [
  { id: "all", title: "Все" },
  { id: "summer", title: "Летняя коллекция" },
  { id: "bento", title: "Бенто-торты" },
  { id: "february", title: "23 февраля" },
  { id: "easter", title: "Пасха" },
  { id: "cakes", title: "Пирожные" },
  { id: "mousse", title: "Муссовые бенто-торты" },
  { id: "macarons", title: "Macarons" },
  { id: "candies", title: "Шоколад и конфеты" },
  { id: "cheesecake", title: "Чизкейки" },
];
const COLLECTION_PAGES = {
  all: "casual.html",
  summer: "casual.html?cat=summer",
  bento: "casual.html?cat=bento",
  february: "casual.html?cat=february",
  easter: "casual.html?cat=easter",
  cakes: "casual.html?cat=cakes",
  mousse: "casual.html?cat=mousse",
  macarons: "casual.html?cat=macarons",
  candies: "casual.html?cat=candies",
  cheesecake: "casual.html?cat=cheesecake",
};

const SUMMER_PRODUCTS = [
  // пример — подставь свои фото/цены/бейджи
  { id:"summer-berry-basket", cat:"summer", title:"Торт «Ягодное лукошко»", priceText:"7 200 ₽", qtyText:"от 3 кг", tag:"Хит", img:"img/summer-1.jpg",imgHover: "img/summer-1b.jpg" },
  { id:"summer-3d-raspberry", cat:"summer", title:"3D Пирожные с сублимированной малиной", priceText:"750 ₽", qtyText:"от 4 шт", tag:"", img:"img/summer-2.jpg",imgHover: "img/summer-2b.jpg" },
  { id:"summer-marshmallow-cup", cat:"summer", title:"Зефир в вафельном стаканчике", priceText:"400 ₽", qtyText:"от 6 шт", tag:"", img:"img/summer-3.jpg",imgHover: "img/summer-3b.jpg" },
  { id:"summer-festive-chic", cat:"summer", title:"Торт Праздничный шик", priceText:"6 800 ₽", qtyText:"от 3 кг", tag:"Новинка", img:"img/summer-4.jpg",imgHover: "img/summer-4b.jpg" },
  { id:"summer-loving-hearts", cat:"summer", title:"Бенто-Торт «Любящие сердца»", priceText:"1 000 ₽", qtyText:"от 1 шт", tag:"", img:"img/summer-5.jpg",imgHover: "img/summer-5b.jpg" },
  { id:"summer-meringue-roll", cat:"summer", title:"Меренговый рулет с ягодами", priceText:"1100 ₽", qtyText:"1 кг", tag:"", img:"img/summer-6.jpg",imgHover: "img/summer-6b.jpg" },
];

const BENTO_PRODUCTS = [
  // пример — замени на свои
  { id:"bento-strawberry", cat:"bento", title:"Бенто «Клубника»", priceText:"1 000 ₽", qtyText:"от 1 шт", tag:"Хит", img:"img/bento-1.jpg",imgHover: "img/bento-1b.jpg" },
  { id:"bento-love", cat:"bento", title:"Бенто «Любовь»", priceText:"1 250 ₽", qtyText:"от 1 шт", tag:"", img:"img/bento-2.jpg",imgHover: "img/bento-2b.jpg" },
  { id:"bento-capybara", cat:"bento", title:"Бенто «Капибара»", priceText:"1 100 ₽", qtyText:"от 1 шт", tag:"Новинка", img:"img/bento-3.jpg",imgHover: "img/bento-3b.jpg" },
  { id:"bento-dear-mom", cat:"bento", title:"Бенто «Любимой маме»", priceText:"1 200 ₽", qtyText:"от 1 шт", tag:"Хит", img:"img/bento-4.jpg",imgHover: "img/bento-4b.jpg" },
  { id:"bento-my-bun", cat:"bento", title:"Бенто «Моей булочке»", priceText:"1 150 ₽", qtyText:"от 1 шт", tag:"", img:"img/bento-5.jpg",imgHover: "img/bento-5b.jpg" },
  { id:"bento-happy-birthday", cat:"bento", title:"Бенто «Happy Birthday»", priceText:"1 050 ₽", qtyText:"от 1 шт", tag:"Новинка", img:"img/bento-6.jpg",imgHover: "img/bento-6b.jpg" },
];

const FEBRUARY_PRODUCTS = [
  // пример — замени на свои
  { id:"february-beer", cat:"february", title:"Десерт «Пиво»", priceText:"700 ₽", qtyText:"от 1 шт", tag:"Хит", img:"img/february-1.jpg",imgHover: "img/february-1b.jpg" },
  { id:"february-macarons-23", cat:"february", title:"Macarons «23»", priceText:"1 670 ₽", qtyText:"от 8 шт", tag:"Новинка", img:"img/february-2.jpg",imgHover: "img/february-2b.jpg" },
  { id:"february-defender", cat:"february", title:"Пирожные «Защитник»", priceText:"900 ₽", qtyText:"от 4 шт", tag:"", img:"img/february-3.jpg",imgHover: "img/february-3b.jpg" },
  { id:"february-bento-23", cat:"february", title:"Бенто «23 февраля»", priceText:"1 100 ₽", qtyText:"от 1 шт", tag:"", img:"img/february-4.jpg",imgHover: "img/february-4b.jpg" },
  { id:"february-dumplings", cat:"february", title:"Конфеты «Пельмени»", priceText:"550 ₽", qtyText:"от 1 шт", tag:"", img:"img/february-5.jpg",imgHover: "img/february-5b.jpg" },

];

const EASTER_PRODUCTS = [
  // пример — замени на свои
  { id:"easter-eggs", cat:"easter", title:"Десерт «Пасхальные яйца»", priceText:"900 ₽", qtyText:"от 7 шт", tag:"Хит", img:"img/easter-1.jpg",imgHover: "img/easter-1b.jpg" },
  { id:"easter-paskha-1", cat:"easter", title:"Творожная пасха", priceText:"1 300 ₽", qtyText:"от 1 шт", tag:"", img:"img/easter-2.jpg",imgHover: "img/easter-2b.jpg" },
  { id:"easter-kulich", cat:"easter", title:"Пасхальный кулич", priceText:"350 ₽", qtyText:"от 1 шт", tag:"Новинка", img:"img/easter-3.jpg",imgHover: "img/easter-3b.jpg" },
  { id:"easter-cheesecake", cat:"easter", title:"Творожный чизкейк", priceText:"1 300 ₽", qtyText:"от 3 шт", tag:"", img:"img/easter-4.jpg",imgHover: "img/easter-4b.jpg" },
  { id:"easter-paskha-2", cat:"easter", title:"Творожная пасха", priceText:"600 ₽", qtyText:"от 1 шт", tag:"", img:"img/easter-5.jpg",imgHover: "img/easter-5b.jpg" },

];

const CAKES_PRODUCTS = [
  // пример — замени на свои
  { id:"cakes-mini-cheesecake", cat:"cakes", title:"Мини Чизкейк", priceText:"от 300 ₽", qtyText:"от 2 шт", tag:"Новинка", img:"img/cakes-1.jpg",imgHover: "img/cakes-1b.jpg" },
  { id:"cakes-assortment", cat:"cakes", title:"Ассорти пирожных", priceText:"1 200 ₽", qtyText:"набор 4 шт", tag:"", img:"img/cakes-2.jpg",imgHover: "img/cakes-2b.jpg" },
  { id:"cakes-mousse-hearts", cat:"cakes", title:"Муссовые сердца", priceText:"от 750 ₽", qtyText:"от 4 шт", tag:"Хит", img:"img/cakes-3.jpg",imgHover: "img/cakes-3b.jpg" },
  { id:"cakes-potato", cat:"cakes", title:"Пирожное картошка", priceText:"от 600 ₽", qtyText:"от 4 шт", tag:"", img:"img/cakes-4.jpg",imgHover: "img/cakes-4b.jpg" },
  { id:"cakes-madeleine", cat:"cakes", title:"Мадлен", priceText:"от 860 ₽", qtyText:"от 8 шт", tag:"", img:"img/cakes-5.jpg",imgHover: "img/cakes-5b.jpg" },

];

const MOUSSE_PRODUCTS = [
  // пример — замени на свои
  { id:"mousse-chocolate", cat:"mousse", title:"Шоколадный муссовый бенто-торт", priceText:"1280 ₽", qtyText:"от 1 шт", tag:"", img:"img/mousse-1.jpg",imgHover: "img/mousse-1b.jpg" },
  { id:"mousse-berry", cat:"mousse", title:"Ягодный муссовый бенто-торт", priceText:"1150 ₽", qtyText:"от 1 шт", tag:"", img:"img/mousse-2.jpg",imgHover: "img/mousse-2b.jpg" },
  { id:"mousse-cream", cat:"mousse", title:"Кремовый муссовый бенто-торт", priceText:"1150 ₽", qtyText:"от 1 шт", tag:"", img:"img/mousse-3.jpg",imgHover: "img/mousse-3b.jpg" },
  { id:"mousse-lemon", cat:"mousse", title:"Лимонный муссовый бенто-торт", priceText:"900 ₽", qtyText:"от 1 шт", tag:"Хит", img:"img/mousse-4.jpg",imgHover: "img/mousse-4b.jpg" },
  { id:"mousse-coffee", cat:"mousse", title:"Кофейный муссовый бенто-торт", priceText:"850 ₽", qtyText:"от 1 шт", tag:"Новинка", img:"img/mousse-5.jpg",imgHover: "img/mousse-5b.jpg" },

];

const MACARONS_PRODUCTS = [
  // пример — замени на свои
  { id:"macarons-set-1", cat:"macarons", title:"Набор1 Французских Macarons", priceText:"1800 ₽", qtyText:"от 1 шт", tag:"Новинка", img:"img/macarons-1.jpg",imgHover: "img/macarons-1b.jpg" },
  { id:"macarons-set-2", cat:"macarons", title:"Набор2 Французских Macarons", priceText:"1890 ₽", qtyText:"от 1 шт", tag:"", img:"img/macarons-2.jpg",imgHover: "img/macarons-2b.jpg" },
  { id:"macarons-set-3", cat:"macarons", title:"Набор3 Французских Macarons", priceText:"1900 ₽", qtyText:"от 1 шт", tag:"", img:"img/macarons-3.jpg",imgHover: "img/macarons-3b.jpg" },
  { id:"macarons-set-4", cat:"macarons", title:"Набор4 Французских Macarons", priceText:"1700 ₽", qtyText:"от 1 шт", tag:"Хит", img:"img/macarons-4.jpg",imgHover: "img/macarons-4b.jpg" },
  { id:"macarons-classic", cat:"macarons", title:"Классические Французские Macarons", priceText:"1200 ₽", qtyText:"от 1 шт", tag:"", img:"img/macarons-5.jpg",imgHover: "img/macarons-5b.jpg" },
  { id:"macarons-set-5", cat:"macarons", title:"Набор5 Французских Macarons", priceText:"1400 ₽", qtyText:"от 1 шт", tag:"Новинка", img:"img/macarons-6.jpg",imgHover: "img/macarons-6b.jpg" },

];

const CANDIES_PRODUCTS = [
  // пример — замени на свои
  { id:"candies-dubai-chocolate", cat:"candies", title:"Дубайский шоколад", priceText:"1200 ₽", qtyText:"от 1 шт", tag:"Новинка", img:"img/candies-1.jpg",imgHover: "img/candies-1b.jpg" },
  { id:"candies-galactic-love", cat:"candies", title:"Конфеты «Галактическая любовь»", priceText:"450 ₽", qtyText:"от 1 шт", tag:"Хит", img:"img/candies-2.jpg",imgHover: "img/candies-2b.jpg" },
  { id:"candies-set-1", cat:"candies", title:"Набор1 конфет", priceText:"500 ₽", qtyText:"от 1 шт", tag:"", img:"img/candies-3.jpg",imgHover: "img/candies-3b.jpg" },
  { id:"candies-set-2", cat:"candies", title:"Набор2 конфет", priceText:"300 ₽", qtyText:"от 1 шт", tag:"", img:"img/candies-4.jpg",imgHover: "img/candies-4b.jpg" },
  { id:"candies-kiss", cat:"candies", title:"Набор конфет «Поцелуй»", priceText:"780 ₽", qtyText:"от 1 шт", tag:"Новинка", img:"img/candies-5.jpg",imgHover: "img/candies-5b.jpg" },
  { id:"candies-hearts", cat:"candies", title:"Конфеты «Сердечки»", priceText:"570 ₽", qtyText:"от 1 шт", tag:"", img:"img/candies-6.jpg",imgHover: "img/candies-6b.jpg" },

];

const CHEESECAKE_PRODUCTS = [
  // пример — замени на свои
  { id:"cheesecake-dubai", cat:"cheesecake", title:"Чизкейк «Дубайский шоколад»", priceText:"1200 ₽", qtyText:"от 1 шт", tag:"Новинка", img:"img/cheesecake-1.jpg",imgHover: "img/cheesecake-1b.jpg" },
  { id:"cheesecake-raspberry-passion", cat:"cheesecake", title:"Чизкейк «Малина-маракуя»", priceText:"1150 ₽", qtyText:"от 1 шт", tag:"Хит", img:"img/cheesecake-2.jpg",imgHover: "img/cheesecake-2b.jpg" },
  { id:"cheesecake-tiramisu", cat:"cheesecake", title:"Чизкейк «Тирамису»", priceText:"1000 ₽", qtyText:"от 1 шт", tag:"", img:"img/cheesecake-3.jpg",imgHover: "img/cheesecake-3b.jpg" },
  { id:"cheesecake-blueberry", cat:"cheesecake", title:"Чизкейк «С голубикой»", priceText:"1170 ₽", qtyText:"от 1 шт", tag:"", img:"img/cheesecake-4.jpg",imgHover: "img/cheesecake-4b.jpg" },

];

function initSummerCollectionPage() {
  const grid = document.getElementById("summerGrid");
  const chipsWrap = document.getElementById("collectionChips");
  if (!grid || !chipsWrap) return; // не summer.html

  // состояние
    const pageKey = document.body.dataset.collection || "summer";

const ALL_CASUAL_PRODUCTS = [
  ...SUMMER_PRODUCTS, ...BENTO_PRODUCTS, ...FEBRUARY_PRODUCTS,
  ...EASTER_PRODUCTS, ...CAKES_PRODUCTS, ...MOUSSE_PRODUCTS,
  ...MACARONS_PRODUCTS, ...CANDIES_PRODUCTS, ...CHEESECAKE_PRODUCTS
];

let PRODUCTS = ALL_CASUAL_PRODUCTS;
if (pageKey === "summer") PRODUCTS = SUMMER_PRODUCTS;
if (pageKey === "bento") PRODUCTS = BENTO_PRODUCTS;
if (pageKey === "february") PRODUCTS = FEBRUARY_PRODUCTS;
if (pageKey === "easter") PRODUCTS = EASTER_PRODUCTS;
if (pageKey === "cakes") PRODUCTS = CAKES_PRODUCTS;
if (pageKey === "mousse") PRODUCTS = MOUSSE_PRODUCTS;
if (pageKey === "macarons") PRODUCTS = MACARONS_PRODUCTS;
if (pageKey === "candies") PRODUCTS = CANDIES_PRODUCTS;
if (pageKey === "cheesecake") PRODUCTS = CHEESECAKE_PRODUCTS;


  const defaultCat = document.body.dataset.defaultCat || pageKey;
  let activeCat = defaultCat;
         // верхние чипсы
  let sortMode = "popular";       // popular | price | new
  let priceMin = null;
  let priceMax = null;
  let selectedCats = new Set();   // чекбоксы в фильтрах (если пусто — значит "все")

  // элементы фильтров
  const sortTabs = Array.from(document.querySelectorAll(".sortTab"));
  const priceMinEl = document.getElementById("priceMin");
  const priceMaxEl = document.getElementById("priceMax");
  const applyBtn = document.getElementById("applyFilters");
  const resetBtn = document.getElementById("resetFilters");

  // helpers
  const toNumber = (priceText) => {
    // "от 750 ₽" -> 750, "6 000 ₽" -> 6000
    const n = Number(String(priceText).replace(/[^\d]/g, "")) || 0;
    return n;
  };

  function readFiltersFromUI() {
    priceMin = priceMinEl?.value ? Number(priceMinEl.value) : null;
    priceMax = priceMaxEl?.value ? Number(priceMaxEl.value) : null;

    selectedCats = new Set(
      Array.from(document.querySelectorAll("input[name='cats']:checked"))
        .map(i => i.value)
    );
  }

  function applyFiltering(items) {
    return items.filter(p => {
      // 1) верхние чипсы
      if (activeCat !== "all" && p.cat !== activeCat) return false;


      // 2) чекбоксы категорий (если что-то выбрано — фильтруем)
      if (selectedCats.size > 0 && !selectedCats.has(p.cat)) return false;

      // 3) цена
      const price = toNumber(p.priceText);
      if (priceMin !== null && price < priceMin) return false;
      if (priceMax !== null && price > priceMax) return false;

      return true;
    });
  }

  function applySorting(items) {
    const arr = [...items];

    if (sortMode === "price") {
      arr.sort((a, b) => toNumber(a.priceText) - toNumber(b.priceText));
      return arr;
    }

    if (sortMode === "new") {
      // "Новинка" — наверх, остальное ниже; внутри можно по цене/имени как хочешь
      arr.sort((a, b) => {
        const an = a.tag === "Новинка" ? 1 : 0;
        const bn = b.tag === "Новинка" ? 1 : 0;
        return bn - an;
      });
      return arr;
    }

    // popular — оставляем порядок как в массиве
    return arr;
  }

  function render() {
    const filtered = applyFiltering(PRODUCTS);
    const sorted = applySorting(filtered);

    grid.innerHTML = sorted.map(p => `
  <article class="collect-card">
    <div class="collect-card__img">
      <!-- основная картинка -->
      <img class="collect-card__imgMain" src="${p.img}" alt="${escapeHtml(p.title)}">

      <!-- hover-картинка (если есть) -->
      ${p.imgHover ? `<img class="collect-card__imgHover" src="${p.imgHover}" alt="">` : ""}

      ${p.tag ? `<div class="collect-card__tag">${escapeHtml(p.tag)}</div>` : ""}
      <div class="collect-card__qty">${escapeHtml(p.qtyText)}</div>

      <!-- кнопка -->
      <a class="collect-card__btn" href="product.html?id=${escapeHtml(p.id)}&from=${encodeURIComponent(location.pathname.split('/').pop() + location.search)}" data-order="${escapeHtml(p.id || p.title)}">
        ЗАКАЗАТЬ
      </a>
    </div>

    <div class="collect-card__bottom">
      <div class="collect-card__name">${escapeHtml(p.title)}</div>
      <div class="collect-card__price">${escapeHtml(p.priceText)}</div>
    </div>
  </article>
`).join("");

  }

  // верхние чипсы категорий
  chipsWrap.innerHTML = SUMMER_CATEGORIES.map(c => {
  const page = COLLECTION_PAGES[c.id]; // только для summer / bento вернёт ссылку
  return `
    <button
      class="chip ${c.id === activeCat ? "is-active" : ""}"
      type="button"
      data-cat="${c.id}"
      ${page ? `data-page="${page}"` : ""}
    >
      ${c.title}
    </button>
  `;
}).join("");


  chipsWrap.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-cat]");
  if (!btn) return;

  const cat = btn.dataset.cat;
  const page = btn.dataset.page;            // ← если есть, значит это отдельная страница

  // 1) если чип ведёт на ДРУГУЮ страницу — переходим
  if (page) {
    const currentPage = location.pathname.split('/').pop() + location.search;
    if (currentPage !== page) {
      window.location.href = page;
      return;
    }
  }

  // 2) если мы УЖЕ на нужной странице (или страницы нет) — фильтруем и подсвечиваем
  activeCat = cat;

  chipsWrap.querySelectorAll(".chip").forEach(x => {
    x.classList.toggle("is-active", x.dataset.cat === activeCat);
  });

  render();
});




  // сортировка по вкладкам
  sortTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      sortMode = tab.dataset.sort || "popular";
      sortTabs.forEach(t => t.classList.toggle("is-active", t === tab));
      render();
    });
  });

  // применить фильтры
  applyBtn?.addEventListener("click", () => {
    readFiltersFromUI();
    render();
  });

  // сбросить фильтры
  resetBtn?.addEventListener("click", () => {
    // сброс UI
    if (priceMinEl) priceMinEl.value = "";
    if (priceMaxEl) priceMaxEl.value = "";
    document.querySelectorAll("input[name='cats']").forEach(i => (i.checked = false));

    // сброс состояния
    priceMin = null;
    priceMax = null;
    selectedCats = new Set();

    render();
  });

  // стартовый рендер
  render();
}


// подключаем в общий DOMContentLoaded (в конце твоего уже есть listener)
document.addEventListener("DOMContentLoaded", () => {
  initSummerCollectionPage();
});

//Фильтры и сортировка
(function () {
  const openBtn = document.getElementById("openFilters");
  const closeBtn = document.getElementById("closeFilters");
  const drawer = document.getElementById("filtersDrawer");
  const overlay = document.getElementById("filtersOverlay");

  if (!openBtn || !closeBtn || !drawer || !overlay) return;

  function openFilters() {
    document.documentElement.classList.add("filters-isOpen");
    document.body.classList.add("no-scroll");

    overlay.hidden = false;
    drawer.setAttribute("aria-hidden", "false");

    // фокус на кнопку закрытия
    closeBtn.focus();
  }

  function closeFilters() {
    document.documentElement.classList.remove("filters-isOpen");
    document.body.classList.remove("no-scroll");

    drawer.setAttribute("aria-hidden", "true");
    overlay.hidden = true;

    openBtn.focus();
  }

  openBtn.addEventListener("click", openFilters);
  closeBtn.addEventListener("click", closeFilters);
  overlay.addEventListener("click", closeFilters);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeFilters();
  });
})();
