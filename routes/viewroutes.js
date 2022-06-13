const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewController');


router.get('/', viewController.getCityCollection);
router.get('/cities/:slug', authController.isLoggedIn, viewController.getCity);
router.get('/login', viewController.login);
module.exports = router;
