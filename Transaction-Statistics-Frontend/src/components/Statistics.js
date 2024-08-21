import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Statistics.css'; // Make sure to include this line to import the CSS

const Statistics = () => {
    const [month, setMonth] = useState('June');
    const [statistics, setStatistics] = useState({
        totalSaleAmount: 0,
        totalSoldItems: 0,
        totalNotSoldItems: 0
    });

    useEffect(() => {
        fetchStatistics(month);
    }, [month]);

    const fetchStatistics = async (selectedMonth) => {
        try {
            // Ensure the URL is correctly formed
            const response = await axios.get(`http://localhost:5000/api/products/statistics/${selectedMonth}`);
            setStatistics(response.data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
            // Handle error as needed (e.g., display an error message)
        }
    };
    

    return (
        <div className="statistics">
            <h2>Statistics - {month}</h2>
            <div className="statistics-box">
                <div>Total sale: {statistics.totalSaleAmount}</div>
                <div>Total sold items: {statistics.totalSoldItems}</div>
                <div>Total not sold items: {statistics.totalNotSoldItems}</div>
            </div>
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                    <option key={m} value={m}>{m}</option>
                ))}
            </select>
        </div>
    );
};

export default Statistics;
