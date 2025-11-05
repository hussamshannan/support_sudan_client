import React from "react";
import water from "../assets/img/mobile/francesco-ungaro-Iuptsh6o5IM-unsplash.jpg";
import icons from "../assets/icons/icons";
import { Link } from "react-router-dom";
function Article() {
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/donate`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Support this cause ❤️",
          text: "Join me in donating to this cause!",
          url: shareUrl,
        });
      } catch (err) {
        console.log("Share cancelled or failed:", err);
      }
    } else {
      // Fallback for browsers that don’t support Web Share API
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };
  return (
    <div className="page Article" dir="auto">
      <article>
        <img src={water} alt="" />
        <h1>Field Update: Clean Water Points Restored</h1>
        <div className="user_info">
          <span id="avatar">{icons.user}</span>
          <p>hussam shannan</p> •<span id="date">2 days ago</span>
        </div>
        <div className="impacts">
          <div className="impact">
            <p>water</p>
          </div>
          <div className="impact">
            <p>impact</p>
          </div>
          <div className="impact">
            <p>khartoum</p>
          </div>
        </div>
        <div className="card">
          <span>
            Our teams restored 12 wells across Gezira, giving 18,000+ people
            daily access to safe water. Repairs focused on handpumps, pipe
            replacement, and chlorination to prevent waterborne disease.
          </span>
          <p>what was done</p>
          <ul>
            <li>12 wells repaired and tested for safety</li>
            <li>4,000 water purification tablets distributed</li>
            <li>Community-led maintenance groups trained</li>
          </ul>
          <div className="note">
            <span>{icons.stars}</span>
            <p>
              Estimated impact: 18,000+ people now have reliable access to safe
              water daily.
            </p>
          </div>
          <div className="impacts">
            <div className="impact">
              <span>{icons.group}</span>
              <p>18K people</p>
            </div>
            <div className="impact">
              <span>{icons.wrench}</span> <p>12 wells</p>
            </div>
            <div className="impact">
              <span>{icons.calendar}</span> <p>2 weeks</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="top">
            <div className="title">
              <p>help expand clean water access</p>
              <Link to={"/"}>
                <span>{icons.arrow_left}</span>
                <p>back</p>
              </Link>
            </div>
            <span>
              $25 dollar can provide clean water to 5 people for a month
            </span>
          </div>
          <Link to={"/donate"} id="main">
            <span>{icons.heart}</span>
            <p>donate</p>
          </Link>
          <button onClick={handleShare} className="share-btn">
            <span>{icons.share}</span> <p>Share</p>
          </button>
        </div>
      </article>
      <p id="message">
        100% encrypted payments. Monthly impact updates included in your
        receipt.
      </p>
    </div>
  );
}

export default Article;
