const controller = require('../controllers/serviceController');
const createCrudRoutes = require('./crudRoutes');

module.exports = createCrudRoutes(controller, {
  readRoles: ['admin'],
  writeRoles: ['admin'],
  createRoles: ['admin'],
  updateRoles: ['admin'],
  deleteRoles: ['admin']
});