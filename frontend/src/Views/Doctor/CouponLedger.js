import React, { useState,useEffect } from 'react';
import { Button, Table,Form } from 'react-bootstrap';
import CouponLedgerView from '../../components/CouponLedgerView';

import { useParams } from 'react-router-dom';
const CouponLedger=({userId}) =>{
    const [Clients,setClients]=useState([]);
    const [selectedClientId,setselectedClientId]=useState("");

    

    return(
        <div className="container">
            <h2 className="my-3">Coupon Ledger</h2>
            
            <CouponLedgerView clientId={userId} />
        </div>
    )
}
export default CouponLedger;