import React from "react";
import AdminUserTable from "../components/AdminUserTable";
function AdminUsers() {
  return (
    <div className="page AdminUsers">
      <AdminUserTable show={true} />
    </div>
  );
}

export default AdminUsers;
