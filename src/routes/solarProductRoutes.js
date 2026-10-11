
const controller = require('../controllers/solarProductController');
const createCrudRoutes = require('./crudRoutes');
const { modelValidators } = require('../middleware/validators');

module.exports = createCrudRoutes(controller, {
  // Product listings and individual product details remain public.
  readRoles: null,

  // Only administrators can create, edit, or delete products.
  createRoles: ['admin'],
  updateRoles: ['admin'],
  deleteRoles: ['admin'],

  validators: modelValidators.solarProduct
});