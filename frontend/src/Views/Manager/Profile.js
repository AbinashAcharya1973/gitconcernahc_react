import React, { useState,useEffect } from 'react';
import { Button, Table,Form } from 'react-bootstrap';
import UpdatePassword from '../../components/UpdatePassword';

import { useParams } from 'react-router-dom';
const Profile=({userId}) =>{
    return(
        <div className="container">
            <h2 className="my-3"><i className="bi bi-person-circle icon-pink"></i>Profile Setting</h2>
            <UpdatePassword userType={"manager"} userId={userId}/>

        </div>
    )
}
export default Profile;