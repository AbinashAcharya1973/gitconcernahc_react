import React, { useEffect, useState } from "react";
import {
  Table,
  Container,
  Row,
  Col,
  Modal,
  Button,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AddClient from "./Forms/AddClient";

const Clients = () => {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState("Add");
  const [data, setData] = useState([]);
  const [item, setItem] = useState({});
  const navigate = useNavigate();

  // Function to handle opening the modal for adding a new Client
  const handleOpen = () => {
    navigate("/master/clients/add");
  };

  // Function to handle opening the modal for editing a client
  const handleEdit = (item) => {
    setType("Edit");
    setItem(item);
    setVisible(true);
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

  const onClose = () => {
    setType("Add");
    setVisible(false);
  };

  // Fetch Client data from the backend
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:80/api/clients");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const dataReceived = await response.json();
      console.log(dataReceived); // Debugging: Ensure the data is received correctly
      setData(dataReceived);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Table columns
  const columns = [
    "Id",
    "Type",
    "Code",
    "Name",
    "Email",
    "Mobile",
    "Address",
    // "Image",
  ];

  // Mapping data to table rows
  const finalData = Array.isArray(data)
    ? data.map((item, index) => {
        return {
          Id: item.id ||index+1 ,
          Type: item.client_type || "N/A",
          Code: item.client_code || "N/A",
          Name: item.client_name || "N/A",
          Email: item.client_email || "N/A",
          Mobile: item.client_mobile || "N/A",
          Address: item.client_address || "N/A",
          // Image: item.client_image || "No Image",
          // Action: (
          //   <div style={{ display: "flex", gap: "1rem" }}>
          //     <Button variant="primary" onClick={() => handleEdit(item)}>
          //       Edit
          //     </Button>
          //     <Button variant="danger" onClick={() => handleDelete(item.id)}>
          //       Delete
          //     </Button>
          //   </div>
          //  ),
        };
      })
    : [];

  return (
    <Container className="p-4">
      <Card
        className="mb-4 bg-light"
        style={{ boxShadow: "4px 4px 10px black " }}
      >
        <Card.Header className="bg-primary text-light">
          <h5 className="mb-0">CLIENT</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <Button
                style={{ backgroundColor: "#00bcd4", color: "white" }}
                onClick={handleOpen}
                className="mb-3 bg-success"
                size="vsm">
                Add Client
              </Button>
            </Col>
          </Row>

          <Table striped bordered hover responsive variant="light">
            <thead style={{ backgroundColor: "black", color: "white" }}>
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className="text-center bg-black  h6 font-weight-bold py-1"
                    style={{
                      backgroundColor: "#00bcd4",
                      color: "white",
                      width:
                        index === 0 ? "50px" : index === 1 ? "100px" : "150px",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ backgroundColor: "#17a1b0", color: "black" }}>
              {finalData.length > 0 ? (
                finalData.map((item, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#cc7a00" : "#ffcc80",
                    }}
                  >
                    <td><b>{item.Id}</b></td>
                    <td>{item.Type}</td>
                    <td>{item.Code}</td>
                    <td>{item.Name}</td>
                    <td>{item.Email}</td>
                    <td>{item.Mobile}</td>
                    <td>{item.Address}</td>
                    {/* <td>
                      {item.Image !== "No Image" ? (
                        <img src={item.Image} alt="Client" width={50} />
                      ) : (
                        "No Image"
                      )}
                    </td> */}
                     {/* <td>{item.Action}</td>  */}
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

      {/* Modal for Add/Edit Client */}
      {/* <Modal show={visible} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {type === "Add" ? "Add Client" : "Edit Client"}
          </Modal.Title>
        {/* </Modal.Header> */}
        {/* <Modal.Body>
          {type === "Add" ? (
            <AddClient onClose={onClose} />
          ) : (
            <p>Form for Editing Client</p> // Replace this with your EditClient form
          )}
        </Modal.Body>
      </Modal> */}
    </Container> 
  );
};

export default Clients;
