const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, authorize('AO'), async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (err) { next(err); }
});

router.get('/anos', protect, authorize('AO'), async (req, res, next) => {
  try {
    const anos = await User.find({ role: 'ANO' }).select('-password');
    res.json({ success: true, anos });
  } catch (err) { next(err); }
});

module.exports = router;
