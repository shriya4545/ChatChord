const express = require('express');
const router = express.Router();
const path = require('path');
const { signup, login } = require('./src/auth');
const chat = require('./src/chat');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const flash = require('connect-flash');

// Middleware
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(express.static(path.join(__dirname, 'public')));
router.use(cookieParser('secret'));
router.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
}));
router.use(flash());

// Auth Routes
router.get('/login', (req, res) => {
    res.render('login', { message: req.flash('message') });
});

router.get('/signup', (req, res) => {
    res.render('signup', { message: req.flash('message') });
});

router.post('/signup', async (req, res) => {
    const result = await signup(req.body);
    console.log(result);
    req.flash('message', result);
    res.redirect('/signup');
});

router.post('/login', async (req, res) => {
    if (req.body.username == '' || req.body.password == '') {
        req.flash('message', 'wrong info');
        res.redirect('/login');
    } else {
        const result = await login(req.body.username, req.body.password);
        if (result.success) {
            res.sendFile(path.join(__dirname, 'public', 'home.html')); // Redirect to the home page
        } else {
            req.flash('message', 'wrong info');
            res.redirect('/login');
        }
    }
});

// Chat Route
router.get('/chat', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Export router
module.exports = router;
