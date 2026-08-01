const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const budgetController = require('../controllers/budgetController');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(authenticate);

const budgetValidation = [
  body('amount').notEmpty().withMessage('Amount is required').isFloat({ gt: 0 }).withMessage('Amount must be positive'),
  body('period').optional().isIn(['DAILY', 'WEEKLY', 'MONTHLY']),
  body('startDate').notEmpty().withMessage('Start date is required').isISO8601(),
  body('endDate').notEmpty().withMessage('End date is required').isISO8601(),
];

router.get('/', budgetController.getBudgets);
router.post('/', budgetValidation, validate, budgetController.createBudget);
router.put('/:id', budgetValidation.map((v) => v.optional()), validate, budgetController.updateBudget);
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;
