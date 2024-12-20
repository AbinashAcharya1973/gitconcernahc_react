import React, { useEffect, useState } from 'react'
import { Table, Container, Row, Col, Card,Pagination } from 'react-bootstrap'
import { Modal, Button } from 'react-bootstrap';
import AddStaff from './Forms/AddStaff'
import EditStaff from './Forms/EditStaff';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page


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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        const response = await fetch(`http://localhost:80/api/deleteStaff/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          
          },
        });
  
        if (response.ok) {
          alert('Staff deleted successfully!');
          fetchData(); // Refresh data after deletion
        } else {
          const errorData = await response.json();
          console.error('Error deleting staff:', errorData);
          alert(`Failed to delete staff: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error while calling the delete API:', error);
        alert('A network error occurred while deleting the staff.');
      }
    }
  };
  
  

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

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ['Id', 'Designation', 'Code', 'Fullname', 'Mobile', 'Reporting To'];
    const tableRows = filteredData.map(item => [
      item.id,
      item.designation,
      item.code,
      item.fullname,
      item.mobile,
      item.reporting_to,
    ]);

    doc.text('Staff Report', 14, 10);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('Staff_Report.pdf');
  };


  const columns = ['Id', 'Designation', 'Code', 'Fullname', 'Mobile', 'Reporting To','Action'];

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
            onClick={() => handleDelete(item.id)}
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
          <Card.Body >
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
                <Button
                  variant="primary"
                  className="ms-2 mb-3"
                  onClick={exportPDF}
                >
                  Export PDF
                </Button>
              </Col>
            </Row>

            {/* Rows Per Page Dropdown */}
            <div className="d-flex justify-content-end align-items-center mb-3">
              <label htmlFor="rowsPerPage" className="me-2">
                Rows Per Page:
              </label>
              <select
                id="rowsPerPage"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to the first page on changing rows per page
                }}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            <Table striped bordered hover responsive variant="light">
              <thead style={{ backgroundColor: "black", color: "white" }}>
                <tr>
                  {columns.map((col, index) => (
                    <th key={index} className="text-center bg-black h6 font-weight-bold py-1"
                      style={{
                        backgroundColor: "#00bcd4",
                        color: "white",
                        width: index === 0 ? "50px" : index === 1 ? "100px" : "150px",
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
                      <td>{item.Action}</td>
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

            {/* Pagination */}
            <Pagination className="justify-content-center mt-3">
              <Pagination.Prev onClick={handlePreviousPage} disabled={currentPage === 1}>
                Previous
              </Pagination.Prev>
              <Pagination.Item active>{currentPage}</Pagination.Item>
              <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
              </Pagination.Next>
            </Pagination>
          </Card.Body>
        </Card>

        <Modal show={visible} onHide={onClose}>
          <Modal.Header closeButton>
            <Modal.Title>{type === 'Add' ? 'Add Staff' : 'Edit Staff'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {type === 'Add' ?(<AddStaff close={onClose} fetchData={fetchData} />):(<EditStaff staff={item} close={onClose} fetchData={fetchData} />)}   
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default Staff;
