import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import axios from 'axios';
import './Barchart.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });
    const [selectedMonth, setSelectedMonth] = useState('January');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/barchart`, {
                    params: { month: selectedMonth },
                });

                const data = response.data;

                if (!data || data.length === 0) {
                    throw new Error('No data available');
                }

                const labels = data.map(item => item.priceRange);
                const counts = data.map(item => item.count);

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: `Bar Chart Stats - ${selectedMonth}`,
                            data: counts,
                            backgroundColor: 'rgba(75,192,192,0.6)',
                            borderColor: 'rgba(75,192,192,1)',
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data');
            }
        };

        fetchData();
    }, [selectedMonth]);

    return (
        <div className="chart-container">
            <h1>Bar Chart Stats</h1>
            <div className="dropdown-container">
            
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                </select>
            </div>

            {error ? (
                <div>{error}</div>
            ) : (
                <Bar data={chartData} />
            )}
        </div>
    );
};

export default BarChart;
