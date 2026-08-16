const express = require('express');
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { authValidators } = require('../middleware/validators');


const router = express.Router();

router.post('/register', authValidators.register, validateRequest, registerUser);
router.post('/login', authValidators.login, validateRequest, loginUser);
router.route('/profile').get(protect, getProfile).put(protect, updateProfile);

module.exports = router;