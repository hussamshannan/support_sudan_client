import React, { useEffect, useState } from "react";
import icons from "../assets/icons/icons";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

function Success() {
  const [info, setInfo] = useState({ cause: "", email: "", receiptUrl: "" });
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      // If data was passed through navigation state
      setInfo(location.state);
    } else {
      // If data is stored in localStorage
      const storedData = localStorage.getItem("donationData");
      if (storedData) {
        setInfo(JSON.parse(storedData));
      }
    }
  }, [location.state]);

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
        {!info.email && info.receiptUrl ? (
          <Link className="message" to={info.receiptUrl}>
            <span>{icons.receipt}</span>
            <p>your receipt is ready</p>
            <span style={{ marginLeft: "auto" }}>{icons.arrowOutward}</span>
          </Link>
        ) : info.email && info.receiptUrl ? (
          <div className="message">
            <span className="fillNone">{icons.inbox}</span>
            <p>receipt sent to your email</p>
          </div>
        ) : info.email && !info.receiptUrl ? (
          <div className="message">
            <span className="fillNone">{icons.inbox}</span>
            <p>receipt sent to your email</p>
          </div>
        ) : (
          ""
        )}

        <div className="impact">
          <p>your impact</p>
          <div className="impacts">
            {info.cause === "Food & Water" ? (
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
            ) : info.cause === "Medical Aid" ? (
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
            ) : info.cause === "Shelter & Education" ? (
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
