const assignmentService = require('../services/assignmentService');

const createAssignment = async (req, res, next) => {
  try {
    const assignment = await assignmentService.createAssignment(req.body);
    res.status(201).json({ success: true, assignment });
  } catch (err) { next(err); }
};

const getAllAssignments = async (req, res, next) => {
  try {
    const assignments = await assignmentService.getAllAssignments();
    res.json({ success: true, assignments });
  } catch (err) { next(err); }
};

const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await assignmentService.getAssignmentById(req.params.id);
    res.json({ success: true, assignment });
  } catch (err) { next(err); }
};

const updateAssignment = async (req, res, next) => {
  try {
    const assignment = await assignmentService.updateAssignment(req.params.id, req.body);
    res.json({ success: true, assignment });
  } catch (err) { next(err); }
};

const deleteAssignment = async (req, res, next) => {
  try {
    await assignmentService.deleteAssignment(req.params.id);
    res.json({ success: true, message: 'Assignment deleted' });
  } catch (err) { next(err); }
};

const getANOProgress = async (req, res, next) => {
  try {
    const data = await assignmentService.getANOProgress(req.params.anoId);
    res.json({ success: true, ...data });
  } catch (err) { next(err); }
};

const getAllANOs = async (req, res, next) => {
  try {
    const anos = await assignmentService.getAllANOs();
    res.json({ success: true, anos });
  } catch (err) { next(err); }
};

module.exports = { createAssignment, getAllAssignments, getAssignmentById, updateAssignment, deleteAssignment, getANOProgress, getAllANOs };
