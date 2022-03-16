const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const City = require('./model/cityModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {}).then(() => {
  console.log(' DB connection established');
});

//READ JSON FILE WITH CITY DATA
//Can use sync as the funciton here as it will be the first thing to be executed in the process cycle, so doesn't have an effect either way if the asynchronous verison of the function is used or not.

//NOTE: Remember the JSON data needs to be converted into javascript objects so that they can be stored in the database. Mongo will automatically convert the javascript objects to BSON objects for storage.
const cityData = JSON.parse(
  fs.readFileSync(`${__dirname}/data/citydata.json`, 'utf8')
);

//ADD FILE DATA TO THE DATABASE AUTOMATICALLY
const importData = async () => {
  try {
    await City.create(cityData);
    console.log('city data loaded into db successfully.');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//DELETE ALL FILE DATA FROM THE DATABASE AUTOMATICALLY

const deleteData = async () => {
  try {
    await City.deleteMany();
    console.log('Collection: City, deleted successfully.');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//EXECUTES THE SCRIPT IN THE COMMAND LINE

if (process.argv[2] === '--importData') {
  importData();
} else if (process.argv[2] === '--deleteData') {
  deleteData();
}
