const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a location name'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide an address'],
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    totalSlots: {
      type: Number,
      required: true,
      default: 0,
    },
    availableSlots: {
      type: Number,
      required: true,
      default: 0,
    },
    floors: {
      type: Number,
      default: 1,
    },
    operatingHours: {
      open: {
        type: String,
        default: '00:00',
      },
      close: {
        type: String,
        default: '23:59',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

locationSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Location', locationSchema);