// middleware/auth.js
function cekLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

function isAdmin(req, res, next) {
  if (req.session.user.role !== 'admin') {
    return res.status(403).send('Akses ditolak. Hanya untuk admin.');
  }
  next();
}

module.exports = {
  cekLogin,
  isAdmin
};
