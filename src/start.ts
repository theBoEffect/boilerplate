import app from './app';
import connection from './connection';

const config = require('./config');

let mongoConnect = config.MONGO;

if (!mongoConnect) {
    console.error('Mongo Connection not set. Exiting.');
    process.exit(1);
}

function normalizePort(val: string) {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
}

function onError(error: any) {
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

if(process.env.NODE_ENV === 'dev') console.info(`Connection string: ${mongoConnect}`);
connection.create(mongoConnect);

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = app.listen(port, () => {
    console.error(`Listening on ${port}`);
});

server.on('error', onError);