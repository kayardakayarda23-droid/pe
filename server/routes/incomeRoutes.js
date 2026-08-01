const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const incomeController = require('../controllers/incomeController');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(authenticate);

const incomeValidation = [
  body('source').trim().notEmpty().withMessage('Source is required'),
  body('amount').notEmpty().withMessage('Amount is required').isFloat({ gt: 0 }).withMessage('Amount must be positive'),
  body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Date must be a valid date'),
];

router.get('/', incomeController.getIncomes);
router.post('/', incomeValidation, validate, incomeController.createIncome);
router.put('/:id', incomeValidation.map((v) => v.optional()), validate, incomeController.updateIncome);
router.delete('/:id', incomeController.deleteIncome);

module.exports = router;
