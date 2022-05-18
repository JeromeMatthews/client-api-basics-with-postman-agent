const express = require('express');
const cityController = require('./../controllers/cityContoller');
const router = express.Router();
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');
//----------------------------------------------------------------
/* express.json() allows the server to handle incoming JSON based requests. 
Since the default is to expect text in the request body, this allows us to send the JSON
data without specifying a request header. 
*/
router.use(express.json());

/*Authentication notes: the implementation of knowning if a user is logged in or not is handled by the JWT- JSON WEB TOKEN, each user will get issued a JWT token and each time they want to access the the API the token will be check (verified) which will let the server know if the user is authenticated and allowed to access the API. 

The middleware assigned to handle authentication is the authController.protect middleware.*/

//=============================================================================

/* Authorization notes: In this application, the data stored for the cities can be used by anyone, as long as they are logged in. However to be able to make any changes to the data stored is only allowed by the city-guides and the app administrator. 

The middleware assigned to handle the authorization of users is the authController.restrictTo middleware.*/

router
  .route('/:cityId/reviews')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

router
  .route('/')
  .get(authController.protect, cityController.getAllCities)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'city-guide'),
    cityController.addNewCity
  );
router
  .route('/:id')
  .get(authController.protect, cityController.getCity)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'city-guide'),
    cityController.updateCity
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'city-guide'),
    cityController.deleteCity
  );
module.exports = router;
