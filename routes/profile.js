// routes/profile.js
const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

router.get('/public', async (req, res) => {
    try {
        const publicProfiles = await User.find({ isPublic: true });
        res.json(publicProfiles);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/all', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });
    try {
        const allProfiles = await User.find();
        res.json(allProfiles);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (!user.isPublic && !req.user.isAdmin && req.user._id.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
