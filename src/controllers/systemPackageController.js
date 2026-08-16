const SystemPackage = require('../models/SystemPackage');
const createCrudController = require('./crudController');

module.exports = createCrudController(SystemPackage, {
  populate: ['products.product'],
  filterFields: ['isActive'],
  searchableFields: ['packageName', 'description']
});
