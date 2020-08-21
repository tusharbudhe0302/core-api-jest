const mongoose = require('mongoose');
const app = require('./app');

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/unqork_core_test';

mongoose.connect(
    mongoUrl, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    }
).then(() => {
    const appPort = process.env.PORT || 4500;
    const server = app.listen(appPort, () => {
        if (app.get('enableLogger')) {
            const {
                address,
                port
            } = server.address();
            // eslint-disable-next-line no-console
            console.info(`HTTP server listening ${address}:${port}!`);
        }
    });

    process.on('SIGINT', () => shutdown('SIGINT', app, server));
    process.on('SIGTERM', () => shutdown('SIGTERM', app, server));
});

function shutdown(signal, enableLogger, serv) {
    if (enableLogger) {
        // eslint-disable-next-line no-console
        console.info(`\n\n${signal} signal received: closing HTTP server`);
    }

    serv.close(() => {
        if (enableLogger) {
            // eslint-disable-next-line no-console
            console.info('HTTP server closed');
        }
    });
}
process.on('unhandledRejection', (err) => {
    console.log(`unhandledRejection: ${err}`);
    process.exit(1);
});
