import React, { useState,useEffect } from 'react';
import { Button, Table,Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
const Dashboard = () => {
    const [Clients,setClients]=useState([]);
    const [selectedClientId,setselectedClientId]=useState("");
    return(
        <div className="container">
            <h2 className="my-3">Dashboard</h2>
        </div>
    );
}
export default Dashboard;