const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const categoryController = require('../controllers/categoryController');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(authenticate);

router.get('/', categoryController.getCategories);
router.post(
  '/',
  [body('name').trim().notEmpty().withMessage('Name is required')],
  validate,
  categoryController.createCategory
);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
