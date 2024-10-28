import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Stock_Issue_List = () => {
  // Define state to hold the stock data
  const [stockData, setStockData] = useState([]);
  const navigate = useNavigate();

  // Fetch stock data from an API or backend server
  useEffect(() => {
    const fetchStockData = async () => {
      // Replace this with your API endpoint to fetch stock data
      const response = await fetch('http://localhost:80/api/outwardchallanhead');
      const data = await response.json();
      setStockData(data); // Assuming data is an array of stock objects
    };

    fetchStockData();
  }, []);

  // Function to handle the "New Issue" button click (e.g., opening a form modal)
  const handleNewIssueClick = () => {
    navigate('/transaction/stock_issue');
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Stock Issue List</h2>
        <button
          className="btn btn-primary"
          onClick={handleNewIssueClick}
        >
          New Issue
        </button>
      </div>
      <table className="table table-striped table-bordered">
        <thead className="table-light">
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Issue Date</th>
            <th scope="col">Issue To</th>
            <th scope="col">Total Quantity</th>
          </tr>
        </thead>
        <tbody>
          {stockData.length > 0 ? (
            stockData.map((stock, index) => (
              <tr key={index}>
                <td>{stock.id}</td>
                <td>{stock.challan_date}</td>
                <td>{stock.issued_to}</td>
                <td>{stock.total_quantity}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Stock_Issue_List;
