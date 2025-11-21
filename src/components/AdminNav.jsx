import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import icons from "../assets/icons/icons";
import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { logout } from "../utils/auth";
import { useEffect } from "react";
import { useState } from "react";

function AdminNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  // Function to check if a nav item is active
  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate(ROUTES.ADMIN.LOGIN);
  };
  useEffect(() => {
    if (localStorage.getItem("role") === "admin") setRole(true);
  }, []);
  return (
    <nav className="admin">
      <div className="top">
        <span>{icons.heart}</span>
        <h6>sudacand • admin</h6>
      </div>
      <div className="mid">
        <span>main</span>
        <ul>
          <li
            className={isActive(ROUTES.ADMIN.DASHBOARD, true) ? "active" : ""}
          >
            <span>{icons.square}</span>
            <Link to={ROUTES.ADMIN.DASHBOARD}>dashboard</Link>
          </li>
          <li className={isActive("/admin/donations") ? "active" : ""}>
            <span>{icons.creditCard}</span>
            <Link to={"/admin/donations"}>donations</Link>
          </li>
          <li className={isActive(ROUTES.ADMIN.ARTICLE_LIST) ? "active" : ""}>
            <span>{icons.news}</span>
            <Link to={ROUTES.ADMIN.ARTICLE_LIST}>articles</Link>
          </li>
        </ul>
        <span>manage</span>
        <ul>
          <li className={isActive(ROUTES.ADMIN.CAMPAIGNS) ? "active" : ""}>
            <span>{icons.folder}</span>
            <Link to={ROUTES.ADMIN.CAMPAIGNS}>campaigns</Link>
          </li>
          {role && (
            <li className={isActive(ROUTES.ADMIN.USERS) ? "active" : ""}>
              <span>{icons.group}</span>
              <Link to={ROUTES.ADMIN.USERS}>users</Link>
            </li>
          )}
        </ul>
      </div>
      <div className="bottom">
        <button onClick={handleLogout}>
          <span>{icons.logout}</span>
          <p>logout</p>
        </button>
      </div>
    </nav>
  );
}

export default AdminNav;
