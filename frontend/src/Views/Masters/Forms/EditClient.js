import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';

const EditClient = ({ client, close, fetchData}) => {
  const [formData, setFormData] = useState({ ...client });
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

  // Handle file input change
  // const handleFileChange = (e) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     client_image: e.target.files[0], // Assuming only one image file
  //   }));
  // };

  // Handle save
  const handleSave = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if(key !== 'client_image'){
        formDataToSend.append(key, formData[key]);
      }
      
    });

    try {
      const response = await fetch(`http://localhost:80/api/updateclients`, {
        method: 'POST',
        body: formDataToSend, // Send FormData for file upload
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        fetchData(); // Refresh the client list
        close(); // Close the modal
      } else {
        setErrorMessage(data.error || 'Failed to update client.');
      }
    } catch (error) {
      setErrorMessage('Error updating client: ' + error.message);
    }
  };

  const clientOptions = [
    { id: 'doctor', type_name: 'doctor' },
    { id: 'Retailer', type_name: 'Retailer' },
    { id: 'Dairy Farm', type_name: 'Dairy Farm' }
  ];

  return (
    <Form onSubmit={handleSave}>
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
        <Form.Control type="email" name="client_email" value={formData.client_email} onChange={handleChange} />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label><b>Mobile</b></Form.Label>
        <Form.Control type="text" name="client_mobile" value={formData.client_mobile} onChange={handleChange} required />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label><b>Address</b></Form.Label>
        <Form.Control type="text" name="client_address" value={formData.client_address} onChange={handleChange} required />
      </Form.Group>

      {/* <Form.Group className="mb-2">
        <Form.Label><b>Client Image</b></Form.Label>
        <Form.Control type="file" name="client_image" onChange={handleFileChange} />
      </Form.Group> */}

      <Button variant="primary" type="submit" className="mt-2">Save Changes</Button>
      <Button variant="secondary" onClick={close} className="ml-2">Cancel</Button>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
    </Form>
  );
};

export default EditClient;
