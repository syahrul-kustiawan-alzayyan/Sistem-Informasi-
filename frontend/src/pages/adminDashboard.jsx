import React from 'react'; // Link to your CSS file // Replace with your actual logo path
import Sidebar from '../componentsadmin/sidebar';
import Dashboardadmin from '../componentsadmin/Dashboardadmin';

const AdminDashboard = () => {

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <Sidebar />
      <Dashboardadmin />
    </div>
  );
};

export default AdminDashboard;
