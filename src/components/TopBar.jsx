import React, { useEffect, useState } from "react";
import icons from "../assets/icons/icons";
import { Link, useLocation } from "react-router-dom";
import ROUTES from "../constants/routes";
function TopBar() {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    if (location.pathname.endsWith("campaigns")) {
      setIsActive("campaigns");
    } else if (location.pathname.endsWith("editcampaigns/")) {
      setIsActive("editcampaigns");
    } else if (location.pathname.endsWith("Users")) {
      setIsActive("Users");
    }
  }, [location]);
  return (
    <div className="TopBar">
      <div className="left">
        <h5>Dashboard</h5>
      </div>
      <div className="right">
        {isActive === "campaigns" ? (
          <Link to={ROUTES.ADMIN.EDIT_CAMPAIGN.replace(":campaignId?", "")}>
            <span>{icons.plus}</span>
            <p>new campaign</p>
          </Link>
        ) : isActive === "editcampaigns" ? (
          <Link to={ROUTES.ADMIN.EDIT_ARTICLE}>
            <span>{icons.plus}</span>
            <p>new article</p>
          </Link>
        ) : isActive === "Users" ? (
          <Link to={ROUTES.ADMIN.SIGNUP}>
            <span>{icons.plus}</span>
            <p>new user</p>
          </Link>
        ) : (
          <Link to={ROUTES.ADMIN.EDIT_ARTICLE}>
            <span>{icons.plus}</span>
            <p>new article</p>
          </Link>
        )}

        <div className="user">
          <span>{icons.user}</span>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
