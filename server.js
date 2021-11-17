/**
 *  normalizePort -> renvoie un port valide
 *  errorHandler -> relève les erreurs éventuelles et les gère; cette fonction est greffée sur l'évenement on erreor du serveur
 *  Idem au niveau de l'écouteur d'évèment pour listening
 */
const http = require('http');
const app = require('./app');

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  let er = false;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      er = true;
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      er = true;
      break;
    default:
      throw error;
  }

  if (er) {
      process.exit(1);
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
