import React, { useEffect, useState } from "react";
import { Table, Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Products = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20); // Default to 20 rows per page
  const navigate = useNavigate();

  const printedBy = localStorage.getItem("userName") || "Admin";
  const printedOn = new Date().toLocaleString();

  const handleOpen = () => {
    navigate("/products/add");
  };

  const handleEdit = (item) => {
    navigate(`/products/edit/${item.id}`, { state: { product: item } });
  };

  // Function to handle deleting a product
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:80/api/deleteProduct/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          alert('Product deleted successfully!');
          fetchData(); // Refresh data after deletion
        } else {
          const errorData = await response.json();
          console.error('Error deleting product:', errorData);
          alert(`Failed to delete product: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error while calling the delete API:', error);
        alert('A network error occurred while deleting the product.');
      }
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:80/api/products");
      const dataReceived = await response.json();
      setData(dataReceived);
    } catch (error) {
      console.error("Error fetching product list:", error);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Product Records", 20, 10);

    const columns = ["Id", "Type", "Name", "Points", "Bonus", "Settlement Points", "Sample Points"];
    const rows = data.map((item, index) => [
      index + 1,
      item.product_type || "N/A",
      item.product_name || "N/A",
      item.points || "N/A",
      item.bonous || "N/A",
      item.points_on_settlement || "N/A",
      item.points_on_sample || "N/A"
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 20,
      didDrawPage: (data) => {
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(10);
        doc.text(`Printed By: ${printedBy}`, 20, pageHeight - 20);
        doc.text(`Printed On: ${printedOn}`, 20, pageHeight - 10);
      }
    });

    doc.save("Product_Records.pdf");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleItemsPerPageChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setItemsPerPage(value);
      setCurrentPage(1); // Reset to the first page
    }
  };

  return (
    <Container>
      <Card className="mb-4 bg-light" style={{ boxShadow: "4px 4px 10px black " }}>
        <Card.Header className="bg-primary text-light">
          <h5 className="mb-0">PRODUCTS</h5>
        </Card.Header>
        <Card.Body>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Row>
            <Col>
                <Button variant="info" onClick={handleOpen} className="mb-3 bg-info" size="vsm">
                Add Product
              </Button>
              <Button variant="success" onClick={exportPDF} className="mb-3" size="vsm">
                Print
              </Button>
            </Col>
          </Row>
      </div>

          <Row className="mb-3 justify-content-end">
  <Col xs="auto">
    <Form.Group controlId="rowsPerPage">
      <Form.Label>Rows Per Page:</Form.Label>
      <Form.Control
        as="select"
        value={itemsPerPage}
        onChange={handleItemsPerPageChange}
      >
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </Form.Control>
    </Form.Group>
  </Col>
          </Row>

          <Table striped bordered hover responsive variant="light">
            <thead style={{ backgroundColor: "black", color: "white" }}>
              <tr>
                <th>Id</th>
                <th>Type</th>
                <th>Name</th>
                <th>Points</th>
                <th>Bonus</th>
                <th>Settlement Points</th>
                <th>Sample Points</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.product_type}</td>
                    <td>{item.product_name}</td>
                    <td>{item.points}</td>
                    <td>{item.bonous}</td>
                    <td>{item.points_on_settlement}</td>
                    <td>{item.points_on_sample}</td>
                    <td>
                      <div style={{ display: "flex", gap: "1rem" }}>
                        <Button variant="primary" onClick={() => handleEdit(item)}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(item.id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No Products Found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          <Row className="mt-3">
            <Col className="text-center">
              <Button variant="secondary" onClick={handlePreviousPage} disabled={currentPage === 1}>
                Previous
              </Button>
              <span className="mx-3">
                Page {currentPage} of {totalPages}
              </span>
              <Button variant="secondary" onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Products;
