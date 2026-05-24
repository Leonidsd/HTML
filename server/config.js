module.exports = {
  port: process.env.PORT || 3000,
  sessionCookieName: 'vkus_session',
  sessionMaxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
  bcryptRounds: 10,

  // === Учётные записи ===
  // Админ
  adminLogin: '+70000000000',
  adminPassword: 'admin',

  // Курьеры (id используется для привязки заказов)
  couriers: [
    { id: 'courier1', name: 'Курьер 1', login: '+71111111111', password: 'courier1' },
    { id: 'courier2', name: 'Курьер 2', login: '+72222222222', password: 'courier2' }
  ],

  bakeryAddress: 'Тверская улица, 1, Дубна, Московская область'
};
