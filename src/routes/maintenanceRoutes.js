const controller = require('../controllers/maintenanceController');
const createCrudRoutes = require('./crudRoutes');
const { modelValidators } = require('../middleware/validators');

module.exports = createCrudRoutes(controller, {
  writeRoles: ['admin', 'technician'],
  validators: modelValidators.maintenance
});
