import React, { useState } from "react";
import { Form, Button, Alert, Container, Card } from "react-bootstrap";

const AddClient = ({ close, fetchData }) => {
  const [formData, setFormData] = useState({
    client_type: '',
    client_code: '',
    client_name: '',
    client_email: '',
    client_mobile: '',
    client_address: '',
    client_image: '',
  });

  const [successMessage, setSuccessMessage] = useState("");

  const clientOptions = [
    { id: "doctor", type_name: "Doctor" },
    { id: "retailer", type_name: "Retailer" },
    { id: "dairyFarm", type_name: "Dairy Farm" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:80/api/addclient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);

        // Reset form fields
        setFormData({
          client_type: '',
          client_code: '',
          client_name: '',
          client_email: '',
          client_mobile: '',
          client_address: '',
          client_image: '',
        });

        // Refresh client list and close modal
        fetchData();
        close();
      } else {
        console.error("Error adding client:", data.error);
      }
    } catch (error) {
      console.error("Error submitting client:", error);
    }
  };

  return (
    <Container >
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label><b>Client Type</b></Form.Label>
            <Form.Select name="client_type" value={formData.client_type} onChange={handleChange} required>
              <option value="">Select Client Type</option>
              {clientOptions.map((client) => (
                <option key={client.id} value={client.id}>{client.type_name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label><b>Client Code</b></Form.Label>
            <Form.Control type="text" name="client_code" value={formData.client_code} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label><b>Client Name</b></Form.Label>
            <Form.Control type="text" name="client_name" value={formData.client_name} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label><b>Email</b></Form.Label>
            <Form.Control type="email" name="client_email" value={formData.client_email} onChange={handleChange}  />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label><b>Mobile</b></Form.Label>
            <Form.Control type="text" name="client_mobile" value={formData.client_mobile} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label><b>Address</b></Form.Label>
            <Form.Control type="text" name="client_address" value={formData.client_address} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label><b>Client Image</b></Form.Label>
            <Form.Control type="file" name="client_image" value={formData.client_image} onChange={handleChange} />
          </Form.Group>

          <Button type="submit" className="mt-2">Submit</Button>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
        </Form>
    </Container>
  );
};

export default AddClient;
