const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router
  .route('/')
  .get(authController.protect, userController.getAllUsers)
  .post(userController.postNewUser);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);


router.use(authController.protect);
//Pu the Protect middleware ahead of all other middlewares. 
//Takes te authorization our of the middlewares and makes it broader in scope. With in the larer context of the route. With
//ALL ROUTES FOLLOWING CAN ONLY BE ACCESSED BY AUTHORIZED USERS  


router.patch(
  '/updateMyPassword',
  authController.updatePassword
);

//Route a User of the API can use to access their account informaiton.
router.get(
  '/me',
  userController.getMe,
  userController.getUser
);

router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe',userController.deleteMe);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
