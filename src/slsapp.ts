import sls from 'serverless-http'
import app from './app';
import connection from "./connection";

const config = require('./config');

let mongoConnect = config.MONGO;

if (!mongoConnect) {
    console.error('Mongo Connection not set. Exiting.');
    process.exit(1);
}

if(process.env.NODE_ENV === 'dev') console.info(`Connection string: ${mongoConnect}`);
connection.create(mongoConnect);

function normalizePort(val: string) {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
}

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const handler = sls(app, {
    request: (req: any, event: any, context: any) => {
        req.requestId = context.awsRequestId;
    }
});

module.exports.handler = async (event: any, context: any) => {
    // eslint-disable-next-line no-console
    console.log(`START GATEWAY REQUEST: ${event.requestContext.requestId}`);
    const result = await handler(event, context);
    // eslint-disable-next-line no-console
    console.log(`END GATEWAY REQUEST: ${event.requestContext.requestId}`);
    return result;
};