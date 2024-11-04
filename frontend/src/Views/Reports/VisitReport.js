import React, { useEffect, useState } from "react";
import { Table, Container, Alert, Dropdown, Button,Form } from "react-bootstrap";

const VisitReport = () => {
  const [stockData, setStockData] = useState([]);
  const [stockHolders, setStockHolders] = useState([]);
  const [selectedStockHolder, setSelectedStockHolder] = useState("");
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filteredVisits, setFilteredVisits] = useState([]);

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

  const fetchData = async (stockHolderId) => {
    try {
      const url = stockHolderId
        ? `http://localhost:80/api/getvisitbystaff/${stockHolderId}`
        : "http://localhost:80/api/todayvisits";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const dataReceived = await response.json();
      setStockData(dataReceived);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchStockHolders();
    fetchData(selectedStockHolder); // Fetch data on initial load
  }, []);

  useEffect(() => {
    if (selectedStockHolder) fetchData(selectedStockHolder); // Refetch data on stock holder change
  }, [selectedStockHolder]);

  const filterVisitsByDate = () => {
    const filtered = stockData.filter(visit => {
      const visitDate = new Date(visit.date);
      const start = fromDate ? new Date(fromDate) : null;
      const end = toDate ? new Date(toDate) : null;
      
      return (!start || visitDate >= start) && (!end || visitDate <= end);
    });
    setFilteredVisits(filtered);
  };
  
  return (
    <Container>
      <h1>Visit Report</h1>
      {error ? (
        <Alert variant="danger">Error fetching stock report: {error}</Alert>
      ) : (
        <>
          <div className="mb-3">
            <div className="row">
              <div className="col-mb-12">
                <Dropdown>
                  <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    {selectedStockHolder ? `Selected: ${selectedStockHolder}` : "Select Staff"}
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
              </div>
              <div className="row">
              <div className="col-mb-12">
                <Form.Label>Select Client/Doctor</Form.Label>              
                <Form.Control
                  as="select"
                >
                  <option></option>
                </Form.Control>
              </div>
              </div>
              <div className="row">
                <div className="col-mb-6">
                  <Form.Label>From Date</Form.Label>
                  <Form.Control type='Date' value={fromDate} onChange={(e) => setFromDate(e.target.value)}/>
                </div>
                <div className="col-mb-6">
                  <Form.Label>To Date</Form.Label>
                  <Form.Control type='Date' value={toDate} onChange={(e) => setToDate(e.target.value)}/>
                </div>
              </div>            
          </div>

          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Visit Date</th>
                <th>Visit Time</th>
                <th>Visited By</th>
                <th>Visited To</th>
                <th>Coupon Collected</th>
                <th>Coupon Settled</th>
                <th>Bonus</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(stockData) && stockData.length > 0 ? (
                stockData.map((item, index) => (
                  <tr key={`${item.product_id}-${index}`}>
                    <td>{item.v_date}</td>
                    <td>{item.v_time}</td>
                    <td>{item.sname}</td>
                    <td>{item.docname}</td>
                    <td>{item.tcpoints}</td>
                    <td>{item.tsp}</td>
                    <td>{item.tcbp}</td>
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

export default VisitReport;
