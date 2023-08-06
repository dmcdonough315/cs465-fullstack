const express = require('express');
const router = express.Router();

//edited code per module description
const ctrlMain = require('../controllers/main');
/* GET home page. */
router.get('/', ctrlMain.index);

module.exports = router;
