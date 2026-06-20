const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/signup', async(req, res) => {
    try {
        const {email, password, lcUsername, cfUsername} = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({message: 'Email already registered'});
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            email, 
            password: hashedPassword,
            lcUsername: lcUsername || '',
            cfUsername: cfUsername || ''
        });

        await user.save();

        const token = jwt.sign(
            {userId: user._id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                lcUsername: user.lcUsername,
                cfUsername: user.cfUsername
            }
        });
    }
    catch(err) {
        console.error('Signup error:', err);
        res.status(500).json({message: 'Server error'});
    }
});

router.post('/login', async(req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: 'Invalid email or password'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({message: 'Invalid email or password'});
        }

        const token = jwt.sign(
            {userId: user._id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                lcUsername: user.lcUsername,
                cfUsername: user.cfUsername
            }
        });
    }
    catch(err) {
        console.error('Login error:', err);
        res.status(500).json({message: 'Server error'});
    }
});

module.exports = router;