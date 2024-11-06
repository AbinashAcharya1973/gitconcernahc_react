import React, { useState,useEffect } from 'react';
import { Button, Table,Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import StockReport from '../../components/StockReport';
const StockView = ({userId}) => {
    const [Staffs,setStaffs]=useState([]);
    const [selectedStaffId,setselectedStaffId]=useState("");
    const getStafflist  = async () =>{
        const response = await fetch(`http://localhost:80/api/getjuniorstafflist/${userId}`);
        const data = await response.json();
        setStaffs(data);
    }
    useEffect(()=>{
        getStafflist();
        //getClientlist();
    },[]);
    const handleSelectstaff = (e)=>{
        setselectedStaffId(e.target.value);
    };
    return(
        <div className="container">
            <h2 className="my-3">Stock View</h2>
            <div className="row">
                <div className="col-md-12">
                    <Form.Label>Select VSO/Staff</Form.Label>
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
            <StockReport stockholderId={selectedStaffId}/>
        </div>
    );
}
export default StockView;