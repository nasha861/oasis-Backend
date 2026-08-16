const { body, param } = require('express-validator');

const mongoId = (field = 'id') => param(field).isMongoId().withMessage(`${field} must be a valid MongoDB id`);

const authValidators = {
  register: [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['admin', 'customer', 'technician']).withMessage('Invalid role')
  ],
  login: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ]
};

const modelValidators = {
  customer: [
    body('user').optional().isMongoId().withMessage('User must be a valid id'),
    body('accountStatus').optional().isIn(['active', 'inactive', 'suspended']).withMessage('Invalid account status')
  ],
  technician: [
    body('user').optional().isMongoId().withMessage('User must be a valid id'),
    body('currentLocation.lat').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitude is invalid'),
    body('currentLocation.lng').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitude is invalid')
  ],
  installation: [
    body('customer').optional().isMongoId().withMessage('Customer must be a valid id'),
    body('systemPackage').optional().isMongoId().withMessage('System package must be a valid id'),
    body('technicians').optional().isArray().withMessage('Technicians must be an array'),
    body('status').optional().isIn(['survey', 'permitting', 'installing', 'active']).withMessage('Invalid installation status')
  ],
  maintenance: [
    body('installation').optional().isMongoId().withMessage('Installation must be a valid id'),
    body('technician').optional().isMongoId().withMessage('Technician must be a valid id'),
    body('type').optional().isIn(['routine', 'repair', 'emergency']).withMessage('Invalid maintenance type')
  ],
  solarProduct: [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('category').optional().isIn(['panel', 'inverter', 'battery', 'racking']).withMessage('Invalid category'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price cannot be negative')
  ],
  systemPackage: [
    body('packageName').optional().trim().notEmpty().withMessage('Package name cannot be empty'),
    body('basePrice').optional().isFloat({ min: 0 }).withMessage('Base price cannot be negative'),
    body('estimatedOutput').optional().isFloat({ min: 0 }).withMessage('Estimated output cannot be negative')
  ],
  blog: [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('slug').optional().trim().notEmpty().withMessage('Slug cannot be empty'),
    body('status').optional().isIn(['draft', 'published']).withMessage('Invalid blog status')
  ],
  project: [
    body('customer').optional().isMongoId().withMessage('Customer must be a valid id'),
    body('installation').optional().isMongoId().withMessage('Installation must be a valid id'),
    body('energySavings').optional().isFloat({ min: 0 }).withMessage('Energy savings cannot be negative')
  ]
};

module.exports = { authValidators, modelValidators, mongoId };
