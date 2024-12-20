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
          <i className="bi bi-gear-fill icon-orange"></i> {!isCollapsed && "Master"}
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
          <i className="bi bi-box-arrow-in-right icon-red"></i> {!isCollapsed && "Transaction"}
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
          <i className="bi bi-file icon-green"></i> {!isCollapsed && "Reports"}
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
      <li className="nav-item">
        <a
          href="#"
          className="nav-link link-dark"
          style={{backgroundColor:" #a6a6a6"}}
          onClick={() => navigate("/admin/profile")}
        >
          <i className="bi bi-person-circle icon-red"></i> Profile Settings
        </a>
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
          <i className="bi bi-speedometer2 icon-blue"></i> {!isCollapsed && "Dashboard"}
        </a>
      </li>
      
      <li className="nav-item">
        <a
          href="#"
          className="nav-link link-dark"
          onClick={() => navigate("/visitlist")}
        >
          <i className="bi bi-list-stars icon-orange"></i> {!isCollapsed && "Visit List"}
        </a>
      </li>
      <li className="nav-item">
        <a
          href="#"
          className="nav-link link-dark"
          onClick={() => navigate("/addvisit")}
        >
          <i className="bi bi-node-plus icon-pblue"></i> {!isCollapsed && "Add Visit"}
        </a>
      </li>
      <li className="nav-item">
        <a
          href="#"
          className="nav-link link-dark"
          onClick={() => navigate("/vsocouponledg")}
        >
          <i className="bi bi-card-heading icon-red"></i> {!isCollapsed && "Coupon Ledger"}
        </a>
      </li>
      {/*<li className="nav-item">
        <a
          href="#"
          className="nav-link link-dark"
          onClick={() => navigate("/vsobonusledg")}
        >
          <i className="bi bi-journal-plus icon-green"></i> {!isCollapsed && "Bonus Ledger"}
        </a>
      </li>*/}
      <li className="nav-item">
        <a
          href="#"
          className="nav-link link-dark"
          onClick={() => navigate("/vsostock")}
        >
          <i className="bi bi-bookshelf icon-yellow"></i> {!isCollapsed && "Stock View"}
        </a>
      </li>
      <li className="nav-item">
        <a
          href="#"
          className="nav-link link-dark"
          onClick={() => navigate("/vsoprofile")}
        >
          <i className="bi bi-person-circle icon-pink"></i> {!isCollapsed && "Profile Settings"}
        </a>
      </li>      
    </>
  );
  
  
const renderDoctorMenu=() =>(
<>
    <li className="nav-item">
        <a
          href="#"
          className="nav-link link-dark"
          style={{backgroundColor:" #a6a6a6"}}
          onClick={() => navigate("/doctor")}
        >
          <i className="bi bi-speedometer2"></i> {!isCollapsed && "Dashboard"}
        </a>
      </li>
      <li className="nav-item">
        <a
          href="#"
          className="nav-link link-dark"
          style={{backgroundColor:" #a6a6a6"}}
          onClick={() => navigate("/doctor_couponledger")}
        >
          <i className="bi bi-journal-plus icon-green"></i> {!isCollapsed && "Coupon Ledger"}
        </a>
      </li>
      <li className="nav-item">
        <a
          href="#"
          className="nav-link link-dark"
          style={{backgroundColor:" #a6a6a6"}}
          onClick={() => navigate("/doctor/visit")}
        >
          <i className="bi bi-journal-plus icon-green"></i> {!isCollapsed && "Visit Report"}
        </a>
      </li>
      <li className="nav-item">
        <a
          href="#"
          className="nav-link link-dark"
          style={{backgroundColor:" #a6a6a6"}}
          onClick={() => navigate("/doctor/profile")}
        >
          <i className="bi bi-person-circle icon-pink"></i> {!isCollapsed && "Profile Settings"}
        </a>
      </li>
</>
);
const renderManagerMenu = () =>(
  <>
    <li className="nav-item">
        <a
          href="#"
          className="nav-link link-dark"
          
          onClick={() => navigate("/manager")}
        >
          <i className="bi bi-speedometer2"></i> {!isCollapsed && "Dashboard"}
        </a>
      </li>
      <li className="nav-item">
        <a
          href="#"
          className="nav-link link-dark"
          onClick={() => navigate("/manager/visitreport")}
        >
          <i className="bi bi-list-stars icon-orange"></i> {!isCollapsed && "Visit Report"}
        </a>
      </li>
      <li className="nav-item">
        <a
          href="#"
          className="nav-link link-dark"
          onClick={() => navigate("/manager/couponledger")}
        >
          <i className="bi bi-card-heading icon-red"></i> {!isCollapsed && "Coupon Ledger"}
        </a>
      </li>
      <li className="nav-item">
        <a
          href="#"
          className="nav-link link-dark"
          onClick={() => navigate("/manager/stockreport")}
        >
          <i className="bi bi-bookshelf icon-yellow"></i> {!isCollapsed && "Stock View"}
        </a>
      </li>
      <li className="nav-item">
        <a
          href="#"
          className="nav-link link-dark"
          
          onClick={() => navigate("/manager/profile")}
        >
          <i className="bi bi-person-circle icon-pink"></i> {!isCollapsed && "Profile Settings"}
        </a>
      </li>
  </>
);
  const renderSidebarContent = () => {
    switch (role) {
      case "admin":
      case "Administrator":
        return renderAdminMenu();
      case "VSO":
      case "vso":
        return renderVsoMenu();
      case "doctor":
      case "Doctor":
        return renderDoctorMenu();
      case "manager":
      case "Manager":
        return renderManagerMenu();
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
        position: "fixed",
        top: 0,
        left: 0,
        width: isCollapsed ? "80px" : "250px",
        height: "100vh",
        backgroundColor: "#f8f9fa",
        overflowY: "auto",
        boxShadow: "4px 0 10px rgba(0, 0, 0, 0.1)",
        transition: "width 0.3s",
        zIndex: 1000, // Ensure it overlays the main content
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
