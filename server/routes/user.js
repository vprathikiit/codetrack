const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/me', auth, async(req, res) => {
    try {
        const user = await User.findOne(req.user.userId).select('-password');
        if(!user) {
            return res.status(404).json({message: 'User not found'});
        }
        res.json(user);
    }
    catch(err) {
        res.status(500),json({message: 'Server error'});
    }
});

router.put('/username', auth, async(req, res) => {
    try {
        const {lcUsername, cfUsername} = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            {lcUsername, cfUsername},
            {new: true}
        ).select('-password');
        res.json(user);
    }
    catch(err) {
        res.status(500).json({message: 'Server error'});
    }
});

router.put('/goals', auth, async (req, res) => {
  try {
    const { dailyGoal, weeklyGoal } = req.body;

    if (dailyGoal < 1 || weeklyGoal < 1) {
      return res.status(400).json({ message: 'Goals must be at least 1' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { dailyGoal, weeklyGoal },
      { new: true }
    ).select('-password');

    res.json(user);
  } 
  catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;