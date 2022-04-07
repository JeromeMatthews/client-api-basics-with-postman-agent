const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

//Note on exceptions - the process has to be terminated as the node process will be in an unclean state. Termination and restart of the process is required to fix this issue. While it is not necessary to terminate the process for uncuaght rejections, it is required for uncaught exceptions.

process.on('UNCAUGHT EXCEPTION', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION!, 💥 Shutting down...');
  process.exit(1);
});

// Place the exception handler at the top of the program execution flow so the watcher is able to observe and respond to any uncaught exceptions at any point without there being a chance of missing them.

//----------------------------------------------------------

dotenv.config({ path: './config.env' });
const server = app;

const port = process.env.PORT || 4000;

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('DB connection established.');
  });

const servercontainer = server.listen(port, () => {
  console.log(`server now listening on port ${port}`);
});

//global unhandled promise rejection
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLE REJECTION! 💥Shutting down...');
  servercontainer.close(() => {
    process.exit(1);
  });
});
