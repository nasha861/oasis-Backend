const express = require('express');
const roleMiddleware = require('../middleware/roleMiddleware');
console.log('ROLE MIDDLEWARE:', roleMiddleware);
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { mongoId } = require('../middleware/validators');

const createCrudRoutes = (controller, options = {}) => {
  const router = express.Router();
  const writeRoles = options.writeRoles || ['admin', 'customer', 'technician'];
  const validators = options.validators || [];

  router
    .route('/')
    .get(controller.getAll)
    .post(protect, authorize(...writeRoles), validators, validateRequest, controller.create);

  router
    .route('/:id')
    .get(mongoId(), validateRequest, controller.getById)
    .put(protect, authorize(...writeRoles), mongoId(), validators, validateRequest, controller.update)
    .delete(protect, authorize(...writeRoles), mongoId(), validateRequest, controller.remove);

  return router;
};


module.exports = createCrudRoutes;
