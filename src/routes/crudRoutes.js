const express = require('express');

const roleMiddleware = require('../middleware/roleMiddleware');


const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { mongoId } = require('../middleware/validators');

const createCrudRoutes = (controller, options = {}) => {

  const router = express.Router();

  // Default roles
  const writeRoles = options.writeRoles || ['admin', 'customer', 'technician'];

  const readRoles = options.readRoles || null;

  // Allow separate roles for different write operations
  const createRoles = options.createRoles || writeRoles;
  const updateRoles = options.updateRoles || writeRoles;
  const deleteRoles = options.deleteRoles || writeRoles;

  const validators = options.validators || [];

  // GET ALL
  router
    .route('/')
    .get(
  ...(readRoles ? [protect, authorize(...readRoles)] : []),
  controller.getAll
)

    // CREATE
    .post(
      protect,
      authorize(...createRoles),
      validators,
      validateRequest,
      controller.create
    );

  // GET ONE / UPDATE / DELETE
  router
    .route('/:id')
    .get(
      ...(readRoles ? [protect, authorize(...readRoles)] : []),
      mongoId(),
      validateRequest,
      controller.getById
    )

    // UPDATE
    .put(
      protect,
      authorize(...updateRoles),
      mongoId(),
      validators,
      validateRequest,
      controller.update
    )

    // DELETE
    .delete(
      protect,
      authorize(...deleteRoles),
      mongoId(),
      validateRequest,
      controller.remove
    );

  return router;
};

module.exports = createCrudRoutes;