const mongoose = require('mongoose');

// Task Schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['user-story', 'engineering-task', 'risk', 'unknown'],
    default: 'engineering-task'
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  estimatedHours: {
    type: Number,
    min: 0
  },
  order: {
    type: Number,
    default: 0
  }
});

// Specification Schema
const specificationSchema = new mongoose.Schema({
  featureName: {
    type: String,
    required: true,
    trim: true
  },
  goal: {
    type: String,
    required: true
  },
  targetUsers: {
    type: String,
    required: true
  },
  constraints: {
    type: String,
    default: ''
  },
  template: {
    type: String,
    enum: ['mobile', 'web', 'internal-tool', 'custom'],
    default: 'custom'
  },
  userStories: [taskSchema],
  engineeringTasks: [taskSchema],
  risks: [{
    description: String,
    severity: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    }
  }],
  unknowns: [{
    description: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster retrieval of recent specs
specificationSchema.index({ createdAt: -1 });

const Specification = mongoose.model('Specification', specificationSchema);

module.exports = { Specification };