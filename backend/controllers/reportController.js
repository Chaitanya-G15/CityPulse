// let reports = [];

// const getReports = async (req, res) => {
//     try {
//         res.json(reports);
//     } catch (err) {
//         console.error('Error in getReports:', err);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// const addReport = async (req, res) => {
//     try {
//         const report = req.body;
//         if (!report || Object.keys(report).length === 0) {
//             return res.status(400).json({ message: 'Report data is required' });
//         }
//         reports.push(report);
//         res.status(201).json({ message: 'Report added successfully', report });
//     } catch (err) {
//         console.error('Error in addReport:', err);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// module.exports = { getReports, addReport };
// controllers/reportController.js
const Report = require('../models/Report'); // Import Mongoose model

// Get all reports
const getReports = async (req, res) => {
  try {
    const reports = await Report.find(); // Fetch all reports from MongoDB
    res.json(reports);
  } catch (err) {
    console.error('Error in getReports:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add a new report
const addReport = async (req, res) => {
  try {
    const reportData = req.body;
    if (!reportData || Object.keys(reportData).length === 0) {
      return res.status(400).json({ message: 'Report data is required' });
    }

    const report = new Report(reportData); // Create new report document
    await report.save(); // Save to MongoDB

    res.status(201).json({ message: 'Report added successfully', report });
  } catch (err) {
    console.error('Error in addReport:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getReports, addReport };
