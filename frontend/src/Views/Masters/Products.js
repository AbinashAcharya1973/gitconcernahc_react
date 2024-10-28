import React, { useEffect, useState } from "react";
import { Table, Container, Row, Col, Modal, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AddProduct from './Forms/AddProduct'; // Import the AddProduct form component

const Products = () => {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState("Add");
  const [data, setData] = useState([]);
  const [item, setItem] = useState({});
  const navigate = useNavigate();

  // Function to handle opening the modal for adding a new product
  const handleOpen = () => {
    setType("Add");
    setItem({});  // Ensure to reset item data when opening modal to add
    setVisible(true);
  };

  // Function to handle opening the modal for editing a product
  const handleEdit = (item) => {
    setType("Edit");
    setItem(item);
    setVisible(true);
  };

  // Function to handle deleting a product
  const handleDelete = (id) => {
    // Add API call to delete a product by id
    // Example:
    fetch(`/products/delete/${id}`, { method: 'DELETE' }).then(() => fetchData());
  };

  const onClose = () => {
    setType("Add");
    setVisible(false);
  };

  // Fetch product data from the backend
  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:80/api/products`);
      const dataReceive = await response.json();
      console.log(dataReceive);
      setData(dataReceive);
    } catch (error) {
      console.error("Error fetching product list:", error);
    }
  };

  const columns = [
    "Id",
    "Type",
    "Name",
    "Points",
    "Bonous"
  ];

  const finalData = data?.map((item, index) => {
    return {
      id: item.id,
      type: item.product_type, // type
      name: item.product_name, // name
      points: item.points,
      bonous: item.bonous,
      stock: item.stock,
      Action: (
        <div style={{ display: "flex", gap: "1rem" }}>
          <Button
            variant="primary"
            onClick={() => {
              handleEdit(item);
            }}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleDelete(item.id);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    };
  });
  console.log(finalData);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container>
      <Card
        className="mb-4 bg-light"
        style={{ boxShadow: "4px 4px 10px black " }}
      >
        <Card.Header className="bg-primary text-light">
          <h5 className="mb-0">PRODUCT</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <Button variant="success" onClick={handleOpen} className="mb-3">
                Add Product
              </Button>
            </Col>
          </Row>

          <Table striped bordered hover responsive variant="light">
            <thead style={{ backgroundColor: "black", color: "white" }}>
              <tr>
                {columns.map((col, index) => (
                  <th key={index} className="text-center bg-black  h6 font-weight-bold py-1"
                  style={{
                    backgroundColor: "#00bcd4",
                    color: "white",
                    width:
                      index === 0 ? "50px" : index === 1 ? "100px" : "150px",
                  }} // Adjust widths as needed
                  >{col}</th>
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
                    {/* <td>{item.Action}</td> */}
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

      <Modal show={visible} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {type === "Add" ? "Add Product" : "Edit Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {type === "Add" ? (
            <AddProduct close={onClose} fetchData={fetchData} />
          ) : (
            <p>Form for Editing Product</p> // Replace with the Edit form when available
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Products;
