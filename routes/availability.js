const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Dentist = require('../models/Dentist');

/**
 * @route   GET /availability
 * @desc    Get available time slots for a specific date (and optionally a dentist)
 * @access  Public
 * @param   {string} date - Format YYYY-MM-DD (required)
 * @param   {string} dentistId - Dentist ID (optional)
 */
router.get('/', async (req, res) => {
  try {
    const { date, dentistId } = req.query;

    // Validate date parameter
    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
    }

    // Create a Date object for the requested date
    const requestedDate = new Date(date);
    
    // Check if the date is valid
    if (isNaN(requestedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date' });
    }

    // Define available time slots (9 AM to 5 PM, 30-minute intervals)
    const allTimeSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00'
    ];

    // Find booked appointments for the requested date
    let query = {
      date: {
        $gte: new Date(requestedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(requestedDate.setHours(23, 59, 59, 999))
      }
    };

    // If dentistId is provided, filter by dentist
    if (dentistId) {
      // Check if dentist exists
      const dentist = await Dentist.findOne({ _id: dentistId.replace('dentist_', '') });
      if (!dentist) {
        return res.status(404).json({ message: 'Dentist not found' });
      }
      query.dentist_id = dentist._id;
    }

    // Find booked appointments
    const bookedAppointments = await Appointment.find(query);
    
    // Get booked time slots
    const bookedTimeSlots = bookedAppointments.map(appointment => appointment.time);
    
    // Filter out booked time slots
    const availableSlots = allTimeSlots.filter(slot => !bookedTimeSlots.includes(slot));

    // Prepare response
    const response = {
      date,
      availableSlots
    };

    // Add dentistId to response if provided
    if (dentistId) {
      response.dentistId = dentistId;
    }

    res.json(response);
  } catch (err) {
    console.error('Error fetching availability:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;