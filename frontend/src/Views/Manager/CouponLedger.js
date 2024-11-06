import React, { useState,useEffect } from 'react';
import { Button, Table,Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import CouponLedgerView from '../../components/CouponLedgerView';
const CouponLedger = ({userId}) => {
    const [Staffs,setStaffs]=useState([]);
    const [Clients,setClients]=useState([]);    
    const [selectedStaffId,setselectedStaffId]=useState("");
    const [selectedClientId,setselectedClientId]=useState("");
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
    useEffect(()=>{
        getStafflist();
        //getClientlist();
    },[]);
    const handleSelectstaff = (e)=>{
        setselectedStaffId(e.target.value);
        getClientlist(e.target.value);        
    };
    const handleSelectClient = (e)=>{
        setselectedClientId(e.target.value);       
    };
    return(
        <div className="container">
            <h2 className="my-3">Coupon Ledger</h2>
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
            <CouponLedgerView clientId={selectedClientId} />
        </div>
        
    );
}
export default CouponLedger;