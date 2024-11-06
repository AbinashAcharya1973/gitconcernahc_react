import React, { useEffect, useState } from 'react';
import { Table, Container, Alert } from 'react-bootstrap';

const StockReport = ({ stockholderId }) => {
  const [stockData, setStockData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStockReport = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint, which should filter by stockpointId
      const response = await fetch(`http://localhost:80/api/getStaff/${stockholderId}`);
      if (!response.ok) throw new Error("Failed to fetch stock data");
      const data = await response.json();
      setStockData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (stockholderId) fetchStockReport();
  }, [stockholderId]);

  return (
    <Container>
      <h1>Stock Report</h1>
      {/*{error && <Alert variant="danger">Error: {error}</Alert>}*/}
      {loading ? (
        <p>Loading stock data...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Type</th>
              <th>Product Name</th>
              <th>Opening Stock</th>
              <th>Stock In</th>
              <th>Stock Out</th>
              <th>Closing Stock</th>
            </tr>
          </thead>
          <tbody>
            {stockData.length > 0 ? (
              stockData.map((product) => (
                <tr key={product.product_id}>
                  <td>{product.product_id}</td>
                  <td>{product.product_type}</td>
                  <td>{product.product_name}</td>
                  <td>{product.opqty}</td>
                  <td>{product.stock_in_qty}</td>
                  <td>{product.stock_out_qty}</td>
                  <td>{product.closing_stock}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No stock data available</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default StockReport;
