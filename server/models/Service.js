const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
  },
  level: {
    type: String,
    required: [true, 'Level is required'],
    enum: ['Elementary', 'Middle School', 'High School', 'College', 'Adult / Professional'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: 30,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  tutorName: {
    type: String,
    required: [true, 'Tutor name is required'],
    trim: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
