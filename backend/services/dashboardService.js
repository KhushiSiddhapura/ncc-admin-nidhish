const User = require('../models/User');
const Assignment = require('../models/Assignment');
const LectureSubmission = require('../models/LectureSubmission');

const getAODashboard = async () => {
  const totalANOs = await User.countDocuments({ role: 'ANO' });
  const totalAssignments = await Assignment.countDocuments();
  const allAssignments = await Assignment.find();
  const totalAssigned = allAssignments.reduce((s, a) => s + a.assignedLectures, 0);
  const totalCompleted = await LectureSubmission.countDocuments();
  const totalPending = Math.max(0, totalAssigned - totalCompleted);

  const anos = await User.find({ role: 'ANO' }).select('-password');
  const anoProgress = await Promise.all(
    anos.map(async (ano) => {
      const assignments = await Assignment.find({ anoId: ano._id });
      const ids = assignments.map((a) => a._id);
      const assigned = assignments.reduce((s, a) => s + a.assignedLectures, 0);
      const completed = await LectureSubmission.countDocuments({ assignmentId: { $in: ids } });
      const pending = Math.max(0, assigned - completed);
      return { ano, assigned, completed, pending };
    })
  );

  const recentSubmissions = await LectureSubmission.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('submittedBy', 'name college')
    .populate({ path: 'assignmentId', select: 'assignedLectures deadline' });

  return { totalANOs, totalAssignments, totalAssigned, totalCompleted, totalPending, anoProgress, recentSubmissions };
};

const getANODashboard = async (userId) => {
  const assignments = await Assignment.find({ anoId: userId });
  const ids = assignments.map((a) => a._id);
  const totalAssigned = assignments.reduce((s, a) => s + a.assignedLectures, 0);
  const totalCompleted = await LectureSubmission.countDocuments({ assignmentId: { $in: ids } });
  const totalPending = Math.max(0, totalAssigned - totalCompleted);

  const recentSubmissions = await LectureSubmission.find({ submittedBy: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('assignmentId', 'assignedLectures deadline remarks');

  const assignmentsWithProgress = await Promise.all(
    assignments.map(async (a) => {
      const completed = await LectureSubmission.countDocuments({ assignmentId: a._id });
      return { ...a.toObject(), completed, pending: Math.max(0, a.assignedLectures - completed) };
    })
  );

  return { totalAssigned, totalCompleted, totalPending, assignments: assignmentsWithProgress, recentSubmissions };
};

module.exports = { getAODashboard, getANODashboard };
