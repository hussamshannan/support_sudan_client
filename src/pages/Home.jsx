import React from "react";
import { Link } from "react-router-dom";
import img from "../assets/img/mobile/wadi-lissa-RsgIenJC8ag-unsplash.jpg";
import water from "../assets/img/mobile/francesco-ungaro-Iuptsh6o5IM-unsplash.jpg";
import heath from "../assets/img/mobile/nappy-d2D_OF14-70-unsplash.jpg";
import icons from "../assets/icons/icons";
function Home() {
  return (
    <div className="page home" dir="auto">
      <div className="hero">
        <img src={img} alt="" />
        <h2>support sudan.</h2>
        <p>
          Your donation brings food, clean water, and medical care to families
          affected by the crisis in Sudan. Every dollar helps provide urgent aid
          with full transparency.
        </p>
        <div className="links">
          <Link to={"/donate"}>donate now</Link>
          <Link to={"/about"}>about</Link>
        </div>
        <div className="support">
          <span>{icons.food}</span>
          <div className="text">
            <span>food & water</span>
            <p>Deliver essentials like grains and clean drinking water.</p>
          </div>
        </div>
        <div className="support">
          <span>{icons.med}</span>
          <div className="text">
            <span>medical aid</span>
            <p>Support clinics with medicine and emergency care.</p>
          </div>
        </div>
        <div className="support">
          <span>{icons.shelter}</span>
          <div className="text">
            <span>shelter & education</span>
            <p>Provide safe shelter and learning resources for children.</p>
          </div>
        </div>
        <div className="card">
          <div className="title fillNone">
            <p>latest impact articles</p>
            <Link to={"/donate"}>
              <span>{icons.shield}</span>
              <p>Donate</p>
            </Link>
          </div>
          <div className="updates">
            <Link to={"/Article"} className="news">
              <div className="img">
                <img src={water} alt="" />
              </div>
              <div className="text">
                <div className="title">
                  <p>clean water point restored</p>
                </div>
                <div className="date">
                  <span>2 days ago</span> • <span>Water</span>
                </div>
                <div className="desc">
                  <p>12 wells repaired, 18,000 people reached</p>
                </div>
              </div>
              <span>{icons.arrowRight}</span>
            </Link>
            <Link to={"/Article"} className="news">
              <div className="img">
                <img src={img} alt="" />
              </div>
              <div className="text">
                <div className="title">
                  <p>Emergency Food Parcels</p>
                </div>
                <div className="date">
                  <span>2 weeks ago</span> • <span>Food</span>
                </div>
                <div className="desc">
                  <p>6,500 parcels delivered to displaced families.</p>
                </div>
              </div>
              <span>{icons.arrowRight}</span>
            </Link>
            <Link to={"/Article"} className="news">
              <div className="img">
                <img src={heath} alt="" />
              </div>
              <div className="text">
                <div className="title">
                  <p>Mobile Health Clinics</p>
                </div>
                <div className="date">
                  <span>3 weeks ago</span> • <span>Health</span>
                </div>
                <div className="desc">
                  <p>Two clinics treating 300+ patients daily.</p>
                </div>
              </div>
              <span>{icons.arrowRight}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
