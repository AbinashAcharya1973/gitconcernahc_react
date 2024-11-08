import React, { useState, useEffect } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';

const EditStaff = ({ staff, close, fetchData }) => {
  const [formData, setFormData] = useState({ ...staff });
  const [staffOptions, setStaffOptions] = useState([]); // State for staff options
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch staff options on component mount
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await fetch('http://localhost:80/api/staffs');
        const data = await response.json();
        setStaffOptions(data);
      } catch (error) {
        console.error('Error fetching staff data:', error);
      }
    };

    fetchStaffData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:80/api/updatestaffs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, id: staff.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        fetchData(); // Refresh the staff list
        close(); // Close the modal
      } else {
        setErrorMessage(data.error || 'Failed to update staff.');
      }
    } catch (error) {
      setErrorMessage('Error updating staff: ' + error.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-2">
        <Form.Label>EmpCode</Form.Label>
        <Form.Control
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Designation</Form.Label>
        <Form.Select
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          required
        >
          <option value="">Select an option</option>
          <option value="VSO">VSO</option>
          <option value="Manager">Manager</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Mobile</Form.Label>
        <Form.Control
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Report To</Form.Label>
        <Form.Select
          name="reporting_id"
          value={formData.reporting_id}
          onChange={handleChange}
          required
        >
          <option value="">Select an option</option>
          {staffOptions.map((staff) => (
            <option key={staff.id} value={staff.id}>
              {staff.fullname}
            </option>
          ))}
        </Form.Select>
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

export default EditStaff;
