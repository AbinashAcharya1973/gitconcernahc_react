import React, { useState,useEffect } from 'react';
import { Button, Table,Form } from 'react-bootstrap';

import { useParams } from 'react-router-dom';
const VisitList = ({userId}) => {
  const [showAddVisit, setShowAddVisit] = useState(false);
  const [visitData, setVisitData] = useState([]);
  const [Clients,setClients]=useState([]);
  const [selectedClientId,setselectedClientId]=useState("");
  // const {userId} = useParams();
  
  const fetchClients = async () =>{
    try{
        const response = await fetch("http://localhost:80/api/getvsoclients/"+userId)
        if(!response.ok) throw new Error("Failed to get clients");
        const data=await response.json();
        setClients(data);
    } catch(err){
        console.error("Error fetching Clients",err.message);
    }
};
  const handleAddVisitClick = () => {
    setShowAddVisit(true); // Show Add Visit form
  };

  const handleCloseAddVisit = () => {
    setShowAddVisit(false); // Close Add Visit form
  };

  useEffect(() => {
    const fetchVisitData = async () => {
      // Replace this with your API endpoint to fetch stock data
      const response = await fetch('http://localhost:80/api/visithead/'+userId);
      const data = await response.json();
      setVisitData(data); // Assuming data is an array of stock objects
    };

    fetchVisitData();
    fetchClients();
  }, []);

  // const handleFormSubmit = (formData) => {
  //   // Update the visit data state with new form data
  //   setVisitData([...visitData, formData]);
  //   handleCloseAddVisit(); // Close form after submission
  // };

  return (
    <div className="container">
      
          <h2 className="my-3">Visit List</h2>
          
          <Form.Label>Select Doctor/Client</Form.Label>
          <Form.Control
            as='select'
            value={selectedClientId}
            onChange={(e)=>setselectedClientId(e.target.value)}>
                <option value="">Select Client</option>
                {Clients.map((client)=>(
                    <option key={client.id} value={client.client_id}>
                        {client.client_name}
                    </option>
                ))}
          </Form.Control>
          

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Visit Time</th>
                <th>Visted To</th>
                <th>Total Coupon Collected</th>
                <th>Total Settlement</th>
                <th>Total Sample</th>
              </tr>
            </thead>
            <tbody>
              {/* Render rows dynamically from visitData */}
              {Array.isArray(visitData) && visitData.length > 0 ? (
              visitData.map((visit, index) => (
                <tr key={index}>
                  <td>{visit.date}</td>
                  <td>{visit.time}</td>
                  <td>{visit.fullname}</td>
                  <td>{visit.total_coupon_collected}</td>
                  <td>{visit.total_settlement}</td>
                  <td>{visit.total_sample_given}</td>
                </tr>
              ))
              ):(
                <tr>
                  <td colSpan="6">No data available</td>
                </tr>
              )}
            </tbody>
          </Table>
        
      
    </div>
  );
};

export default VisitList;
