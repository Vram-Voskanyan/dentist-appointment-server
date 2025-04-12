const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Dentist = require('../models/Dentist');

/**
 * @route   GET /appointments
 * @desc    Fetch all booked appointments for all doctors
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // Find all appointments and populate dentist information
    const appointments = await Appointment.find()
      .populate('dentist_id', 'name specialty');

    // Return appointments
    res.json(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /appointments
 * @desc    Book an appointment with a dentist on a selected date and time
 * @access  Public
 * @body    {
 *            dentistId: string,
 *            date: string (YYYY-MM-DD),
 *            time: string (HH:MM),
 *            patient: {
 *              name: string,
 *              email: string,
 *              phone: string
 *            }
 *          }
 */
router.post('/', async (req, res) => {
  try {
    const { dentistId, date, time, patient } = req.body;

    // Validate required fields
    if (!dentistId || !date || !time || !patient) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate patient information
    if (!patient.name || !patient.email || !patient.phone) {
      return res.status(400).json({ message: 'Patient name, email, and phone are required' });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(time)) {
      return res.status(400).json({ message: 'Invalid time format. Use HH:MM' });
    }

    // Check if dentist exists
    const dentist = await Dentist.findOne({ _id: dentistId.replace('dentist_', '') });
    if (!dentist) {
      return res.status(404).json({ message: 'Dentist not found' });
    }

    // Create a Date object for the requested date
    const appointmentDate = new Date(date);

    // Check if the date is valid
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date' });
    }

    // Check if the time slot is available
    const existingAppointment = await Appointment.findOne({
      dentist_id: dentist._id,
      date: {
        $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
        $lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
      },
      time
    });

    if (existingAppointment) {
      return res.status(409).json({ message: 'This time slot is already booked' });
    }

    // Create new appointment
    const newAppointment = new Appointment({
      dentist_id: dentist._id,
      date: appointmentDate,
      time,
      patient_name: patient.name,
      patient_email: patient.email,
      patient_phone: patient.phone,
      status: 'confirmed'
    });

    // Save appointment to database
    await newAppointment.save();

    // Return appointment details
    res.status(201).json({
      appointmentId: newAppointment.toJSON().appointmentId,
      status: newAppointment.status
    });
  } catch (err) {
    console.error('Error booking appointment:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
