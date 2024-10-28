import React, { useState,useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import AddVisit from './Form/AddVisit'; // Import the AddVisit component
import { useParams } from 'react-router-dom';
const VisitList = ({userId}) => {
  const [showAddVisit, setShowAddVisit] = useState(false);
  const [visitData, setVisitData] = useState([]);
  // const {userId} = useParams();
  

  const handleAddVisitClick = () => {
    setShowAddVisit(true); // Show Add Visit form
  };

  const handleCloseAddVisit = () => {
    setShowAddVisit(false); // Close Add Visit form
  };

  useEffect(() => {
    const fetchVisitData = async () => {
      // Replace this with your API endpoint to fetch stock data
      const response = await fetch('http://localhost:80/api/visithead');
      const data = await response.json();
      setVisitData(data); // Assuming data is an array of stock objects
    };

    fetchVisitData();
  }, []);

  // const handleFormSubmit = (formData) => {
  //   // Update the visit data state with new form data
  //   setVisitData([...visitData, formData]);
  //   handleCloseAddVisit(); // Close form after submission
  // };

  return (
    <div className="container">
      {!showAddVisit ? (
        <>
          <h2 className="my-3">Visit List</h2>
          <Button variant="primary" className="mb-3" onClick={handleAddVisitClick}>
            Add Visit
          </Button>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Visit Time</th>
                <th>Total Coupon Collected</th>
                <th>Total Settlement</th>
                <th>Total Sample</th>
              </tr>
            </thead>
            <tbody>
              {/* Render rows dynamically from visitData */}
              {visitData.map((visit, index) => (
                <tr key={index}>
                  <td>{visit.date}</td>
                  <td>{visit.time}</td>
                  <td>{visit.total_coupon_collected}</td>
                  <td>{visit.total_settlement}</td>
                  <td>{visit.total_sample_given}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      ) : (
        // <AddVisit onFormSubmit={handleFormSubmit} onClose={handleCloseAddVisit} />
        <AddVisit onClose={handleCloseAddVisit} id={userId} />
      )}
    </div>
  );
};

export default VisitList;
