import React, { useState,useEffect } from 'react';
import { Button, Table,Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
const VisitReport = ({userId}) => {
    const [Staffs,setStaffs]=useState([]);
    const [Clients,setClients]=useState([]);
    const [Visits,setVisits]=useState([]);
    const [FilteredVisit,setFilteredVisit]=useState([]);
    const [selectedClientId,setselectedClientId]=useState("");
    const [selectedStaffId,setselectedStaffId]=useState("");
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const navigate = useNavigate();
    const handleViewDetails = (visitId) => {
        navigate(`/visitdetails/${visitId}`);
    };
    const getStafflist  = async () =>{
        const response = await fetch(`http://localhost:80/api/getjuniorstafflist/${userId}`);
        const data = await response.json();
        setStaffs(data);
    }
    const getClientlist  = async (vsoid) =>{
        const response = await fetch(`http://localhost:80/api/getvsoclients/${vsoid}`);
        const data = await response.json();
        setClients(data);
    }
    const getClientVisit  = async (clientid) =>{
        const response = await fetch(`http://localhost:80/api/clientvisit/${clientid}`);
        const data = await response.json();
        setVisits(data);
        setFilteredVisit(data);
    }
    const getVSOVisit  = async (vsoid) =>{
        const response = await fetch(`http://localhost:80/api/getvisitbyvso/${vsoid}`);
        const data = await response.json();
        setVisits(data);
        setFilteredVisit(data);
    }
    useEffect(()=>{
        getStafflist();
        //getClientlist();
    },[]);
    useEffect(() => {
        filterVisitsByDate();
      }, [fromDate, toDate, Visits]);
    
      const filterVisitsByDate = () => {
        if(Visits.length > 0){
        const filtered = Visits.filter(visit => {
          const visitDate = new Date(visit.date);
          const start = fromDate ? new Date(fromDate) : null;
          const end = toDate ? new Date(toDate) : null;
          
          return (!start || visitDate >= start) && (!end || visitDate <= end);
        });
        setFilteredVisit(filtered);
        }
      };
    const handleSelectstaff = (e)=>{
        setselectedStaffId(e.target.value);
        getClientlist(e.target.value);
        getVSOVisit(e.target.value);
    };
    const handleSelectClient = (e)=>{
        setselectedClientId(e.target.value);
        getClientVisit(e.target.value);
    };
    return(
        <div className="container">
            <h2 className="my-3">Visit Report</h2>
            <div className="row">
                <div className="col-md-12">
                    <Form.Label>Select VSO</Form.Label>
                    <Form.Control
                    as='select'
                    value={selectedStaffId}
                    onChange={handleSelectstaff}>  
                        <option value="">Select VSO</option>                      
                        {Staffs.map((staff)=>(
                            <option key={staff.id} value={staff.id}>
                                {staff.fullname}
                            </option>
                        ))}
                    </Form.Control>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <Form.Label>Select Client/Doctor</Form.Label>
                    <Form.Control
                    as="select"
                    value={selectedClientId}
                    onChange={handleSelectClient}
                    >
                        <option value="">Select Client/Doctor</option>
                        {Clients.length > 0 ?(
                        Clients.map((client)=>(
                            <option key={client.client_id} value={client.client_id}>
                                {client.client_name}
                            </option>
                        ))
                        ):(null)}
                    </Form.Control>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <Form.Label>From Date</Form.Label>
                    <Form.Control type='Date' value={fromDate} onChange={(e) => setFromDate(e.target.value)}/>
                </div>
                <div className="col-md-6">
                    <Form.Label>To Date</Form.Label>
                    <Form.Control type='Date' value={toDate} onChange={(e) => setToDate(e.target.value)}/>
                </div>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>VID</th>
                        <th>Date</th>
                        <th>Time</th>                        
                        <th>Client/Doctor</th>
                        <th>Coupon Collected</th>
                        <th>Coupon Settled</th>
                        <th>Sample Given</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                
                    {FilteredVisit.length > 0 ? (
                        FilteredVisit.map((item, index) => (
                        <tr key={`${item.id}-${index}`}>
                            <td>{item.id}</td>
                            <td>{item.date}</td>
                            <td>{item.time}</td>                            
                            <td>{item.fullname}</td>
                            <td>{item.total_coupon_collected}/{item.total_coupon_points}</td>
                            <td>{item.total_settlement}/{item.total_settlement_points}</td>
                            <td>{item.total_sample_given}/{item.total_sample_points}</td>
                            <td><button onClick={() => handleViewDetails(item.id)}>Details</button></td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan="7">No data available</td>
                        </tr>
                    )}
            
                </tbody>
            </Table>
        </div>
        
    );
}
export default VisitReport;