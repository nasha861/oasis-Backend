const Customer = require('../models/Customer');
const createCrudController = require('./crudController');

module.exports = createCrudController(Customer, {

  autoSetUser: false,
  populate: ['user'],
  filterFields: ['accountStatus'],
  searchableFields: ['phoneNumber']
});
