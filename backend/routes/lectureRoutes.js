const express = require('express');
const router = express.Router();
const c = require('../controllers/lectureController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { lectureValidator } = require('../validators/lectureValidator');
const { validate } = require('../middleware/validateMiddleware');

router.use(protect);

router.post('/submit', authorize('ANO'), lectureValidator, validate, c.submitLecture);
router.get('/my', authorize('ANO'), c.getMyLectures);
router.get('/all', authorize('AO'), c.getAllLectures);
router.get('/assignment/:assignmentId', c.getLecturesByAssignment);
router.delete('/:id', c.deleteLecture);

// Legacy route support
router.post('/assign', authorize('AO'), (req, res) => {
  res.status(301).json({ message: 'Use POST /api/assignments instead' });
});

module.exports = router;
