
const express = require('express');
const cityController = require('./../controllers/cityContoller');
const router = express.Router();

//----------------------------------------------------------------
/* express.json() allows the server to handle incoming JSON based requests. 
Since the default is to expect text in the request body, this allows us to send the JSON
data without specifying a request header. 
*/
router.use(express.json());


router
  .route('/')
  .get(cityController.getAllCities)
  .post(cityController.addNewCity);
router
  .route('/:id')
  .get(cityController.getCity)
  .patch(cityController.updateCity)
  .delete(cityController.deleteCity);
module.exports = router;
