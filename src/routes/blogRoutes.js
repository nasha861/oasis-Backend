const controller = require('../controllers/blogController');
const createCrudRoutes = require('./crudRoutes');
const { modelValidators } = require('../middleware/validators');

module.exports = createCrudRoutes(controller, {
  writeRoles: ['admin'],
  validators: modelValidators.blog
});
