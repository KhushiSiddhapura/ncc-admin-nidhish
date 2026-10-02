const LectureSubmission = require('../models/LectureSubmission');
const Assignment = require('../models/Assignment');

const submitLecture = async (data, userId) => {
  const assignment = await Assignment.findById(data.assignmentId);
  if (!assignment) throw { status: 404, message: 'Assignment not found' };

  if (String(assignment.anoId) !== String(userId))
    throw { status: 403, message: 'You can only submit for your own assignments' };

  const completed = await LectureSubmission.countDocuments({ assignmentId: data.assignmentId });
  if (completed >= assignment.assignedLectures)
    throw { status: 400, message: 'All assigned lectures already submitted' };

  return LectureSubmission.create({ ...data, submittedBy: userId });
};

const getLecturesByAssignment = async (assignmentId) =>
  LectureSubmission.find({ assignmentId })
    .populate('submittedBy', 'name email college')
    .sort({ createdAt: -1 });

const getAllLectures = async () =>
  LectureSubmission.find()
    .populate('submittedBy', 'name email college')
    .populate({ path: 'assignmentId', populate: { path: 'anoId', select: 'name college' } })
    .sort({ createdAt: -1 });

const getMyLectures = async (userId) =>
  LectureSubmission.find({ submittedBy: userId })
    .populate('assignmentId')
    .sort({ createdAt: -1 });

const deleteLecture = async (id, userId, role) => {
  const lecture = await LectureSubmission.findById(id);
  if (!lecture) throw { status: 404, message: 'Lecture not found' };
  if (role !== 'AO' && String(lecture.submittedBy) !== String(userId))
    throw { status: 403, message: 'Not authorized' };
  await lecture.deleteOne();
};

module.exports = { submitLecture, getLecturesByAssignment, getAllLectures, getMyLectures, deleteLecture };
