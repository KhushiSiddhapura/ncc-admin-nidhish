const lectureService = require('../services/lectureService');

const submitLecture = async (req, res, next) => {
  try {
    const lecture = await lectureService.submitLecture(req.body, req.user.id);
    res.status(201).json({ success: true, lecture });
  } catch (err) { next(err); }
};

const getLecturesByAssignment = async (req, res, next) => {
  try {
    const lectures = await lectureService.getLecturesByAssignment(req.params.assignmentId);
    res.json({ success: true, lectures });
  } catch (err) { next(err); }
};

const getAllLectures = async (req, res, next) => {
  try {
    const lectures = await lectureService.getAllLectures();
    res.json({ success: true, lectures });
  } catch (err) { next(err); }
};

const getMyLectures = async (req, res, next) => {
  try {
    const lectures = await lectureService.getMyLectures(req.user.id);
    res.json({ success: true, lectures });
  } catch (err) { next(err); }
};

const deleteLecture = async (req, res, next) => {
  try {
    await lectureService.deleteLecture(req.params.id, req.user.id, req.user.role);
    res.json({ success: true, message: 'Lecture deleted' });
  } catch (err) { next(err); }
};

module.exports = { submitLecture, getLecturesByAssignment, getAllLectures, getMyLectures, deleteLecture };
