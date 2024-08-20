// src/components/Transactions.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Transactions.css';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [month, setMonth] = useState(''); // Default month is March
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage] = useState(6);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/products/transactions`, {
                params: { month, search, page, perPage }
            });
            setTransactions(response.data.products);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch transactions');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [month, search, page]);

    const handleSearchChange = (e) => setSearch(e.target.value);
    const handleMonthChange = (e) => setMonth(e.target.value);
    const handlePageChange = (newPage) => setPage(newPage);

    return (
        <div className="transactions-container">
            <h1>Transaction Dashboard</h1>
            <div className="filter-bar">
                <input
                    type="text"
                    placeholder="Search transaction"
                    value={search}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                <select value={month} onChange={handleMonthChange} className="month-select">
                    {['select','January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p>Loading transactions...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div>
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Sold</th>
                                <th>Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction._id}>
                                    <td>{transaction.id}</td>
                                    <td>{transaction.title}</td>
                                    <td>{transaction.description}</td>
                                    <td>${transaction.price}</td>
                                    <td>{transaction.category}</td>
                                    <td>{transaction.sold ? 'Yes' : 'No'}</td>
                                    <td><img src={transaction.image} alt={transaction.name} className="product-image" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page <= 1}
                            className="pagination-btn"
                        >
                            Previous
                        </button>
                        <span>Page No: {page}</span>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= totalPages}
                            className="pagination-btn"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
