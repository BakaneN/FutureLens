const express = require('express');
const router = express.Router();

const { getCareerInfo } = require('../controllers/careerController');
const verifyAuth = require('../Middleware/auth');

// Route to get career info
router.post('/', verifyAuth, getCareerInfo);

module.exports = router;
