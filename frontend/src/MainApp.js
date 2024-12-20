// src/App.js
// src/App.js
import React, { useState,useEffect,useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Slidebar from './components/Slidebar';
import AdminDashboard from './components/AdminDashboard';
import Staff from './Views/Masters/Staff';
import Products from './Views/Masters/Products';
import AddProduct from './Views/Masters/Forms/AddProduct';
import Clients from './Views/Masters/Clients';
import AddClient from './Views/Masters/Forms/AddClient';
import AddStaff from './Views/Masters/Forms/AddStaff';
import Stock_Issue from './Views/Transaction/Stock_Issue';
import VisitList from './Views/VSO/VisitList';
import AddVisit from './Views/VSO/Form/AddVisit';
import Stock_Issue_List from './Views/Transaction/Stock_Issue_List';
import 'bootstrap/dist/css/bootstrap.min.css';
import OpeningStock from './Views/Transaction/OpeningStock';
import CouponLedger from './Views/Reports/CouponLedger';
import BonusLedger from './Views/Reports/BonusLedger';
import StockReport from './Views/Reports/StockReport';
import VisitReport from './Views/Reports/VisitReport';
import VSOCouponLedger from './Views/VSO/VSOCouponLedg';
import VSOBonusLedger from './Views/VSO/VSOBonusLedg';
import VSOStock from './Views/VSO/VSOStock';
import VSOProfile from './Views/VSO/VSOProfile';
import AdminProfile from './Views/Admin/AdminProfile';
import DoctorDashboard from './Views/Doctor/Dashboard';
import DoctorCouponLedger from './Views/Doctor/CouponLedger';
import DoctorVisitList from './Views/Doctor/VisitList';
import DoctorProfile from './Views/Doctor/Profile';
import ManagerDashboard from './Views/Manager/Dashboard';
import ManagerProfile from './Views/Manager/Profile';
import ManagerVisitReport from './Views/Manager/VisitReport';
import ManagerStockReport from './Views/Manager/StockView';
import ManagerCouponLedger from './Views/Manager/CouponLedger';
import VisitDetailsPage from './components/VisitDetailsPage';
import { UserContext, UserProvider } from './UserContext';
import { useNavigate } from 'react-router-dom';

function MainApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userId,setUserId] = useState(0);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = (status, role,id) => {
    setIsLoggedIn(status);  // Update login state
    setUserRole(role);  // Set user role
    setUserId(id)
  };

  const renderRoutesForRole = (role) => {
    switch (role) {
      case 'admin':
      case 'Administrator':
        return (
          <Routes>
          <Route path="/admin_dashboard" element={<AdminDashboard />} />
          <Route path="/master/staff" element={<Staff />} />
          <Route path="/master/products" element={<Products />} />
          <Route path="/master/products/add" element={<AddProduct />} />
          <Route path="/master/clients" element={<Clients />}/>
          <Route path="/master/clients/add" element={<AddClient />}/>
          <Route path="/transaction/stock_issue" element={<Stock_Issue/>} />
          <Route path="/transaction/openingstock" element={<OpeningStock/>} />
          <Route path="/transaction/Stock-Issue-List" element={<Stock_Issue_List/>} />
          <Route path="/reports/coupon_ledger" element={<CouponLedger/>} />
          <Route path="/reports/bonus_ledger" element={<BonusLedger/>} />
          <Route path="/reports/stock_report" element={<StockReport/>} />
          <Route path="/reports/visit_report" element={<VisitReport/>} />
          <Route path="/admin/profile" element={<AdminProfile userId={userId}/>} />
          <Route path="/visitdetails/:visitId" element={<VisitDetailsPage />} />
          </Routes>
        );
      case 'vso':
      case 'VSO':
        return (
          <Routes>
            <Route path="/vso_dashboard" element={<VisitList/>}/>            
            <Route path="/visitlist" element={<VisitList userId={userId}/>}/>
            <Route path="/addvisit" element={<AddVisit userId={userId}/>}/>
            <Route path="/vsocouponledg" element={<VSOCouponLedger userId={userId}/>}/>
            <Route path="/vsobonusledg" element={<VSOBonusLedger userId={userId}/>}/>
            <Route path="/vsostock" element={<VSOStock userId={userId}/>}/>
            <Route path="/vsoprofile" element={<VSOProfile userId={userId}/>}/> 
            <Route path="/visitdetails/:visitId" element={<VisitDetailsPage />} />           
          </Routes>
        );
      case  'Doctor':
      case 'doctor':
        return (
          <Routes>
            {/* Define Doctor-specific routes */}
            <Route path="/doctor" element={<DoctorDashboard userId={userId}/>}/>
            <Route path="/doctor_couponledger" element={<DoctorCouponLedger userId={userId}/>}/>
            <Route path="/doctor/visit" element={<DoctorVisitList userId={userId}/>}/>
            <Route path="/doctor/profile" element={<DoctorProfile userId={userId}/>}/>
            <Route path="/visitdetails/:visitId" element={<VisitDetailsPage />} />
          </Routes>
        );
      case 'manager':
      case 'Manager':
        return (
          <Routes>
            {/* Define Manager-specific routes */}
            <Route path="/manager" element={<ManagerDashboard userId={userId}/>}/>
            <Route path="/manager/visitreport" element={<ManagerVisitReport userId={userId}/>}/>
            <Route path="/manager/stockreport" element={<ManagerStockReport userId={userId}/>}/>
            <Route path="/manager/couponledger" element={<ManagerCouponLedger userId={userId}/>}/>
            <Route path="/manager/profile" element={<ManagerProfile userId={userId}/>}/>
            <Route path="/visitdetails/:visitId" element={<VisitDetailsPage />} />
          </Routes>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
      setUserRole(user.role);
      // navigate('/admin_dashboard'); // Automatically redirect to dashboard based on role
    }
  }, [user]);

  return (
    
    
      <div className="d-flex">
        {/* {!user ? (
          <Login onLogin={handleLogin} />
        ) : (
          <>
            <Slidebar role={user.role} />
            <div className="p-4" style={{ flexGrow: 1 }}>
              {renderRoutesForRole(userRole)}
            </div>
          </>
        )} */}
        {!user ? (
          <Login onLogin={handleLogin} />
        ) : (
          <>
            <Slidebar role={user.role} />
            <div className="p-4" style={{ flexGrow: 1 }}>
              {renderRoutesForRole(user.role)}
            </div>
          </>
        )}
      </div>    
  );
}

export default MainApp;
