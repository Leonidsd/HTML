const db = require('../db');
const config = require('../config');

function authMiddleware(req, res, next) {
  const token = req.cookies[config.sessionCookieName];
  if (!token) {
    req.user = null;
    return next();
  }

  // Специальные токены для админа/курьера
  if (token === 'admin-session') {
    req.user = { id: 'admin', name: 'Администратор', surname: '', patronymic: '', phone: config.adminLogin, email: '', address: '', role: 'admin' };
    req.sessionToken = token;
    return next();
  }
  // Курьеры: токен вида courier-session-courier1
  if (token && token.startsWith('courier-session-')) {
    const courierId = token.replace('courier-session-', '');
    const courierCfg = (config.couriers || []).find(c => c.id === courierId);
    if (courierCfg) {
      req.user = { id: courierCfg.id, name: courierCfg.name, surname: '', patronymic: '', phone: courierCfg.login, email: '', address: '', role: 'courier' };
      req.sessionToken = token;
      return next();
    }
  }
  // Обратная совместимость со старым токеном
  if (token === 'courier-session') {
    const c = (config.couriers || [])[0];
    req.user = { id: c ? c.id : 'courier', name: c ? c.name : 'Курьер', surname: '', patronymic: '', phone: c ? c.login : '', email: '', address: '', role: 'courier' };
    req.sessionToken = token;
    return next();
  }

  const session = db.prepare(`
    SELECT u.id, u.name, u.surname, u.patronymic, u.phone, u.email, u.address, u.role
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = ? AND (s.expires_at IS NULL OR s.expires_at > datetime('now'))
  `).get(token);

  if (!session) {
    res.clearCookie(config.sessionCookieName, { httpOnly: true, sameSite: 'lax', path: '/' });
    req.user = null;
    return next();
  }

  req.user = session;
  req.sessionToken = token;
  next();
}

function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Требуется авторизация' });
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'Доступ запрещён' });
  next();
}

function requireCourier(req, res, next) {
  if (!req.user || (req.user.role !== 'courier' && req.user.role !== 'admin')) {
    return res.status(403).json({ error: 'Доступ запрещён' });
  }
  next();
}

module.exports = { authMiddleware, requireAuth, requireAdmin, requireCourier };
