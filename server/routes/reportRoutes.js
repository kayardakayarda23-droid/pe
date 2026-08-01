const express = require('express');
const router = express.Router();

const reportController = require('../controllers/reportController');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.get('/history', reportController.getHistory);
router.get('/monthly', reportController.monthlyReport);
router.get('/yearly', reportController.yearlyReport);
router.get('/category', reportController.categoryReport);
// Generic: /api/reports/daily|weekly|monthly|quarterly|yearly|budget|income|expense?format=pdf|excel|csv
router.get('/:type', reportController.generateReport);

module.exports = router;
