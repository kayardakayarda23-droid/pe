const express = require('express');
const router = express.Router();

const analyticsController = require('../controllers/analyticsController');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.get('/income-vs-expense', analyticsController.incomeVsExpense);
router.get('/:period', analyticsController.getAnalysis); // daily|weekly|monthly|quarterly|yearly

module.exports = router;
