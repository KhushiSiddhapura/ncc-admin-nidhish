const express = require('express');
const router = express.Router();
const c = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { assignmentValidator } = require('../validators/assignmentValidator');
const { validate } = require('../middleware/validateMiddleware');

router.use(protect);

router.get('/anos', authorize('AO'), c.getAllANOs);
router.get('/ano-progress/:anoId', authorize('AO'), c.getANOProgress);
router.post('/', authorize('AO'), assignmentValidator, validate, c.createAssignment);
router.get('/', c.getAllAssignments);
router.get('/:id', c.getAssignmentById);
router.put('/:id', authorize('AO'), c.updateAssignment);
router.delete('/:id', authorize('AO'), c.deleteAssignment);

module.exports = router;
