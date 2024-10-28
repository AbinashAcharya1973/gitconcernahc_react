// src/components/AdminDashboard.js
import React from 'react';

function AdminDashboard() {
  return (
    <div className="p-4" style={{flexGrow: 1 }}>
      <h1>Welcome to Admin Dashboard</h1>
      <p>This is a basic admin panel layout with a collapsible sidebar.</p>
      <div className="row">
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body"         style={{ boxShadow: "4px 4px 10px black " }}            >
              <h5 className="card-title">Card Title 1</h5>
              <p className="card-text">Some quick example text.</p>
              <a href="#" className="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body"         style={{ boxShadow: "4px 4px 10px black " }}            >
              <h5 className="card-title">Card Title 2</h5>
              <p className="card-text">Some quick example text.</p>
              <a href="#" className="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body"         style={{ boxShadow: "4px 4px 10px black " }}>
              <h5 className="card-title">Card Title 3</h5>
              <p className="card-text">Some quick example text.</p>
              <a href="#" className="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default AdminDashboard;
