import React, { useState,useEffect } from 'react';
import { Button, Table,Form } from 'react-bootstrap';
import CouponLedgerView from '../../components/CouponLedgerView';

import { useParams } from 'react-router-dom';
const VSOCouponLedger=({userId}) =>{
    const [Clients,setClients]=useState([]);
    const [selectedClientId,setselectedClientId]=useState("");

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
    useEffect(() =>{        
        fetchClients();
    },[]);

    return(
        <div className="container">
            <h2 className="my-3">Coupon Ledger</h2>
            <Form.Group>
                <Form.Label>Select Client</Form.Label>
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
            </Form.Group>
            <CouponLedgerView clientId={selectedClientId} />
        </div>
    )
}
export default VSOCouponLedger;