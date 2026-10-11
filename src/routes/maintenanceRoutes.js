const express = require('express');

const controller = require('../controllers/maintenanceController');

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


/* ==========================================
   CUSTOMER
========================================== */

router.get(
  '/my-requests',
  protect,
  authorize('customer'),
  controller.getMyMaintenance
);


/* ==========================================
   ADMIN MANAGEMENT
========================================== */

router.put(
  '/:id/manage',
  protect,
  authorize('admin'),
  controller.updateMaintenanceManagement
);


/* ==========================================
   GENERIC CRUD
========================================== */

const crudRouter = createCrudRoutes(
  controller,
  {
    createRoles: ['admin', 'customer'],

    updateRoles: [
      'admin',
      'technician'
    ],

    deleteRoles: ['admin'],

    validators:
      modelValidators.maintenance
  }
);

router.use(crudRouter);


/* ==========================================
   EXISTING SPECIAL ROUTES
========================================== */

router.put(
  '/:id/assign-technician',
  protect,
  authorize('admin'),
  controller.assignTechnician
);

router.put(
  '/:id/technician-status',
  protect,
  authorize('technician'),
  controller.updateTechnicianStatus
);

module.exports = router;