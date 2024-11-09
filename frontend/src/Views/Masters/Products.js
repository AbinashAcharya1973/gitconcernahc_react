import React, { useEffect, useState } from "react";
import { Table, Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Products = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // Assume "Printed By" info is stored in localStorage/sessionStorage
  const printedBy = localStorage.getItem("userName") || "Admin"; // Replace with actual logic if needed
  const currentDateTime = new Date();
  const printedOn = currentDateTime.toLocaleString();

  // Function to navigate to Add Product page
  const handleOpen = () => {
    navigate("/products/add");
  };

  // Function to navigate to Edit Product page with product data
  const handleEdit = (item) => {
    navigate(`/products/edit/${item.id}`, { state: { product: item } });
  };

  // Function to delete a product
  const handleDelete = async (id) => {
    try {
      await fetch(`/products/delete/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  // Fetch product data from the backend
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:80/api/products");
      const dataReceived = await response.json();
      setData(dataReceived);
    } catch (error) {
      console.error("Error fetching product list:", error);
    }
  };

  // Function to export table data to PDF
  const exportPDF = () => {
    const doc = new jsPDF();
  
    // Set PDF title
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

    // Generate the table
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 20,
      didDrawPage: (data) => {
        const pageHeight = doc.internal.pageSize.height;
        const printedBy = "Staff Name"; // Replace with dynamic name if needed
        const printedOn = new Date().toLocaleString();
  
        // Footer text on every page
        doc.setFontSize(10);
        doc.text(`Printed By: ${printedBy}`, 20, pageHeight - 20);
        doc.text(`Printed On: ${printedOn}`, 20, pageHeight - 10);
      }
    });
  
    // Save PDF file
    doc.save("Product_Records.pdf");
  };
  const columns = [
    "Id",
    "Type",
    "Name",
    "Points",
    "Bonus",
    "Settlement Points",
    "Sample Points",
    "Action"
  ];

  const finalData = data.map((item, index) => ({
    id: item.id,
    type: item.product_type,
    name: item.product_name,
    points: item.points,
    bonous: item.bonous,
    settlementPoints: item.points_on_settlement,
    samplePoints: item.points_on_sample,
    Action: (
      <div style={{ display: "flex", gap: "1rem" }}>
        <Button variant="primary" onClick={() => handleEdit(item)}>
          Edit
        </Button>
        <Button variant="danger" onClick={() => handleDelete(item.id)}>
          Delete
        </Button>
      </div>
    )
  }));

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container>
      <Card className="mb-4 bg-light" style={{ boxShadow: "4px 4px 10px black " }}>
        <Card.Header className="bg-primary text-light">
          <h5 className="mb-0">PRODUCTS</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <Button variant="success" onClick={handleOpen} className="mb-3">
                Add Product
              </Button>
              <Button variant="info" onClick={exportPDF} className="mb-3">
              Print          
               </Button>
            </Col>
          </Row>

          <Table striped bordered hover responsive variant="light">
            <thead style={{ backgroundColor: "black", color: "white" }}>
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className="text-center h6 font-weight-bold py-1"
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      width: index === 0 ? "50px" : index === 1 ? "100px" : "150px"
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {finalData.length > 0 ? (
                finalData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.type}</td>
                    <td>{item.name}</td>
                    <td>{item.points}</td>
                    <td>{item.bonous}</td>
                    <td>{item.settlementPoints}</td>
                    <td>{item.samplePoints}</td>
                    <td>{item.Action}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center">
                    No Products Found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Products;
