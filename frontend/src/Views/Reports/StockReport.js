import React, { useEffect, useState } from "react";
import { Table, Container, Alert, Dropdown, Button } from "react-bootstrap";

const StockReport = () => {
  const [stockData, setStockData] = useState([]);
  const [stockHolders, setStockHolders] = useState([]);
  const [selectedStockHolder, setSelectedStockHolder] = useState("");
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:80/api/getstockreport");
      if (!response.ok) throw new Error("Network response was not ok");
      const dataReceived = await response.json();
      setStockData(dataReceived);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchStockHolders = async () => {
    try {
      const response = await fetch("http://localhost:80/api/getstockholderids");
      if (!response.ok) throw new Error("Network response was not ok");
      const stockHoldersReceived = await response.json();
      setStockHolders(stockHoldersReceived);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
    fetchStockHolders();
  }, []);

  const filteredStockData = selectedStockHolder
    ? stockData.filter(item => item.stock_holder_id === selectedStockHolder)
    : stockData;

  return (
    <Container>
      <h1>Stock Report</h1>
      {error ? (
        <Alert variant="danger">Error fetching stock report: {error}</Alert>
      ) : (
        <>
          <div className="mb-3">
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                {selectedStockHolder ? `Selected: ${selectedStockHolder}` : "Select Stock Holder"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {stockHolders.map(stock => (
                  <Dropdown.Item
                    key={stock.stock_holder_id}
                    onClick={() => setSelectedStockHolder(stock.stock_holder_id)}
                  >
                    {stock.stock_holder_name} ({stock.stock_holder_id})
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Button
              variant="secondary"
              className="mt-2 width=sm"
              onClick={() => setSelectedStockHolder("")}
            >
              Reset Filter
            </Button>
          </div>

          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Product Type</th>
                <th>Opening Quantity</th>
                <th>Stock In Quantity</th>
                <th>Stock Out Quantity</th>
                <th>Closing Stock</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredStockData) && filteredStockData.length > 0 ? (
                filteredStockData.map((item, index) => (
                  <tr key={`${item.product_id}-${index}`}>
                    <td>{item.product_id}</td>
                    <td>{item.product_name}</td>
                    <td>{item.product_type}</td>
                    <td>{item.opqty}</td>
                    <td>{item.stock_in_qty}</td>
                    <td>{item.stock_out_qty}</td>
                    <td>{item.closing_stock}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No data available</td>
                </tr>
              )}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default StockReport;
