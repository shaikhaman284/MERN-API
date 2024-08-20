// routes/productRoutes.js
const express = require('express');
const { fetchAndSeedData, getTransactions, getStatisticsByMonth, getBarChartData, getPieChartData} = require('../controllers/productController');
const productController = require('../controllers/productController'); 
const router = express.Router();

// Route to initialize database
router.get('/init-db', fetchAndSeedData);

// Route to get transactions with search and pagination
router.get('/transactions', getTransactions);

//for statistics
router.get('/statistics/:month', getStatisticsByMonth);

//for barchart
router.get('/barchart', getBarChartData);

//for pie chart
router.get('/piechart', getPieChartData);



module.exports = router;
