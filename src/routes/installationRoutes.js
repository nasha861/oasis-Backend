const express = require('express');

const controller = require('../controllers/installationController');
const createCrudRoutes = require('./crudRoutes');

const {
  protect
} = require('../middleware/authMiddleware');

const {
  authorize
} = require('../middleware/roleMiddleware');

const {
  modelValidators
} = require('../middleware/validators');

const router = express.Router();

/*
  Admin installation management:
  - Assign technician
  - Change status
  - Schedule installation
  - Update note
*/
router.put(
  '/:id/manage',
  protect,
  authorize('admin'),
  controller.updateInstallationManagement
);

const crudRouter = createCrudRoutes(controller, {
  createRoles: ['admin', 'customer'],
  updateRoles: ['admin', 'technician'],
  deleteRoles: ['admin'],
  validators: modelValidators.installation
});

router.use(crudRouter);

module.exports = router;