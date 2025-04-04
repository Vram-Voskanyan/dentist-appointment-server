const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  dentist_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dentist',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true,
    trim: true
  },
  patient_name: {
    type: String,
    required: true,
    trim: true
  },
  patient_email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  patient_phone: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'pending'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});

// Virtual for creating a custom id format
appointmentSchema.virtual('customId').get(function() {
  return `appt_${this._id}`;
});

// Include virtuals when converting to JSON
appointmentSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.appointmentId = ret.customId;
    delete ret._id;
    delete ret.__v;
    delete ret.customId;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;