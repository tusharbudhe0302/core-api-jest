const uuid = require('uuid');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
    // Simple request id generator
    req.id = uuid.v4();
    res.set({ 'Request-Id': req.id });
    next();
};
