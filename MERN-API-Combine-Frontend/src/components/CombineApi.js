import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import axios from 'axios';
import './CombineApi.css';


//Statistic....
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

//PieChart .....
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


//BarChart.....
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


export { Statistics, PieChart, BarChart };
