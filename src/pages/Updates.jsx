import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import img from "../assets/img/mobile/wadi-lissa-RsgIenJC8ag-unsplash.jpg";
import water from "../assets/img/mobile/francesco-ungaro-Iuptsh6o5IM-unsplash.jpg";
import health from "../assets/img/mobile/nappy-d2D_OF14-70-unsplash.jpg";
import useAxios from "../hooks/useAxios";
import { useLocation } from "react-router-dom";
import icons from "../assets/icons/icons";

function Updates() {
  const [info, setInfo] = useState({ cause: "", email: "", receiptUrl: "" });


  const [target, setTarget] = useState(null);
  const location = useLocation();
  const { get } = useAxios();

  // Set info from location or localStorage
  useEffect(() => {
    if (location.state) {
      setInfo(location.state);
    } else {
      const storedData = localStorage.getItem("donationData");
      if (storedData) setInfo(JSON.parse(storedData));
    }
  }, [location.state]);

  // Fetch donation target based on the cause
  useEffect(() => {
    if (!info.cause) return;

    const getTargets = async () => {
      try {
        const response = await get(
          `/targets/${encodeURIComponent(info.cause)}`
        );
        if (response.success) {
          setTarget(response.data);
        }
      } catch (err) {
        console.error("Error fetching target:", err);
      }
    };

    getTargets();
  }, [info.cause, get]);

  // Determine display values
  const causeDisplay = info.cause || "Water";
  const goalAmount = target?.targetAmount || 10000;
  const raisedAmount = target?.totalRaised || 0;
  const donors = target?.donorCount || 0;
  const progressPercent = target?.progress || 0;

  return (
    <div className="page updates" dir="auto">
      <div className="hero">
        <div className="card">
          <div className="title">
            <div className="top fillNone">
              <Link to={"/"}>
                <span>{icons.home}</span>
                <p>Home</p>
              </Link>
              <button>
                <span>{icons.news}</span>
                <p>updates</p>
              </button>
              <Link to={"/donate"}>
                <span>{icons.heart}</span>
                <p>Donate</p>
              </Link>
            </div>

            <h1>updates & impacts</h1>
            <span>timely reported from the field. Tap to read more.</span>
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
                <img src={health} alt="" />
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
        <div className="card">
          <div className="title">
            <p>Browse by category</p>
            <div className="top">
              <button>
                <span>{icons.water}</span>
                <p>Water</p>
              </button>
              <button>
                <span>{icons.food}</span>
                <p>Food</p>
              </button>
              <button>
                <span>{icons.shelter}</span>
                <p>shelter</p>
              </button>
              <button>
                <span>{icons.health}</span>
                <p>health</p>
              </button>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="title fillNone">
            <p className="firstLetter">make an impact</p>
            <Link to={"/donate"}>
              <span>{icons.shield}</span>
              <p>Donate</p>
            </Link>
          </div>

          <div className="progress">
            <div className="top">
              <div className="text">
                <span>{icons.target}</span>
                <p>{causeDisplay.toLowerCase()} fund</p>
              </div>
              <div className="amount">
                <p>
                  <span>goal: </span>${goalAmount.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bar">
              <div
                className="fill"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="bottom">
              <p>
                ${raisedAmount.toLocaleString()} <span>raised</span>
              </p>
              •
              <p>
                {donors} <span>donors</span>
              </p>
            </div>

            <Link
              to={`/donate?cause=${encodeURIComponent(info.cause || "")}`}
              className="firstLetter"
            >
              Donate to <span>{causeDisplay.toLowerCase()}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Updates;
