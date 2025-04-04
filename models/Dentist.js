const mongoose = require('mongoose');

const dentistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialty: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Virtual for creating a custom id format
dentistSchema.virtual('customId').get(function() {
  return `dentist_${this._id}`;
});

// Include virtuals when converting to JSON
dentistSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret.customId;
    delete ret._id;
    delete ret.__v;
    delete ret.customId;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  }
});

const Dentist = mongoose.model('Dentist', dentistSchema);

module.exports = Dentist;