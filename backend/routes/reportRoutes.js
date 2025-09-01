// const express = require('express');
// const router = express.Router();
// const { addReport, getReports } = require('../controllers/reportController');

// // Add a new report
// router.post('/report', addReport);

// // Get all reports
// router.get('/reports', getReports);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { addReport, getReports } = require('../controllers/reportController');

// Add a new report
router.post('/report', addReport);

// Get all reports
router.get('/reports', getReports);

module.exports = router;
