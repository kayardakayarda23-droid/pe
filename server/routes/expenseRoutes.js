const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const expenseController = require('../controllers/expenseController');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload = require('../config/upload');

router.use(authenticate);

const expenseValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('categoryId').notEmpty().withMessage('Category is required').isInt(),
  body('amount').notEmpty().withMessage('Amount is required').isFloat({ gt: 0 }).withMessage('Amount must be positive'),
  body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Date must be a valid date'),
  body('paymentMethod').optional().isIn(['CASH', 'CARD', 'BANK_TRANSFER', 'UPI', 'WALLET', 'OTHER']),
];

router.get('/', expenseController.getExpenses);
router.get('/:id', expenseController.getExpenseById);
router.post('/', upload.single('receipt'), expenseValidation, validate, expenseController.createExpense);
router.put('/:id', upload.single('receipt'), expenseValidation.map((v) => v.optional()), validate, expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
