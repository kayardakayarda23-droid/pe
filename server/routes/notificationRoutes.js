const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const notificationController = require('../controllers/notificationController');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(authenticate);

router.get('/', notificationController.getNotifications);
router.post(
  '/register-device',
  [body('deviceToken').notEmpty().withMessage('deviceToken is required')],
  validate,
  notificationController.registerDevice
);
router.put('/read-all', notificationController.markAllAsRead);
router.put('/:id/read', notificationController.markAsRead);
router.put('/preferences', notificationController.updatePreferences);

module.exports = router;
