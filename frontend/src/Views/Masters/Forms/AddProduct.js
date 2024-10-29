import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const AddProduct = ({ close, fetchData }) => {
  const [formData, setFormData] = useState({
    product_type: '',
    product_name: '',
    points: 0,
    bonous: 0,
    points_on_settlement: 0,
    points_on_sample: 0
  });

  const [successMessage, setSuccessMessage] = useState('');

  const productOptions = [
    { id: 'gift', type_name: 'Gift' },
    { id: 'sample', type_name: 'Sample' },
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
      const response = await fetch('http://localhost:80/api/addproducts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);

        setFormData({
          product_type: '',
          product_name: '',
          points: 0,
          bonous: 0,
          points_on_settlement: 0,
          points_on_sample: 0
        });

        fetchData();
        close();  // Close the modal after successfully adding the product
      } else {
        console.error('Error adding product:', data.error);
      }
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Product Type</Form.Label>
          <Form.Select
            name="product_type"
            value={formData.product_type}
            onChange={handleChange}
            
          >
            <option value="">Select Product Type</option>
            {productOptions.map((product) => (
              <option key={product.id} value={product.id}>
                {product.type_name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Points</Form.Label>
          <Form.Control
            type="number"
            name="points"
            value={formData.points}
            onChange={handleChange}
           
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Bonus</Form.Label>
          <Form.Control
            type="text"
            name="bonous"
            value={formData.bonous}
            onChange={handleChange}
            
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Points On Settlement</Form.Label>
          <Form.Control
            type="text"
            name="points_on_settlement"
            value={formData.points_on_settlement}
            onChange={handleChange}
            
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Points On Sample</Form.Label>
          <Form.Control
            type="text"
            name="points_on_sample"
            value={formData.points_on_sample}
            onChange={handleChange}
            
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Add Product
        </Button>
      </Form>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
    </>
  );
};

export default AddProduct;
