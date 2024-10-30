// src/components/Sidebar.js
import React, { useState,useContext } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignJustify, faTimes } from '@fortawesome/free-solid-svg-icons';


const Slidebar = ({ role }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [masterOpen, setMasterOpen] = useState(false);
  const [transactionOpen, setTransactionOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMasterMenu = () => {
    setMasterOpen(!masterOpen);
  };

  const toggleTransactionMenu = () => {
    setTransactionOpen(!transactionOpen);
  };

  const toggleReportsMenu = () => {
    setReportsOpen(!reportsOpen);
  };

  const renderAdminMenu = () => (
    <>
      <li className="nav-item">
        <a
          href="#"
          className="nav-link link-dark"
          style={{backgroundColor:" #a6a6a6"}}
          onClick={() => navigate("/admin_dashboard")}
        >
          <i className="bi bi-speedometer2"></i> {!isCollapsed && "Dashboard"}
        </a>
      </li>
      <li className="nav-item" onClick={toggleMasterMenu}>
        <a href="#" className="nav-link link-dark" style={{backgroundColor:" #a6a6a6"}}>
          <i className="bi bi-puzzle"></i> {!isCollapsed && "Master"}
        </a>
        {!isCollapsed && masterOpen && (
          <ul className="nav flex-column ms-3">
            <li className="nav-item" >
              <a
                href="#"
                className="nav-link link-dark" style={{backgroundColor:" #a6a6a6"}}
                onClick={() => navigate("/master/staff")}
              >
                Staffs
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#"
                className="nav-link link-dark" style={{backgroundColor:" #a6a6a6"}}
                onClick={() => navigate("/master/products")}
              >
                Products
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#"
                className="nav-link link-dark" style={{backgroundColor:" #a6a6a6"}}
                onClick={() => navigate("/master/clients")}
              >
                Clients
              </a>
            </li>
          </ul>
        )}
      </li>
      <li className="nav-item" onClick={toggleTransactionMenu}>
        <a href="#" className="nav-link link-dark" style={{backgroundColor:" #a6a6a6"}}>
          <i className="bi bi-people"></i> {!isCollapsed && "Transaction"}
        </a>
        {!isCollapsed && transactionOpen && (
          <ul className="nav flex-column ms-3">
            <li className="nav-item">
              <a
                href="#"
                className="nav-link link-dark" style={{backgroundColor:" #a6a6a6"}}
                onClick={() => navigate("/transaction/openingstock")}
              >
                Opening Stock
              </a>
            </li>
            
            <li className="nav-item">
              <a
                href="#"
                className="nav-link link-dark"
                style={{backgroundColor:" #a6a6a6"}}
                onClick={() => navigate("/transaction/Stock-Issue-List")}
              >
                Stock Issue List
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#"
                className="nav-link link-dark"
                style={{backgroundColor:" #a6a6a6"}}
                onClick={() => navigate("/transaction/stock-return")}
              >
                Stock Return
              </a>
            </li>
          </ul>
        )}
      </li>
      <li className="nav-item" onClick={toggleReportsMenu}>
        <a href="#" className="nav-link link-dark" style={{backgroundColor:" #a6a6a6"}}>
          <i className="bi bi-people"></i> {!isCollapsed && "Reports"}
        </a>
        {!isCollapsed && reportsOpen && (
          <ul className="nav flex-column ms-3">
            <li className="nav-item">
              <a href="#" 
              className="nav-link link-dark " 
              style={{backgroundColor:" #a6a6a6"}}
              onClick={() => navigate("/reports/stock_report")}  >
                Stock Report
              </a>
            </li>

            <li className="nav-item">
              <a
                href="#"
                className="nav-link link-dark"
                style={{backgroundColor:" # a6a6a6"}}
                onClick={() => navigate("/reports/visit_report")}
              >
                Visit Report
              </a>
            </li>

            <li className="nav-item">
              <a
                href="#"
                className="nav-link link-dark"
                style={{backgroundColor:" # a6a6a6"}}
                onClick={() => navigate("/reports/coupon_ledger")}
              >
                Coupon Collection Report
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#"
                className="nav-link link-dark"
                style={{backgroundColor:" # a6a6a6"}}
                onClick={() => navigate("/reports/bonus_ledger")}
              >
                Bonus Collection Report
              </a>
            </li>
          </ul>
        )}
      </li>
    </>
  );

  const renderVsoMenu = () => (
    <>
      <li className="nav-item">
        <a
          href="#"
          className="nav-link link-dark"
          onClick={() => navigate("/vso_dashboard")}
        >
          <i className="bi bi-speedometer2"></i> {!isCollapsed && "Dashboard"}
        </a>
      </li>
      <li className="nav-item">
        <a
          href="#"
          className="nav-link link-dark"
          onClick={() => navigate("/visit")}
        >
          <i className="bi bi-people"></i> {!isCollapsed && "Visit"}
        </a>
      </li>
    </>
  );

  // const renderVsoMenu = () => (
  //   <>
  //     <li className="nav-item">
  //       <a href="#" className="nav-link link-dark" onClick={() => navigate('/vso-dashboard')}>
  //         VSO Dashboard
  //       </a>
  //     </li>
  //     <li className="nav-item" onClick={toggleMasterMenu}>
  //       <a href="#" className="nav-link link-dark"><i className="bi bi-puzzle"></i> {!isCollapsed && 'Master'}</a>
  //       {!isCollapsed && masterOpen && (
  //         <ul className="nav flex-column ms-3">
  //           <li className="nav-item"><a href="#" className="nav-link link-dark" onClick={() => navigate('/master/staff')}>Visit</a></li>
  //           {/* <li className="nav-item"><a href="#" className="nav-link link-dark" onClick={() => navigate('/master/products')}>Products</a></li>
  //           <li className="nav-item">
  //                 <a href="#" className="nav-link link-dark" onClick={() => navigate('/master/mbacourse')}>
  //                   Clients
  //                 </a>
  //               </li> */}
  //         </ul>
  //       )}
  //     </li>
  //     {/* Add more VSO-specific links */}
  //   </>
  // );

  const renderSidebarContent = () => {
    switch (role) {
      case "admin":
        return renderAdminMenu();
      case "VSO":
        return renderVsoMenu();
      case "Doctor":
        return <li>Doctor specific menu</li>;
      case "manager":
        return <li>Manager specific menu</li>;
      default:
        return null;
    }
  };

  // const handleLogout = () => {
  //   // Perform any necessary logout actions, such as clearing auth tokens
  //   navigate("/login"); // Redirect to the login page after logout
  // };

  return (
    <div
      className={`d-flex flex-column flex-shrink-0 p-4 bg-light ${isCollapsed ? "collapsed" : ""}`}
      style={{
        width: isCollapsed ? "80px" : "250px",
        height: "100vh",
        transition: "width 0.3s",
        boxShadow: "4px 4px 10px black",
        position: "relative",
      }}
    >
      <button
        onClick={toggleSidebar}
        className="btn btn-primary position-absolute"
        aria-expanded={!isCollapsed}
        style={{
          top: "10px",
          right: "10px",
          width: "30px",
          height: "30px",
          padding: "0",
          border: "none",
          background: "transparent",
        }}
      >
        <FontAwesomeIcon icon={isCollapsed ? faAlignJustify : faAlignJustify} style={{ fontSize: "20px", color: "black" }} />
      </button>
  
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
        <span className="fs-4">{!isCollapsed && (role === 'admin' ? 'Admin Panel' : `${role} Panel`)}</span>
      </a>
  
      <ul className="nav nav-pills flex-column mb-auto">
        {renderSidebarContent()}
      </ul>

      <button className="btn btn-danger mt-3" onClick={logout}>
        {!isCollapsed && "Logout"}
      </button>
    </div>
  );
};

export default Slidebar;
