const app = require('./app');
const server = app;

const port = 4000;
server.listen(port, () => {
  console.log(`server now listening on port ${port}`);
});
