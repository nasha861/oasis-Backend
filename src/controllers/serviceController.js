const Service = require('../models/Service');
const createCrudController = require('./crudController');

module.exports = createCrudController(Service, {
  autoSetUser: false,
  filterFields: ['category', 'isActive'],
  searchableFields: ['name', 'description', 'category']
});