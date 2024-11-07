import React, { useEffect, useState } from "react";
import { Container, Table, Alert } from "react-bootstrap";

const VisitDetails = ({ visitId }) => {
  const [visitDetails, setVisitDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visitId) {
      fetchVisitDetails(visitId);
    }
  }, [visitId]);

  const fetchVisitDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:80/api/getvisitdetails/${id}`);
      if (!response.ok) throw new Error("Failed to fetch visit details");
      const data = await response.json();
      setVisitDetails(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container>
      <h2>Visit Details</h2>
      {error ? (
        <Alert variant="danger">Error: {error}</Alert>
      ) : visitDetails ? (
        
        <Table bordered striped hover>
          <thead>
            <tr>
              <th>VID</th>
              <th>PID</th>
              <th>Description</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Points</th>
              <th>Bonus</th>
            </tr>
          </thead>
          <tbody>
            {visitDetails.length>0?(
              visitDetails.map((visit, index) => (
                <tr key={index}>
                  <td>{visit.VID}</td>
                  <td>{visit.PID}</td>
                  <td>{visit.description}</td>
                  <td>{visit.product}</td>
                  <td>{visit.qty}</td>
                  <td>{visit.points}</td>
                  <td>{visit.bonus}</td>
                </tr>
              ))
            ):(
              <tr>
                <td colSpan="6">No visit details available.</td>
              </tr>
            )}            
          </tbody>
        </Table>
        
      ) : (
        <Alert variant="info">Select a visit to view details.</Alert>
      )}
    </Container>
  );
};

export default VisitDetails;
