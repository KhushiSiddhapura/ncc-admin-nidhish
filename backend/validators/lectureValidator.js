const { body } = require('express-validator');

const lectureValidator = [
  body('assignmentId').isMongoId().withMessage('Valid assignment ID is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 minute'),
  body('cadetsAttended').isInt({ min: 0 }).withMessage('Cadets attended must be 0 or more'),
  body('conductedOn').isISO8601().withMessage('Valid conducted date is required'),
];

module.exports = { lectureValidator };
