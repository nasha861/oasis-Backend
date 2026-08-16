const Technician = require('../models/Technician');
const createCrudController = require('./crudController');

module.exports = createCrudController(Technician, {
  populate: ['user'],
  filterFields: ['availability'],
  searchableFields: ['certifications', 'specialties']
});
