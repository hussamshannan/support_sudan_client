import React, { useEffect } from "react";
import icons from "../assets/icons/icons";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

function Success() {
  const location = useLocation();

  const cause = location.state.cause;

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const payerId = queryParams.get("PayerID");

    if (token && payerId) {
      toast.success("Payment processed successfully!", {
        style: {
          borderRadius: "var(--border-radius-large)",
          background: "var(--secondary-clr)",
          fontFamily: "var(--arabic-fm-r)",
          color: "var(--txt-clr)",
        },
      });
      const cleanUrl = window.location.origin + location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [location.search]);
  return (
    <div className="page success">
      <div className="card">
        <div className="top">
          <div className="logo">{icons.check}</div>
          <div className="title">
            <h1>Thank you for your donation</h1>
            <span>Your contribution has been received.</span>
          </div>
        </div>
        <div className="message">
          <span>{icons.inbox}</span>
          <p>receipt sent to your email</p>
        </div>
        <div className="impact">
          <p>your impact</p>
          <div className="impacts">
            {cause === "Food & Water" ? (
              <>
                <div>
                  <span>{icons.water}</span>
                  <p>clean water</p>
                  <span className="fade"></span>
                </div>
                <div>
                  <span>{icons.food}</span>
                  <p>food support</p>
                  <span className="fade"></span>
                </div>
              </>
            ) : cause === "Medical Aid" ? (
              <>
                <div>
                  <span>{icons.med}</span>
                  <p>medical supplies</p>
                  <span className="fade"></span>
                </div>
                <div>
                  <span>{icons.health}</span>
                  <p>healthcare support</p>
                  <span className="fade"></span>
                </div>
              </>
            ) : cause === "Shelter & Education" ? (
              <>
                <div>
                  <span>{icons.shelter}</span>
                  <p>safe shelter</p>
                  <span className="fade"></span>
                </div>
                <div>
                  <span className="fillNone">{icons.school}</span>
                  <p>education access</p>
                  <span className="fade"></span>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="next">
          <p>what's next</p>
          <span>
            We'll email monthly updates showing how your donation is used on the
            ground.
          </span>
          <Link to={"/"}>
            <span>{icons.home}</span>
            <p>Back to Home</p>
          </Link>
          <Link to={"/Updates"}>
            <span>{icons.news}</span>
            <p>See Updates</p>
          </Link>
          <Link to={"/donate"} id="main">
            <span>{icons.arrowAround}</span>
            <p>Make Another Donation</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Success;
