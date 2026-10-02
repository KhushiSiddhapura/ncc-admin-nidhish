const express = require('express');
const router = express.Router();
const { getAODashboard, getANODashboard } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/ao', protect, authorize('AO'), getAODashboard);
router.get('/ano', protect, authorize('ANO'), getANODashboard);

module.exports = router;
