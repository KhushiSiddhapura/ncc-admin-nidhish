const Assignment = require('../models/Assignment');
const LectureSubmission = require('../models/LectureSubmission');
const User = require('../models/User');

const createAssignment = async (data) => {
  const ano = await User.findById(data.anoId);
  if (!ano || ano.role !== 'ANO') throw { status: 404, message: 'ANO not found' };
  return Assignment.create(data);
};

const getAllAssignments = async () =>
  Assignment.find().populate('anoId', 'name email college').sort({ createdAt: -1 });

const getAssignmentById = async (id) => {
  const a = await Assignment.findById(id).populate('anoId', 'name email college');
  if (!a) throw { status: 404, message: 'Assignment not found' };
  return a;
};

const updateAssignment = async (id, data) => {
  const a = await Assignment.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!a) throw { status: 404, message: 'Assignment not found' };
  return a;
};

const deleteAssignment = async (id) => {
  const a = await Assignment.findByIdAndDelete(id);
  if (!a) throw { status: 404, message: 'Assignment not found' };
};

const getANOProgress = async (anoId) => {
  const ano = await User.findById(anoId).select('-password');
  if (!ano || ano.role !== 'ANO') throw { status: 404, message: 'ANO not found' };

  const assignments = await Assignment.find({ anoId });
  const assignmentIds = assignments.map((a) => a._id);

  const totalAssigned = assignments.reduce((sum, a) => sum + a.assignedLectures, 0);
  const completed = await LectureSubmission.countDocuments({ assignmentId: { $in: assignmentIds } });
  const pending = Math.max(0, totalAssigned - completed);

  const enriched = await Promise.all(
    assignments.map(async (a) => {
      const c = await LectureSubmission.countDocuments({ assignmentId: a._id });
      return { ...a.toObject(), completed: c, pending: Math.max(0, a.assignedLectures - c) };
    })
  );

  return { ano, totalAssigned, completed, pending, assignments: enriched };
};

const getAllANOs = async () => User.find({ role: 'ANO' }).select('-password');

module.exports = {
  createAssignment, getAllAssignments, getAssignmentById,
  updateAssignment, deleteAssignment, getANOProgress, getAllANOs,
};
