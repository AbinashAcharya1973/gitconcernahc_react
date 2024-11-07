import React, { useState,useEffect } from 'react';
import { Table,Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
const VisitList = ({userId}) => {
    const [visitData, setVisitData] = useState([]);    
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [filteredVisits, setFilteredVisits] = useState([]);
    const navigate = useNavigate();
    const handleViewDetails = (visitId) => {
      navigate(`/visitdetails/${visitId}`);
    };
    useEffect(() => {
        const fetchVisitByClient = async (cid) => {
            try{    
              const response = await fetch("http://localhost:80/api/clientvisit_ad/"+userId)
              if(!response.ok) throw new Error("Failed to get clients");
              const data=await response.json();
              setVisitData(data);
              setFilteredVisits(data);
            } catch(err){
              console.error("Error fetching Clients",err.message);  
            }
          };
    
          fetchVisitByClient();        
      }, []);
      useEffect(() => {
        filterVisitsByDate();
      }, [fromDate, toDate, visitData]);
    
      const filterVisitsByDate = () => {
        const filtered = visitData.filter(visit => {
          const visitDate = new Date(visit.v_date);
          const start = fromDate ? new Date(fromDate) : null;
          const end = toDate ? new Date(toDate) : null;
          
          return (!start || visitDate >= start) && (!end || visitDate <= end);
        });
        setFilteredVisits(filtered);
      };
    return(
        <div className="container">
            <h2 className="my-3">Visit Report</h2>
            <div className="row mt-3">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>From Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>To Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>
            <Table striped bordered hover>
            <thead>
              <tr>
                <th>VID</th>
                <th>Date</th>
                <th>Visit Time</th>
                <th>Visted By</th>
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
                  <td>{visit.id}</td>
                  <td>{visit.v_date}</td>
                  <td>{visit.v_time}</td>
                  <td>{visit.sname}</td>
                  <td>{visit.tcpoints}</td>
                  <td>{visit.tsp}</td>
                  <td>{visit.tcbp}</td>
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
}
export default VisitList;