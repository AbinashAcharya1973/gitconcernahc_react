import React, { useState,useEffect } from 'react';
import { Button, Table,Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const VisitList = ({userId}) => {  
  const [visitData, setVisitData] = useState([]);
  const [Clients,setClients]=useState([]);
  const [selectedClientId,setselectedClientId]=useState("");
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filteredVisits, setFilteredVisits] = useState([]);
  const navigate = useNavigate();
  const handleViewDetails = (visitId) => {
    navigate(`/visitdetails/${visitId}`);
  };
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

  useEffect(() => {
    const fetchVisitData = async () => {
      // Replace this with your API endpoint to fetch stock data
      const response = await fetch('http://localhost:80/api/visithead/'+userId);
      const data = await response.json();
      setVisitData(data); 
      setFilteredVisits(data)// Assuming data is an array of stock objects
    };

    fetchVisitData();
    fetchClients();
  }, []);
  // Update the filtered visit list when date changes
  useEffect(() => {
    filterVisitsByDate();
  }, [fromDate, toDate, visitData]);

  const filterVisitsByDate = () => {
    const filtered = visitData.filter(visit => {
      const visitDate = new Date(visit.date);
      const start = fromDate ? new Date(fromDate) : null;
      const end = toDate ? new Date(toDate) : null;
      
      return (!start || visitDate >= start) && (!end || visitDate <= end);
    });
    setFilteredVisits(filtered);
  };
const handleSelectClients = (event) => {
  const clientId = event.target.value;
  setselectedClientId(clientId);  
  fetchVisitByClient(event.target.value);
};
const fetchVisitByClient = async (cid) => {
  try{    
    const response = await fetch("http://localhost:80/api/clientvisit/"+cid)
    if(!response.ok) throw new Error("Failed to get clients");
    const data=await response.json();
    setVisitData(data);
    setFilteredVisits(data);
  } catch(err){
    console.error("Error fetching Clients",err.message);  
  }
};
  // const handleFormSubmit = (formData) => {
  //   // Update the visit data state with new form data
  //   setVisitData([...visitData, formData]);
  //   handleCloseAddVisit(); // Close form after submission
  // };

  return (
    <div className="container">
      
          <h2 className="my-3">Visit List</h2>
          <div className="row">
            <div className='col-md-4'>
              <Form.Label>Select Doctor/Client</Form.Label>
              <Form.Control
                as='select'
                value={selectedClientId}
                onChange={handleSelectClients}>
                    <option value="">Select Client</option>
                    {Clients.map((client)=>(
                        <option key={client.id} value={client.client_id}>
                            {client.client_name}
                        </option>
                    ))}
              </Form.Control>
            </div>
            <div className='col-md-4'>
              <Form.Label>From Date</Form.Label>
              <Form.Control type='Date' value={fromDate} onChange={(e) => setFromDate(e.target.value)}/>
            </div>
            <div className='col-md-4'>
              <Form.Label>To Date</Form.Label>
              <Form.Control type='Date' value={toDate} onChange={(e) => setToDate(e.target.value)}/>
            </div>

          </div>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Visit Time</th>
                <th>Visted To</th>
                <th>Total Coupon Collected</th>
                <th>Total Settlement</th>
                <th>Total Sample</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* Render rows dynamically from visitData */}
              {Array.isArray(filteredVisits) && filteredVisits.length > 0 ? (
              filteredVisits.map((visit, index) => (
                <tr key={index}>
                  <td>{visit.date}</td>
                  <td>{visit.time}</td>
                  <td>{visit.fullname}</td>
                  <td>{visit.total_coupon_collected}</td>
                  <td>{visit.total_settlement}</td>
                  <td>{visit.total_sample_given}</td>
                  <td><button onClick={() => handleViewDetails(visit.id)}>Details</button></td>
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
