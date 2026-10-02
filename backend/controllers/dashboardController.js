const dashboardService = require('../services/dashboardService');

const getAODashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getAODashboard();
    res.json({ success: true, ...data });
  } catch (err) { next(err); }
};

const getANODashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getANODashboard(req.user.id);
    res.json({ success: true, ...data });
  } catch (err) { next(err); }
};

module.exports = { getAODashboard, getANODashboard };
