import React, { useState,useEffect } from 'react';
import { Button, Table,Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
const VisitReport = () => {
    const [Clients,setClients]=useState([]);
    const [selectedClientId,setselectedClientId]=useState("");
    return(
        <div className="container">
            <h2 className="my-3">Visit Report</h2>
            <div className="row">
                <div className="col-md-12">
                    <Form.Label>Select VSO</Form.Label>
                    <Form.Control
                    as="select"
                    >
                        <option value="0">VSO Name</option>
                    </Form.Control>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <Form.Label>Select Client/Doctor</Form.Label>
                    <Form.Control
                    as="select"
                    >
                        <option value="0">Doctor</option>
                    </Form.Control>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <Form.Label>From Date</Form.Label>
                    <Form.Control 
                    type="Date"></Form.Control>
                </div>
                <div className="col-md-6">
                    <Form.Label>To Date</Form.Label>
                    <Form.Control 
                    type="Date"></Form.Control>
                </div>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>VSO</th>
                        <th>Client/Doctor</th>
                        <th>Coupon Collected</th>
                        <th>Coupon Settled</th>
                        <th>Sample Given</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </Table>
        </div>
        
    );
}
export default VisitReport;