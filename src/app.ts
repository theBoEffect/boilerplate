import express, { Express } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import middle from './middleware.js';
import routes from './routes/index.js';
import { config } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
app.use(routes);

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