const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const PORT = 3000;

// ===================== Middleware Statis =====================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// ===================== Middleware Parsing =====================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ===================== Session =====================
app.use(session({
  secret: 'rahasia-super-aman',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// ===================== View Engine & Layout =====================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);

// Middleware global
app.use((req, res, next) => {
  res.locals.user = req.session.user || null; 
  next();
});

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});


// ===================== Routing =====================
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const suratRoutes = require('./routes/surat');
const notificationRoutes = require('./routes/notifications');

app.use('/', authRoutes);
app.use('/', adminRoutes);
app.use('/', userRoutes);
app.use('/', suratRoutes);
app.use('/notifications', notificationRoutes);

// ===================== Route untuk buka file =====================
app.get('/uploads/:file', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.file);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).render('errors/404', {
      title: 'File Tidak Ditemukan',
      user: req.session.user,
      activePage : "404",
      layout: req.session.user?.role === 'admin' ? 'layouts/admin' : 'layouts/user',
      dashboardUrl: req.session.user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'
    });
  }
});

// ===================== Redirect Dashboard =====================
app.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  if (req.session.user.role === 'admin') {
    return res.redirect('/admin/dashboard');
  } else {
    return res.redirect('/user/dashboard');
  }
});

// Error 404
app.get('/errors/404', (req, res) => {
  res.status(404).render('errors/404');
});

// ===================== Start Server =====================
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
