const Technician = require('../models/Technician');
const createCrudController = require('./crudController');

module.exports = createCrudController(Technician, {
  autoSetUser: false,
  populate: ['user'],
  filterFields: ['status', 'specialization'],
  searchableFields: ['certifications', 'phone']
});