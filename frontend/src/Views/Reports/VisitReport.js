import React, { useEffect, useState } from "react";
import { Table, Container, Alert, Dropdown, Button, Form } from "react-bootstrap";

const VisitReport = () => {
  const [visitData, setVisitData] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [Clients,setClients]=useState([]);
  const [selectedClientId,setselectedClientId]=useState("");

  const fetchStaffs = async () => {
    try {
      const response = await fetch("http://localhost:80/api/staffs");
      if (!response.ok) throw new Error("Network response was not ok");
      const staffsReceived = await response.json();
      setStaffs(staffsReceived);
    } catch (error) {
      setError(error.message);
    }
  };
  const fetchClients = async (staffId) =>{
    try{
        const response = await fetch("http://localhost:80/api/getvsoclients/"+staffId)
        if(!response.ok) throw new Error("Failed to get clients");
        const data=await response.json();
        setClients(data);
    } catch(err){
        console.error("Error fetching Clients",err.message);
    }
  };
  const fetchVisitByClient = async (cid) => {
    try{    
      const response = await fetch("http://localhost:80/api/clientvisit_ad/"+cid)
      if(!response.ok) throw new Error("Failed to get clients");
      const data=await response.json();
      setVisitData(data);
      setFilteredVisits(data);
    } catch(err){
      console.error("Error fetching Clients",err.message);  
    }
  };
  const handleSelectClients = (event) => {
    const clientId = event.target.value;
    setselectedClientId(clientId);  
    fetchVisitByClient(event.target.value);
  };
  const fetchVisitData = async (staffId) => {
    try {
      const url = staffId
        ? `http://localhost:80/api/getvisitbystaff/${staffId}`
        : "http://localhost:80/api/todayvisits";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const dataReceived = await response.json();
      setVisitData(Array.isArray(dataReceived) ? dataReceived : []); // Ensure visitData is an array
      setFilteredVisits(Array.isArray(dataReceived) ? dataReceived : []); 
      fetchClients(staffId);// Initialize filteredVisits as an array
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchStaffs();
    fetchVisitData(selectedStaff);
  }, []);

  useEffect(() => {
    if (selectedStaff) fetchVisitData(selectedStaff);
  }, [selectedStaff]);

  const filterVisitsByDate = () => {
    if (!Array.isArray(visitData)) return; // Check if visitData is an array
    const filtered = visitData.filter(visit => {
      const visitDate = new Date(visit.date);
      const start = fromDate ? new Date(fromDate) : null;
      const end = toDate ? new Date(toDate) : null;
      return (!start || visitDate >= start) && (!end || visitDate <= end);
    });
    setFilteredVisits(filtered);
  };

  useEffect(() => {
    filterVisitsByDate();
  }, [fromDate, toDate, visitData]);

  return (
    <Container>
      <h1>Visit Report</h1>
      {error ? (
        <Alert variant="danger">Error fetching data: {error}</Alert>
      ) : (
        <>
          <div className="mb-3">
            <div className="row">
              <div className="col-md-12">
                <Dropdown>
                  <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    {selectedStaff ? `Selected: ${selectedStaff}` : "Select Staff"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {staffs.map(staff => (
                      <Dropdown.Item
                        key={staff.staff_id}
                        onClick={() => setSelectedStaff(staff.id)}
                      >
                        {staff.fullname} ({staff.id})
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                <Button
                  variant="secondary"
                  className="mt-2"
                  onClick={() => setSelectedStaff("")}
                >
                  Reset Filter
                </Button>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-12">
              <Form.Label>Select Client/Doctor</Form.Label>
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
            </div>

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
          </div>

          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Visit Date</th>
                <th>Visit Time</th>
                <th>Visited By</th>
                <th>Visited To</th>
                <th>Coupon Collected</th>
                <th>Coupon Settled</th>
                <th>Bonus</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisits.length > 0 ? (
                filteredVisits.map((item, index) => (
                  <tr key={`${item.product_id}-${index}`}>
                    <td>{item.v_date}</td>
                    <td>{item.v_time}</td>
                    <td>{item.sname}</td>
                    <td>{item.docname}</td>
                    <td>{item.tcpoints}</td>
                    <td>{item.tsp}</td>
                    <td>{item.tcbp}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No data available</td>
                </tr>
              )}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default VisitReport;
