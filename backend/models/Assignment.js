const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  anoId:             { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedLectures:  { type: Number, required: true, min: 1 },
  deadline:          { type: Date, required: true },
  remarks:           { type: String, trim: true, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
