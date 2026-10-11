
const controller = require('../controllers/customerController');
const createCrudRoutes = require('./crudRoutes');
const { modelValidators } = require('../middleware/validators');

module.exports = createCrudRoutes(controller, {
  // Only administrators can list or view customer records.
  readRoles: ['admin'],
  // Customer management actions are administrator-only.
  createRoles: ['admin'],
  updateRoles: ['admin'],
  deleteRoles: ['admin'],

  validators: modelValidators.customer
});