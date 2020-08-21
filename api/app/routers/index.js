const { Router } = require('express');
const rootRouter = require('./root');
const fooRouter = require('./foo');

const router = Router();

router.use(rootRouter);
router.use(fooRouter);

module.exports = router;
