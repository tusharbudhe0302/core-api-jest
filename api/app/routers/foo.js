/* eslint-disable linebreak-style */
/* eslint-disable new-cap */
/* eslint-disable consistent-return */

const {
    Router
} = require('express');
const {
    foos
} = require('../models/foo');

const router = Router();
const send404 = ((res) => res.status(404).send({
    status: 404,
    data: null,
    error: 'Not Found!'
}));
const send500 = ((next, ex) => next(new Error(ex)));
const fooMiddleware = (req, res, next) => {
    /** Cutom Middleware. Some Issue in Joi npm middleware */
    if (!req.body.name || req.body.name.length < 2) {
        return res.status(400).json({
            status: 400,
            error: 'Bad Request name: can\'t by empty. Minimum of 3 chars',
            data: null
        });
    }
    next();
};
const fooMiddlewareRequestParams = (req, res, next) => {
    /** Cutom Middleware. Some Issue in Joi npm middleware */
    const regExId = new RegExp(/^[0-9a-f]{8,8}-[0-9a-f]{4,4}-[0-9a-f]{4,4}-[0-9a-f]{4,4}-[0-9a-f]{12,12}$/);
    const reqId = req.params.id;
    if (!reqId.match(regExId)) {
        return res.status(400).json({
            status: 400,
            error: 'Bad Request id: should be in valid fomat of GUID.',
            data: null
        });
    }
    next();
};
router.get('/foos', async (req, res, next) => {
    try {
        const foosResponse = await foos.find({});
        if (foosResponse.length > 0) {
            return res.status(200).json({
                status: 200,
                error: null,
                data: foosResponse
            });
        }
        return send404(res);
    } catch (ex) {
        send500(next, ex);
    }
});
router.get('/foos/foo/:id', fooMiddlewareRequestParams, async (req, res, next) => {
    try {
        const foosResponse = await foos.findById(req.params.id);
        if (foosResponse) {
            return res.status(200).json({
                status: 200,
                error: null,
                data: foosResponse
            });
        }
        return send404(res);
    } catch (ex) {
        send500(next, ex);
    }
});
router.post('/foos/foo', fooMiddleware, async (req, res, next) => {
    try {
        const requestBody = req.body;
        const newFoo = new foos({
            name: requestBody.name,
            data: requestBody.data,
            foos: requestBody.foos
        });
        const response = await newFoo.save({});
        res.status(201).json({
            status: 201,
            error: null,
            data: response
        });
    } catch (ex) {
        send500(next, ex);
    }
});
router.put('/foos/foo/:id', fooMiddleware, fooMiddlewareRequestParams, async (req, res, next) => {
    try {
        const requestBody = req.body;
        const updatedFoo = await foos.findOneAndUpdate({
            _id: req.params.id
        }, requestBody, {
            new: true,
            runValidators: true
        });
        if (updatedFoo) {
            return res.status(200).json({
                status: 200,
                error: null,
                data: updatedFoo
            });
        }
        return send404(res);
    } catch (ex) {
        send500(next, ex);
    }
});
router.delete('/foos/foo/:id', fooMiddlewareRequestParams, async (req, res, next) => {
    try {
        const deletedFoo = await foos.findByIdAndDelete(req.params.id);
        if (deletedFoo) {
            if (deletedFoo.foos.length > 0) {
                await foos.deleteMany({
                    _id: {
                        $in: deletedFoo.foos
                    }
                });
            }
            return res.status(200).json({
                status: 200,
                error: null,
                data: deletedFoo
            });
        }
        return send404(res);
    } catch (ex) {
        send500(next, ex);
    }
});
module.exports = router;
