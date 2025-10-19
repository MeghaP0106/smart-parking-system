const express = require('express');
const router = express.Router();
const ParkingSlot = require('../models/ParkingSlot');
const { protect } = require('../middleware/auth');

// @route   GET /api/parking/slots/:locationId
// @desc    Get all parking slots for a location
// @access  Private
router.get('/slots/:locationId', protect, async (req, res) => {
  try {
    const slots = await ParkingSlot.find({
      location: req.params.locationId,
    }).sort({ slotNumber: 1 });

    res.json(slots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/parking/slots/:locationId/available
// @desc    Get available parking slots for a location
// @access  Private
router.get('/slots/:locationId/available', protect, async (req, res) => {
  try {
    const slots = await ParkingSlot.find({
      location: req.params.locationId,
      status: 'available',
    }).sort({ slotNumber: 1 });

    res.json(slots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;