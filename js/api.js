/**
 * API-клиент для бэкенда «Вкус облаков»
 * Все методы возвращают Promise (async/await)
 */
const API = {

  // ====== Авторизация ======

  async register(data) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async login(login, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    });
    return res.json();
  },

  async logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
  },

  async getMe() {
    const res = await fetch('/api/auth/me');
    if (res.status === 401) return null;
    return res.json();
  },

  // ====== Профиль ======

  async updateProfile(userId, data) {
    const res = await fetch('/api/users/' + userId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // ====== Заказы ======

  async createOrder(orderData) {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  async getMyOrders() {
    const res = await fetch('/api/orders');
    if (res.status === 401) return [];
    return res.json();
  },

  async getAvailability() {
    const res = await fetch('/api/orders/availability');
    return res.json();
  },

  // ====== Админ ======

  async getAdminOrders(filter, search) {
    const params = new URLSearchParams();
    if (filter) params.set('status', filter);
    if (search) params.set('search', search);
    const res = await fetch('/api/admin/orders?' + params.toString());
    return res.json();
  },

  async updateOrderStatus(orderId, status) {
    const res = await fetch('/api/admin/orders/' + orderId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  async assignCourier(orderId, courierId) {
    const res = await fetch(`/api/admin/orders/${orderId}/courier`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courierId })
    });
    return res.json();
  },

  async getAdminUsers() {
    const res = await fetch('/api/admin/users');
    return res.json();
  },

  // ====== Курьер ======

  async getCourierOrders(date) {
    const params = date ? '?date=' + date : '';
    const res = await fetch('/api/courier/orders' + params);
    return res.json();
  },

  async updateCourierOrderStatus(orderId, status) {
    const res = await fetch('/api/courier/orders/' + orderId + '/status', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // ====== Каталог (products) ======

  async getAdminProducts(collection, search) {
    const params = new URLSearchParams();
    if (collection) params.set('collection', collection);
    if (search) params.set('search', search);
    const res = await fetch('/api/admin/products?' + params.toString());
    return res.json();
  },

  async createProduct(data) {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateProduct(id, data) {
    const res = await fetch('/api/admin/products/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteProduct(id) {
    const res = await fetch('/api/admin/products/' + id, { method: 'DELETE' });
    return res.json();
  },

  // ====== Рецептуры (recipes) ======

  async getAdminRecipes() {
    const res = await fetch('/api/admin/recipes');
    return res.json();
  },

  async getRecipeDetail(id) {
    const res = await fetch('/api/admin/recipes/' + id);
    return res.json();
  },

  async createRecipe(data) {
    const res = await fetch('/api/admin/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateRecipe(id, data) {
    const res = await fetch('/api/admin/recipes/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteRecipe(id) {
    const res = await fetch('/api/admin/recipes/' + id, { method: 'DELETE' });
    return res.json();
  },

  // ====== Ингредиенты (ingredients) ======

  async getAdminIngredients(search) {
    const params = search ? '?search=' + encodeURIComponent(search) : '';
    const res = await fetch('/api/admin/ingredients' + params);
    return res.json();
  },

  async createIngredient(data) {
    const res = await fetch('/api/admin/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateIngredient(id, data) {
    const res = await fetch('/api/admin/ingredients/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteIngredient(id) {
    const res = await fetch('/api/admin/ingredients/' + id, { method: 'DELETE' });
    return res.json();
  },

  // ====== Обратная связь ======

  async sendContactMessage(data) {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // ====== Отзывы ======

  async getReviews() {
    const res = await fetch('/api/reviews');
    return res.json();
  },

  async createReview(formData) {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      body: formData  // FormData (multipart)
    });
    return res.json();
  },

  // ====== Админ: обращения ======

  async getAdminMessages(status) {
    const params = status ? '?status=' + status : '';
    const res = await fetch('/api/admin/messages' + params);
    return res.json();
  },

  async updateMessage(id, data) {
    const res = await fetch('/api/admin/messages/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteMessage(id) {
    const res = await fetch('/api/admin/messages/' + id, { method: 'DELETE' });
    return res.json();
  },

  // ====== Админ: отзывы ======

  async getAdminReviews() {
    const res = await fetch('/api/admin/reviews');
    return res.json();
  },

  async updateReview(id, data) {
    const res = await fetch('/api/admin/reviews/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteReview(id) {
    const res = await fetch('/api/admin/reviews/' + id, { method: 'DELETE' });
    return res.json();
  },

  // ====== Ответ на обращение (админ) ======

  async replyToMessage(id, replyText) {
    const res = await fetch('/api/admin/messages/' + id + '/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply_text: replyText })
    });
    return res.json();
  },

  // ====== Уведомления (пользователь) ======

  async getNotifications() {
    const res = await fetch('/api/notifications');
    if (res.status === 401) return [];
    return res.json();
  },

  async getUnreadNotifCount() {
    const res = await fetch('/api/notifications/unread-count');
    if (res.status === 401) return { count: 0 };
    return res.json();
  },

  async markNotifRead(id) {
    const res = await fetch('/api/notifications/' + id + '/read', { method: 'PUT' });
    return res.json();
  },

  async markAllNotifsRead() {
    const res = await fetch('/api/notifications/read-all', { method: 'PUT' });
    return res.json();
  },

  // ====== Начинки ======

  async getFillings(showHidden = false) {
    const url = '/api/fillings' + (showHidden ? '?showHidden=true' : '');
    const res = await fetch(url);
    return res.json();
  },

  async getFilling(id) {
    const res = await fetch('/api/fillings/' + id);
    if (res.status === 404) return null;
    return res.json();
  },

  async createFilling(data) {
    const res = await fetch('/api/fillings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateFilling(id, data) {
    const res = await fetch('/api/fillings/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteFilling(id) {
    const res = await fetch('/api/fillings/' + id, { method: 'DELETE' });
    return res.json();
  },

  async getFillingRecipe(id) {
    const res = await fetch('/api/fillings/' + id + '/recipe');
    if (res.status === 404) return null;
    return res.json();
  },

  async updateFillingRecipe(id, data) {
    const res = await fetch('/api/fillings/' + id + '/recipe', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};
