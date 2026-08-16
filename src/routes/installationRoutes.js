const controller = require('../controllers/installationController');
const createCrudRoutes = require('./crudRoutes');
const { modelValidators } = require('../middleware/validators');

module.exports = createCrudRoutes(controller, {
  writeRoles: ['admin', 'technician'],
  validators: modelValidators.installation
});
