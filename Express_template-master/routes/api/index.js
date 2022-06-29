var express = require('express');
var router = express.Router();

router.use('/youtube', require('./youtube'));

module.exports = router;