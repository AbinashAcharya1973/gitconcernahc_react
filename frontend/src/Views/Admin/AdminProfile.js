import React, { useState,useEffect } from 'react';
import { Button, Table,Form } from 'react-bootstrap';
import UpdatePassword from '../../components/UpdatePassword';

import { useParams } from 'react-router-dom';
const AdminProfile=({userId}) =>{
    return(
        <div className="container">
            <h2 className="my-3">Profile Setting</h2>
            <UpdatePassword userType={"admin"} userId={userId}/>

        </div>
    )
}
export default AdminProfile;