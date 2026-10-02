const { body } = require('express-validator');

const assignmentValidator = [
  body('anoId').isMongoId().withMessage('Valid ANO ID is required'),
  body('assignedLectures').isInt({ min: 1 }).withMessage('Assigned lectures must be at least 1'),
  body('deadline').isISO8601().withMessage('Valid deadline date is required'),
  body('remarks').optional().isString(),
];

module.exports = { assignmentValidator };
