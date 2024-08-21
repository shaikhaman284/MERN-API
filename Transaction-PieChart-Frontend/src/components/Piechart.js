// src/PieChart.js
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import './Piechart.css';

// Register the necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
    const [chartData, setChartData] = useState({});
    const [selectedMonth, setSelectedMonth] = useState('January');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products/piechart', {
                    params: { month: selectedMonth },
                });

                const data = response.data;

                if (data.length === 0) {
                    setError('No data available for the selected month.');
                    return;
                }

                const labels = data.map(item => item.category);
                const counts = data.map(item => item.count);

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: `Pie Chart Stats - ${selectedMonth}`,
                            data: counts,
                            backgroundColor: [
                                'rgba(75,192,192,0.6)',
                                'rgba(192,75,192,0.6)',
                                'rgba(192,192,75,0.6)',
                                'rgba(255,99,132,0.6)',
                                'rgba(54,162,235,0.6)',
                                'rgba(255,206,86,0.6)',
                                'rgba(75,192,192,0.6)',
                                'rgba(153,102,255,0.6)',
                                'rgba(255,159,64,0.6)'
                            ],
                            borderColor: [
                                'rgba(75,192,192,1)',
                                'rgba(192,75,192,1)',
                                'rgba(192,192,75,1)',
                                'rgba(255,99,132,1)',
                                'rgba(54,162,235,1)',
                                'rgba(255,206,86,1)',
                                'rgba(75,192,192,1)',
                                'rgba(153,102,255,1)',
                                'rgba(255,159,64,1)'
                            ],
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
            ) : chartData && chartData.labels ? (
                <Pie data={chartData} />
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default PieChart;
