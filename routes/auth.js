// routes/auth.js
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { email, password, name, bio, phone, photo, isPublic } = req.body;
        const newUser = new User({ email, password, name, bio, phone, photo, isPublic });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/login', async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) return res.status(400).json({ message: info ? info.message : 'Login failed' });
        const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    })(req, res, next);
});

// Profile Routes
router.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
    res.json(req.user);
});

router.put('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
