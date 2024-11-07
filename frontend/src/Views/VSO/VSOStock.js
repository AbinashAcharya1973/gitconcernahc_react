import React, { useState,useEffect } from 'react';
import { Button, Table,Form } from 'react-bootstrap';
import StockReport from '../../components/StockReport';

import { useParams } from 'react-router-dom';
const VSOStock=({userId}) =>{
    return(
        <div className="container">
            <h2 className="my-3">Stock</h2>
            <StockReport stockholderId={userId}/>
        </div>
    )
}
export default VSOStock;