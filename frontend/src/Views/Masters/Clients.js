import React, { useEffect, useState } from "react";
import { Table, Container, Row, Col, Button, Card, Form,Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import EditClient from "./Forms/EditClient";


const Clients = () => {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState("Add");
  const [item, setItem] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const navigate = useNavigate();
   
  const printedBy = localStorage.getItem("userName") || "Admin"; // Replace with actual logic if needed
  const currentDateTime = new Date();
  const printedOn = currentDateTime.toLocaleString();

  // Function to navigate to the Add Client page
  const handleOpen = () => {
    navigate("/master/clients/add");
  };

  const handleEdit = (item) => {
    setType("Edit");
    setItem(item);
    setVisible(true);
  };

  // Function to handle deleting a client
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        const response = await fetch(`http://localhost:80/api/deleteClient/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          alert('Client deleted successfully!');
          fetchData(); // Refresh data after deletion
        } else {
          const errorData = await response.json();
          console.error('Error deleting client:', errorData);
          alert(`Failed to delete client: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error while calling the delete API:', error);
        alert('A network error occurred while deleting the client.');
      }
    }
  };
  

  // Fetch Client data from the backend
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:80/api/clients");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const dataReceived = await response.json();
      setData(dataReceived);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Pagination Logic
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
      setCurrentPage(1);
    }
  };

  // Function to export table data to PDF
  const exportPDF = () => {
    const doc = new jsPDF();
  
    // Title for the PDF
    doc.text("Client Records", 20, 10);
  
    // Define columns for the table
    const columns = ["Id", "Type", "Code", "Name", "Email", "Mobile", "Address"];
  
    // Map the data into rows for the PDF
    const rows = data.map((item, index) => [
      index + 1,
      item.client_type || "N/A",
      item.client_code || "N/A",
      item.client_name || "N/A",
      item.client_email || "N/A",
      item.client_mobile || "N/A",
      item.client_address || "N/A",
    ]);
  
    // Set the number of rows per page
    const itemsPerPage = 20;
  
    // Function to generate a single page
    const generatePage = (pageRows, startIndex, endIndex) => {
      const pageData = pageRows.slice(startIndex, endIndex);
  
      doc.autoTable({
        head: [columns],
        body: pageData,
        startY: 20,
        didDrawPage: (data) => {
          const pageHeight = doc.internal.pageSize.height;
  
          // Footer on each page
          doc.setFontSize(10);
          doc.text(`Printed By: ${printedBy}`, 20, pageHeight - 20);
          doc.text(`Printed On: ${printedOn}`, 20, pageHeight - 10);
  
          // Page number
          const pageNumber = doc.internal.getNumberOfPages();
          doc.text(`Page ${pageNumber}`, doc.internal.pageSize.width - 40, pageHeight - 10);
        },
      });
    };
  
    // Loop to generate pages
    for (let i = 0; i < rows.length; i += itemsPerPage) {
      if (i !== 0) doc.addPage();
      generatePage(rows, i, i + itemsPerPage);
    }
  
    // Save the PDF
    doc.save("client_records.pdf");
  };

  const onClose = () => {
    setType("Add");
    setVisible(false);
  };

  // Table columns
  const columns = [
    "Id",
    "Type",
    "Code",
    "Name",
    "Email",
    "Mobile",
    "Address",
    "Action",
  ];

  
  return (
    <Container className="p-4">
      <Card className="mb-4 bg-light" style={{ boxShadow: "4px 4px 10px black " }}>
        <Card.Header className="bg-primary text-light">
          <h5 className="mb-0">CLIENTS</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <Button
                style={{ backgroundColor: "#007bff", color: "white", marginRight: "20px" }}
                onClick={handleOpen}
                className="mb-3 bg-info"
                size="vsm"
              >
                Add Client
              </Button>
              <Button
                style={{ backgroundColor: "#00bcd4", color: "white" }}
                onClick={exportPDF}
                className="mb-3 bg-success"
                size="vsm"
              >
                Print
              </Button>
            </Col>
          </Row>

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
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className="text-center bg-black h6 font-weight-bold py-1"
                    style={{
                      backgroundColor: "#00bcd4",
                      color: "white",
                      width: index === 0 ? "50px" : index === 1 ? "100px" : "150px",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ backgroundColor: "#17a1b0", color: "black" }}>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#cc7a00" : "#ffcc80",
                    }}
                  >
                    <td><b>{index + 1}</b></td>
                    <td>{item.client_type || "N/A"}</td>
                    <td>{item.client_code || "N/A"}</td>
                    <td>{item.client_name || "N/A"}</td>
                    <td>{item.client_email || "N/A"}</td>
                    <td>{item.client_mobile || "N/A"}</td>
                    <td>{item.client_address || "N/A"}</td>
                    <td>
                      <div style={{ display: "flex", gap: "1rem" }}>
                        <Button variant="primary" onClick={() => handleEdit(item)}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(item.client_id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center">
                    No Client Found
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

      <Modal show={visible} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {type === "Add" ? "Add Product" : "Edit Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {type === "Add" ? (
            <EditClient client={item} close={onClose} fetchData={fetchData} />
          ) : (
            <EditClient client={item} close={onClose} fetchData={fetchData} /> // Replace with the Edit form when available
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Clients;
