const Project = require('../models/project');
const createCrudController = require('./crudController');

module.exports = createCrudController(Project, {
  populate: ['customer', 'installation'],
  filterFields: ['customer', 'installation', 'isPublished'],
  searchableFields: ['summary']
});
