const Blog = require('../models/Blog');
const createCrudController = require('./crudController');

module.exports = createCrudController(Blog, {
  populate: ['author'],
  filterFields: ['status', 'author'],
  searchableFields: ['title', 'slug', 'content']
});
