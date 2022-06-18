const express = require('express');
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getCityCollection);
router.get('/cities/:slug', authController.isLoggedIn, viewController.getCity);
router.get('/login', viewController.login);
router.get('/logout', authController.logout);

router.get('/me', authController.protect, viewController.account);

router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);
module.exports = router;
