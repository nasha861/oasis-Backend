const Project = require('../models/Project');
const createCrudController = require('./crudController');

module.exports = createCrudController(Project, {
  populate: ['customer', 'installation'],
  filterFields: ['customer', 'installation', 'isPublished'],
  searchableFields: ['summary']
});
