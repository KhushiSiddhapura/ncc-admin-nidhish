const mongoose = require('mongoose');

const lectureSubmissionSchema = new mongoose.Schema({
  assignmentId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  title:           { type: String, required: true, trim: true },
  description:     { type: String, required: true, trim: true },
  duration:        { type: Number, required: true, min: 1 },
  cadetsAttended:  { type: Number, required: true, min: 0 },
  conductedOn:     { type: Date, required: true },
  submittedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('LectureSubmission', lectureSubmissionSchema);
