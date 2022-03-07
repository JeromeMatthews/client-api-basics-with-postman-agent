const app = require('./app');
const server = app;
const mongoose = require('./mongoose');
const dotenv = require('./dotenv');

dotenv.config({
  path: './config.env',
});

mongoose.connect();

const port = 4000;
server.listen(port, () => {
  console.log(`server now listening on port ${port}`);
});
