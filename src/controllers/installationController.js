const Installation = require('../models/Installation');
const createCrudController = require('./crudController');

module.exports = createCrudController(Installation, {
  populate: ['customer', 'systemPackage', 'technicians'],
  filterFields: ['customer', 'systemPackage', 'status'],
  searchableFields: ['siteAddress', 'notes']
});
