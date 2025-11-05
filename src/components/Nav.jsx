import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import icons from "../assets/icons/icons";
function Nav() {
  const location = useLocation();
  const [hide, sethide] = useState(null);
  useEffect(() => {
    if (location.pathname.endsWith("/donate")) {
      sethide(true); // orange for donate
    } else if (location.pathname.endsWith("/pay")) {
      sethide(true);
    } else if (location.pathname.endsWith("/payNreview")) {
      sethide(true);
    } else {
      sethide(false);
    }
     window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);
  return (
    <nav>
      <Link to={"/"} className="logo">
        <span>{icons.heart}</span>
        <p>help sudan</p>
      </Link>
      {!hide ? (
        <Link to={"/donate"} className="donate">
          <span>{icons.shield}</span>
          <p>donate now</p>
        </Link>
      ) : (
        ""
      )}
    </nav>
  );
}

export default Nav;
