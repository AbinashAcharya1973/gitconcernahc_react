import React, { useEffect, useState } from "react";
import {
  Table,
  Container,
  Row,
  Col,
  Button,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Clients = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // Function to navigate to the Add Client page
  const handleOpen = () => {
    navigate("/master/clients/add");
  };

  // Function to handle deleting a client
  const handleDelete = async (id) => {
    try {
      await fetch(`/client/delete/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Failed to delete client:", error);
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

  // Function to export table data to PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Client Records", 20, 10);

    const columns = ["Id", "Type", "Code", "Name", "Email", "Mobile", "Address"];
    const rows = data.map((item, index) => [
      index + 1,
      item.client_type || "N/A",
      item.client_code || "N/A",
      item.client_name || "N/A",
      item.client_email || "N/A",
      item.client_mobile || "N/A",
      item.client_address || "N/A",
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 20,
    });

    doc.save("client_records.pdf");
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
          <h5 className="mb-0">CLIENT</h5>
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
              {data.length > 0 ? (
                data.map((item, index) => (
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
                        <Button variant="danger" onClick={() => handleDelete(item.id)}>
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
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Clients;
