import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';

const EditProduct = ({ product, close, fetchData }) => {
  const [formData, setFormData] = useState({ ...product });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle save
  const handleSave = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
        const response = await fetch(`http://localhost:80/api/updateproducts`, {
            method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, id: product.id }), // Include the product ID
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        fetchData(); // Refresh the product list
        close(); // Close the modal
      } else {
        setErrorMessage(data.error || 'Failed to update product.');
      }
    } catch (error) {
      setErrorMessage('Error updating product: ' + error.message);
    }
  };

  const productOptions = [
    { id: 'gift', type_name: 'Gift' },
    { id: 'sample', type_name: 'Sample' },
  ];

  return (
    <Form onSubmit={handleSave}>
      <Form.Group controlId="productType" className="mb-2">
          <Form.Label>Product Type</Form.Label>
          <Form.Select
            name="product_type"
            value={formData.product_type}
            onChange={handleChange}
          >
            <option value="">Select Product Type</option>
            {productOptions.map((products) => (
              <option key={products.id} value={products.id}>
                {products.type_name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

      <Form.Group controlId="productName">
        <Form.Label>Product Name</Form.Label>
        <Form.Control
          type="text"
          name="product_name"
          value={formData.product_name}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="points">
        <Form.Label>Points</Form.Label>
        <Form.Control
          type="number"
          name="points"
          value={formData.points}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="bonus">
        <Form.Label>Bonus</Form.Label>
        <Form.Control
          type="number"
          name="bonous"
          value={formData.bonous}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="settlementPoints">
        <Form.Label>Settlement Points</Form.Label>
        <Form.Control
          type="number"
          name="points_on_settlement"
          value={formData.points_on_settlement}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="samplePoints">
        <Form.Label>Sample Points</Form.Label>
        <Form.Control
          type="number"
          name="points_on_sample"
          value={formData.points_on_sample}
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Save Changes
      </Button>
      <Button variant="secondary" onClick={close} className="ml-2">
        Cancel
      </Button>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
    </Form>
  );
};

export default EditProduct;
