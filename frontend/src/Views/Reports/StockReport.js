import React, { useEffect, useState } from "react";
import { Table, Container, Alert, Dropdown, Button, Pagination } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";

const StockReport = () => {
  const [stockData, setStockData] = useState([]);
  const [stockHolders, setStockHolders] = useState([]);
  const [selectedStockHolder, setSelectedStockHolder] = useState("");
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page

  const printedBy = localStorage.getItem("userName") || "Admin";
  const currentDateTime = new Date();
  const printedOn = currentDateTime.toLocaleString();

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

  // Pagination logic
  const totalPages = Math.ceil(filteredStockData.length / itemsPerPage);
  const paginatedData = filteredStockData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Product ID",
      "Product Name",
      "Product Type",
      "Opening Quantity",
      "Stock In Quantity",
      "Stock Out Quantity",
      "Closing Stock",
    ];
    const tableRows = filteredStockData.map(item => [
      item.product_id,
      item.product_name,
      item.product_type,
      item.opqty,
      item.stock_in_qty,
      item.stock_out_qty,
      item.closing_stock,
    ]);

    doc.text("Stock Report", 14, 10);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    const pageHeight = doc.internal.pageSize.height;
    const footerY = pageHeight - 10;
    doc.setFontSize(10);
    doc.text(`Printed by: ${printedBy}`, 14, footerY - 5);
    doc.text(`Printed on: ${printedOn}`, 14, footerY);

    doc.save("Stock_Report.pdf");
  };

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
                {selectedStockHolder
                  ? `Selected: ${selectedStockHolder}`
                  : "Select Stock Holder"}
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
              className="mt-2"
              onClick={() => setSelectedStockHolder("")}
            >
              Reset Filter
            </Button>

            <Button
              variant="success"
              className="mt-2 ms-2"
              onClick={exportPDF}
            >
              Print
            </Button>
          </div>

          {/* Rows Per Page Dropdown */}
          <div className="d-flex justify-content-end align-items-center mb-3">
            <label htmlFor="rowsPerPage" className="me-2">
              Rows Per Page:
            </label>
            <select
              id="rowsPerPage"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to the first page on changing rows per page
              }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
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
              {Array.isArray(paginatedData) && paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
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

          <Pagination className="justify-content-center mt-3">
            <Pagination.Prev onClick={handlePreviousPage} disabled={currentPage === 1} >
              Previous
            </Pagination.Prev>
            <Pagination.Item active>{currentPage}</Pagination.Item>
            <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </Pagination.Next>
          </Pagination>
        </>
      )}
    </Container>
  );
};

export default StockReport;
