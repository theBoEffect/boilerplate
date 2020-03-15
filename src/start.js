require('@babel/register');
require('regenerator-runtime');

const app = require('./app').default;
const http = require('http');

const connection = require('./connection').default;
const config = require('./config');

let mongoConnect = config.MONGO;

if (!mongoConnect) {
    console.error('Mongo Connection not set. Exiting.');
    process.exit(1);
}

function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') throw error;

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    console.error('connected');
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.error(`Listening on ${bind}`);
}

console.info(`Connection string: ${mongoConnect}`);
connection.create(mongoConnect, config.REPLICA);
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);