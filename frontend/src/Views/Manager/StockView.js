import React, { useState,useEffect } from 'react';
import { Button, Table,Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
const StockView = () => {
    const [Clients,setClients]=useState([]);
    const [selectedClientId,setselectedClientId]=useState("");
    return(
        <div className="container">
            <h2 className="my-3">Stock View</h2>
            <div className="row">
                <div className="col-md-12">
                    <Form.Label>Select VSO/Staff</Form.Label>
                    <Form.Control
                    as="select"
                    >
                        <option value="0">VSO Name</option>
                    </Form.Control>
                </div>
            </div>
        </div>
    );
}
export default StockView;