const Maintenance = require('../models/Maintenance');
const createCrudController = require('./crudController');

module.exports = createCrudController(Maintenance, {
  populate: ['installation', 'technician'],
  filterFields: ['installation', 'technician', 'type', 'status'],
  searchableFields: ['completionNotes']
});
