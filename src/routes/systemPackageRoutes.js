const controller = require('../controllers/systemPackageController');
const createCrudRoutes = require('./crudRoutes');
const { modelValidators } = require('../middleware/validators');

module.exports = createCrudRoutes(controller, {
  validators: modelValidators.systemPackage
});
