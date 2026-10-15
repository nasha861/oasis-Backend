const express = require('express');

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  createTechnicianAccount,
  createAdminAccount
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { authValidators } = require('../middleware/validators');

const router = express.Router();

// Public authentication
router.post(
  '/register',
  authValidators.register,
  validateRequest,
  registerUser
);

router.post(
  '/login',
  authValidators.login,
  validateRequest,
  loginUser
);

// Authenticated user's profile
router
  .route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

// Admin-only account creation
router.post(
  '/create-technician',
  protect,
  authorize('admin'),
  createTechnicianAccount
);

router.post(
  '/create-admin',
  protect,
  authorize('admin'),
  createAdminAccount
);

module.exports = router;
