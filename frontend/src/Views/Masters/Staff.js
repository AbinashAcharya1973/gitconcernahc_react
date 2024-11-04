import React, { useEffect, useState } from 'react'
import { Table, Container, Row, Col, Card } from 'react-bootstrap'
import { Modal, Button } from 'react-bootstrap';
import AddStaff from './Forms/AddStaff'

const SelectDropdown = ({ label, name, value, onChange, options }) => {
  return (
    <div className="mb-2">
      <label><strong>{label}:</strong></label>
      <select 
        name={name}
        value={value}
        onChange={onChange}
        className="form-control"
        required
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.designation} value={option.designation}>
            {option.designation} {/* Assuming option.usertype is the designation */}
          </option>
        ))}
      </select>
    </div>
  );
};

const Staff = () => {
  const [visible, setVisible] = useState(false)
  const [type, setType] = useState('Add')
  const [data, setData] = useState([])
  const [item, setItem] = useState({})
  const [formData, setFormData] = useState({
    usertype: '' // Track the selected designation
  });
  const [userOptions, setUserOptions] = useState([]); // For designation options

  const updateState = (newState) => {
    setType(newState)
  }

  const handleOpen = () => {
    setType('Add')
    setVisible(true)
  }

  const handleEdit = (item) => {
    setType('Edit')
    setItem(item)
    setVisible(true)
  }

  const handleDelete = (id) => {
    // Delete logic here
  }

  const onClose = () => {
    setType('Add')
    setVisible(false)
  }

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:80/api/staffs`)
      const dataReceive = await response.json()
      setData(dataReceive)
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
  }

  const fetchUserTypes = async () => {
    try {
      const response = await fetch('http://localhost:80/api/stafftypes');
      const dataReceive1 = await response.json();
      setUserOptions(dataReceive1);
    } catch (error) {
      console.error('Error fetching user types:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchUserTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value // Update selected designation
    }));
  };

  // Filter data based on selected designation
  const filteredData = formData.usertype
    ? data.filter((item) => item.designation.toLowerCase() === formData.usertype.toLowerCase())
    : data;

  const columns = ['Id', 'Designation', 'Code', 'Fullname', 'Mobile', 'Reporting To'];

  const finalData = filteredData?.map((item, index) => {
    const reportingStaff = data.find(staff => staff.id === item.reporting_id);
    return {
      id: item.id,
      designation: item.designation,
      code: item.code,
      fullname: item.fullname,
      mobile: item.mobile,
      reporting_to: item.reporting_to,
      
      Action: (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button
            variant="primary"
            onClick={() => handleEdit(item)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDelete(item._id)}
          >
            Delete
          </Button>
        </div>
      ),
    };
  });

  return (
    <>
      <Container>
        <Card className="mb-4 bg-light" style={{ boxShadow: "4px 4px 10px black " }}>
          <Card.Header className="bg-primary text-light">
            <h5 className="mb-0">STAFF</h5>
          </Card.Header>
          <Card.Body className="w-100 p-1">
            <Row>
              <Col>
                <SelectDropdown 
                  label="Designation" 
                  name="usertype" 
                  value={formData.usertype} 
                  onChange={handleChange} 
                  options={userOptions} // Pass fetched usertype options to the component
                />
              </Col>
              <Col className="d-flex justify-content-end">
                <Button
                  style={{ backgroundColor: "#00bcd4", color: "white" }}
                  onClick={handleOpen}
                  className="mb-3 bg-success"
                  size="sm"
                >
                  Add Staff
                </Button>
              </Col>
            </Row>

            <Table striped bordered hover responsive="light">
              <thead>
                <tr>
                  {columns.map((col, index) => (
                    <th key={index} className="text-center bg-black h6 font-weight-bold py-1"
                      style={{
                        backgroundColor: "#00bcd4",
                        color: "white",
                        width: index === 0 ? "30px" : index === 1 ? "50px" : "60px",
                      }}>
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
                      <td>{item.designation}</td>
                      <td>{item.code}</td>
                      <td>{item.fullname}</td>
                      <td>{item.mobile}</td>
                      <td>{item.reporting_to}</td>
                      {/* <td>{item.Action}</td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center">
                      No Staff Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        <Modal show={visible} onHide={onClose}>
          <Modal.Header closeButton>
            <Modal.Title>{type === 'Add' ? 'Add Staff' : 'Edit Staff'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddStaff close={onClose} fetchData={fetchData} />
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default Staff;
