const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');

router.get('/', viewController.getCityCollection);
router.get('/cities/:slug', viewController.getCity);
module.exports = router;
