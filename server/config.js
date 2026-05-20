module.exports = {
  port: process.env.PORT || 3000,
  sessionCookieName: 'vkus_session',
  sessionMaxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
  bcryptRounds: 10,

  // Креды админа и курьера (только на сервере)
  adminLogin: '+70000000000',
  adminPassword: 'admin',
  courierLogin: '+71111111111',
  courierPassword: 'courier',

  bakeryAddress: 'Тверская улица, 1, Дубна, Московская область'
};
