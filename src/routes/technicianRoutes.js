const controller = require('../controllers/technicianController');
const createCrudRoutes = require('./crudRoutes');
const { modelValidators } = require('../middleware/validators');

module.exports = createCrudRoutes(controller, {
  readRoles: ['admin'],
  writeRoles: ['admin'],
  validators: modelValidators.technician
});