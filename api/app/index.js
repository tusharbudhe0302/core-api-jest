const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
// const YAML = require('yamljs');

const swaggerDocument = require('./unqork-api.json');
const requestId = require('./middleware/requestId');
const routers = require('./routers');

const app = express();

app.use('/api-docs', (req, res, next) => {
    swaggerDocument.host = req.get('host');
    req.swaggerDoc = swaggerDocument;
    next();
}, swaggerUi.serve, swaggerUi.setup());

app.disable('x-powered-by');
// Include simple middleware for request id
app.use(requestId);
// Get Request Body
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
    // Enable simple STDOUT logging if not tests
    app.set('enableLogger', true);
    app.use(morgan('combined'));
}

// Mount all subrouters
app.use(routers);

// Generic 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 404,
        data: null,
        error: 'Not Found!'
    });
});
// Generic error handler
app.use((err, req, res, next) => {
    /* istanbul ignore next */
    if (app.get('enableLogger')) {
        // eslint-disable-next-line no-console
        console.error(err);
    }
    res.status(500).json({
        status: 500,
        data: null,
        error: err.message
    });
    next();
});
module.exports = app;
