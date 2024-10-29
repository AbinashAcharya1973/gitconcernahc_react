import React, { useState,useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
// import { post } from '../../../api/Api'
// import { toast } from 'react-toastify'

const AddStaff = ({ close, fetchData }) => {
  const [formData, setFormData] = useState({
    code: '',
    designation: '',
    fullname: '',
    mobile:'',
    reporting_id:0,
    reporting_to: ''
  })

  const [staffOptions, setStaffOptions] = useState([]);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await fetch('http://localhost:80/api/staffs');  // Replace with your backend endpoint
        const data = await response.json();
        setStaffOptions(data);  // Save the fetched data to the staffOptions state
      } catch (error) {
        console.error('Error fetching staff data:', error);
      }
    };

    fetchStaffData();
  }, []); 
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // console.dir(formData)
  }

  const handleReportingChange = (e) => {
    const selectedId = e.target.value;
    const selectedStaff = staffOptions.find(staff => staff.id === parseInt(selectedId));  // Find the staff object

    // Update both reporting_id and reporting_to
    setFormData({
      ...formData,
      // reporting_id:formData.code,
      reporting_id: selectedId,
      reporting_to: selectedStaff ? selectedStaff.fullname : ''
    });
    
  };

  const handleSubmit = (e) => {
    e.preventDefault()

    fetch('http://localhost:80/api/addstaffs', {
      method: 'POST', // Specify the method as POST
      headers: {
        'Content-Type': 'application/json' // Ensure the data being sent is JSON
      },
      body: JSON.stringify({
        code: formData.code,
    designation: formData.designation,
    fullname: formData.fullname,
    mobile:formData.mobile,
    reporting_id:formData.reporting_id,
    reporting_to:formData.reporting_to
        // name: 'John Doe', // Replace with actual staff data
        // position: 'Manager', // Replace with actual staff position
        // department: 'HR' // Replace with actual staff department
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse JSON from the response
      })
      .then(data => {
        console.log('Staff added successfully:', data); // Log the success message and staffId
        setFormData({
          code: '',
          designation: '',
          fullname: '',
          mobile: '',
          reporting_id: 0,
          reporting_to: ''
        });
  
        fetchData();
        close();
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error); // Handle any errors
      });
      


    // post('/staff/add', formData).then((data) => {
    //   fetchData()
    //   if (data.message) {
    //     toast.success('Staff Added Successfully', {
    //       position: 'top-right',
    //     })
    //     close()
    //   }
    // })
    console.log(formData)
  }

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
  onChange={handleReportingChange}
  required
>
  <option value="">Select an option</option>
  {/* Dynamically generate options based on fetched staff data */}
  {staffOptions.map((staff) => (
  
          <option key={staff.id} value={staff.id}>
            {staff.fullname}
          </option>
        ))}
  
  
      </Form.Select>
      </Form.Group>
      <Button variant="primary" type="submit">
        Add Staff
      </Button>
    </Form>
  )
}

export default AddStaff
