import React from "react";
import icons from "../assets/icons/icons";
import { Link } from "react-router-dom";

function Success() {
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
