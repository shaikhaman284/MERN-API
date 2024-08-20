// controllers/productController.js
const axios = require('axios');
const Product = require('../models/Product');

const fetchAndSeedData = async (req, res) => {
    try {
        const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        console.log("Fetched Data:", data);
        await Product.deleteMany({}); // Clear the database first
        try {
            await Product.insertMany(data); // Insert new data
            console.log("Data inserted successfully");
        } catch (insertErr) {
            console.error("Error inserting data:", insertErr.message);
        }
        res.status(200).json({ message: 'Database initialized with seed data' });
    } catch (err) {
        console.error("Error seeding data:", err.message);
        res.status(500).json({ error: 'Database initialization failed', details: err.message });
    }
};


const getTransactions = async (req, res) => {
    try {
        const { month, search = '', page = 1, perPage = 10 } = req.query;

        // Initialize query array for aggregation
        const query = [];

        // Handle month filter
        if (month && /^(January|February|March|April|May|June|July|August|September|October|November|December)$/i.test(month)) {
            // Convert month to its number equivalent (January = 1, February = 2, etc.)
            const monthNumber = new Date(`${month} 1, 2000`).getMonth() + 1;

            // Add month filter using $match and $month operator in the aggregation pipeline
            query.push({
                $match: {
                    $expr: {
                        $eq: [{ $month: '$dateOfSale' }, monthNumber],
                    },
                },
            });
        } else if (month) {
            return res.status(400).json({ message: 'Invalid month. Please provide a valid month between January and December.' });
        }

        // Handle search filter
        if (search) {
            query.push({
                $match: {
                    $or: [
                        { title: new RegExp(search, 'i') },
                        { description: new RegExp(search, 'i') },
                        { category: new RegExp(search, 'i') },
                        { price: isNaN(search) ? null : parseFloat(search) },
                    ].filter(condition => condition.price !== null || condition.title || condition.description || condition.category), // Filter out null values
                },
            });
        }

        // Pagination: Add $skip and $limit stages
        const skip = (parseInt(page) - 1) * parseInt(perPage);
        query.push({ $skip: skip });
        query.push({ $limit: parseInt(perPage) });

        // Aggregation pipeline to fetch products
        const products = await Product.aggregate(query);

        // Count total documents (without pagination)
        const totalCount = await Product.countDocuments(query.length > 0 ? query[0].$match : {});

        res.status(200).json({
            totalCount,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / parseInt(perPage)),
            products,
        });
    } catch (err) {
        console.error('Server Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};


const getStatisticsByMonth = async (req, res) => {
    try {
        const month = req.params.month; // e.g., "September"
        const monthNumber = new Date(`${month} 1, 2000`).getMonth(); // Convert month name to month index (0-11)

        // Define the filter for the month using $expr to extract the month from dateOfSale
        const totalSaleAmount = await Product.aggregate([
            { 
                $match: { 
                    sold: true, // Only include sold items
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, monthNumber + 1] // MongoDB months are 1-indexed
                    }
                } 
            },
            { 
                $group: { 
                    _id: null, 
                    totalSaleAmount: { $sum: "$price" } 
                } 
            }
        ]);

        // Log the result
        console.log(totalSaleAmount);

        // Calculate total sold items
        const totalSoldItems = await Product.countDocuments({
            sold: true,
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, monthNumber + 1]
            }
        });
        console.log(totalSoldItems);

        // Calculate total not sold items
        const totalNotSoldItems = await Product.countDocuments({
            sold: false,
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, monthNumber + 1]
            }
        });
        console.log(totalNotSoldItems);

        // Return the statistics
        res.json({
            totalSaleAmount: totalSaleAmount[0]?.totalSaleAmount || 0,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};


// Controller function to get bar chart data
const getBarChartData = async (req, res) => {
    try {
        const { month } = req.query;

        console.log(month);
        if (!month) {
            return res.status(400).json({ message: 'Month is required' });
        }

        // Aggregate data to get the number of items in each price range for the specified month
        const data = await Product.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, new Date(`${month} 01, 2000`).getMonth() + 1]
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $switch: {
                            branches: [
                                { case: { $lt: ["$price", 100] }, then: "0-100" },
                                { case: { $and: [{ $gte: ["$price", 100] }, { $lt: ["$price", 200] }] }, then: "101-200" },
                                { case: { $and: [{ $gte: ["$price", 200] }, { $lt: ["$price", 300] }] }, then: "201-300" },
                                { case: { $and: [{ $gte: ["$price", 300] }, { $lt: ["$price", 400] }] }, then: "301-400" },
                                { case: { $and: [{ $gte: ["$price", 400] }, { $lt: ["$price", 500] }] }, then: "401-500" },
                                { case: { $and: [{ $gte: ["$price", 500] }, { $lt: ["$price", 600] }] }, then: "501-600" },
                                { case: { $and: [{ $gte: ["$price", 600] }, { $lt: ["$price", 700] }] }, then: "601-700" },
                                { case: { $and: [{ $gte: ["$price", 700] }, { $lt: ["$price", 800] }] }, then: "701-800" },
                                { case: { $and: [{ $gte: ["$price", 800] }, { $lt: ["$price", 900] }] }, then: "801-900" },
                            ],
                            default: "901-above"
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Map the data to the required format for the front end
        const formattedData = data.map(item => ({
            priceRange: item._id,
            count: item.count
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching bar chart data:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Controller function to get pie chart data
const getPieChartData = async (req, res) => {
    try {
        const { month } = req.query;

        console.log(month);
        if (!month) {
            return res.status(400).json({ message: 'Month is required' });
        }

        // Aggregate data to get the number of items in each category for the specified month
        const data = await Product.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, new Date(`${month} 01, 2000`).getMonth() + 1]
                    }
                }
            },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        // Map the data to the required format for the front end
        const formattedData = data.map(item => ({
            category: item._id,
            count: item.count
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching pie chart data:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



module.exports = { fetchAndSeedData, getTransactions, getStatisticsByMonth, getBarChartData, getPieChartData };

