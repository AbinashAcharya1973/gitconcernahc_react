// src/components/Login.js
import React, { useState,useEffect,useContext } from 'react';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import { MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';

function Login({ onLogin }) {
  const [usercode, setUsercode] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  // Function to handle login
  const handleLogin = async () => {
    try {
      const response = await fetch(`http://localhost:80/api/usertype/${usercode}/${password}`);
      const data = await response.json();
      
      if (data.usertype) {
        onLogin(true, data.usertype,data.staff_id); // Pass role with login status
        login({username:data.username,role:data.usertype})
        navigate('/'); // Redirect to dashboard or home
      } else {
        alert('Invalid login or user type');
      }
    } catch (error) {
      console.error('Error fetching user type:', error);
    }
  };

  useEffect(() => {
    if (usercode) {
      navigate('/'); // Change path when logged in
    }
  }, [usercode, navigate]);

  return (
    <MDBContainer fluid className="p-3 my-5 h-custom">
      <MDBRow>
        <MDBCol col='10' md='6'>
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="img-fluid" alt="Sample image" />
        </MDBCol>
        <MDBCol col='4' md='6'>
          <div className="d-flex flex-row align-items-center justify-content-center">
            <p className="lead fw-normal mb-0 me-3">Sign in with</p>
            {/* Social Media Icons */}
          </div>
          <MDBInput wrapperClass='mb-4' label='Usercode' id='formControlLg' type='text' size="lg" value={usercode} onChange={(e) => setUsercode(e.target.value)} />
          <MDBInput wrapperClass='mb-4' label='Password' id='formControlLg' type='password' size="lg" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="d-flex justify-content-between mb-4">
            <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
            <a href="!#">Forgot password?</a>
          </div>
          <div className='text-center text-md-start mt-4 pt-2'>
            <MDBBtn className="mb-0 px-5" size='lg' onClick={handleLogin}>Login</MDBBtn>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;
