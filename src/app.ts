import express, { Express } from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import middle from './middleware';
import { Root, Logs } from './routes';
import { config } from './config';

const app: Express = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
if(config.ENV!=='production') app.use(logger('tiny'));
app.use(middle.responseIntercept);
app.use(middle.requestId);
app.use(express.json({ type: ['json', '+json'] }));
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(middle.cores);

//content and APIs
app.use(express.static(path.join(__dirname, '../public')));
app.use('/', Root);
app.use('/api', Logs);

// catch 404 and other errors
app.use(middle.catch404);
app.use(middle.catchErrors);

// Handle uncaughtException
process.on('uncaughtException', (err) => {
    console.error('Caught exception:');
    console.error(err);
    console.error({
        error: 'UNCAUGHT EXCEPTION',
        stack: err.stack || err.message
    });
});

export default app;