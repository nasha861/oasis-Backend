const controller = require('../controllers/customerController');
const createCrudRoutes = require('./crudRoutes');
const { modelValidators } = require('../middleware/validators');

module.exports = createCrudRoutes(controller, {
  writeRoles: ['admin', 'customer'],
  validators: modelValidators.customer
});
