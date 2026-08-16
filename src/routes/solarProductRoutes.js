const controller = require('../controllers/solarProductController');
const createCrudRoutes = require('./crudRoutes');
const { modelValidators } = require('../middleware/validators');

module.exports = createCrudRoutes(controller, {
  validators: modelValidators.solarProduct
});
