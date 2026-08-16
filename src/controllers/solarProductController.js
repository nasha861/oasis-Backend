const SolarProduct = require('../models/SolarProduct');
const createCrudController = require('./crudController');

module.exports = createCrudController(SolarProduct, {
  filterFields: ['category', 'manufacturer', 'isActive'],
  searchableFields: ['name', 'modelName', 'manufacturer']
});
