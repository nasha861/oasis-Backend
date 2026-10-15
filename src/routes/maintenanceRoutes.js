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
    // Only administrators can list or view all maintenance records.
    readRoles: ['admin'],

    // Customers can submit requests; admins can also create them.
    createRoles: ['admin', 'customer'],

    // Admins manage records; technicians use the assignment-checked endpoint.
    updateRoles: ['admin'],
    // Only administrators can delete records.
    deleteRoles: ['admin'],
    validators: modelValidators.maintenance
  }
);
router.get(
    '/my-assigned',
    protect,
    authorize('technician'),
    controller.getMyAssignedMaintenance
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