const express = require('express');
const router = express.Router();
const Dentist = require('../models/Dentist');

/**
 * @route   GET /dentists
 * @desc    Fetch a list of all available dentists
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const dentists = await Dentist.find();
    res.json(dentists);
  } catch (err) {
    console.error('Error fetching dentists:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;