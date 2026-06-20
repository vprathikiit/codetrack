const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Room = require('../models/Room');
const User = require('../models/User');

const generateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

router.post('/create', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user.userId).select('-password');

    const code = generateCode();

    const room = new Room({
      name,
      code,
      createdBy: req.user.userId,
      members: [{
        userId: req.user.userId,
        email: user.email,
        lcUsername: user.lcUsername,
        cfUsername: user.cfUsername
      }]
    });

    await room.save();
    res.status(201).json(room);

  } catch (err) {
    console.error('Create room error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/join', auth, async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user.userId).select('-password');

    const room = await Room.findOne({ code: code.toUpperCase() });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const alreadyMember = room.members.find(
      m => m.userId.toString() === req.user.userId
    );
    if (alreadyMember) {
      return res.status(400).json({ message: 'Already in this room' });
    }

    room.members.push({
      userId: req.user.userId,
      email: user.email,
      lcUsername: user.lcUsername,
      cfUsername: user.cfUsername
    });

    await room.save();
    res.json(room);

  } catch (err) {
    console.error('Join room error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my', auth, async (req, res) => {
  try {
    const rooms = await Room.find({
      'members.userId': req.user.userId
    });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:code', auth, async (req, res) => {
  try {
    const room = await Room.findOne({
      code: req.params.code.toUpperCase()
    });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;