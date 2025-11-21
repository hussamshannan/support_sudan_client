import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import useAxios from "../hooks/useAxios";
import { useLocation } from "react-router-dom";
import icons from "../assets/icons/icons";
import Loading from "../components/Loading";
import gsap from "gsap";
function Updates() {
  const [info, setInfo] = useState({ cause: "", email: "", receiptUrl: "" });

  const [target, setTarget] = useState(null);
  const location = useLocation();
  const { data, error, loading, get, post, put } = useAxios();
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const articlesRef = useRef([]);

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
          `/campaigns/${encodeURIComponent(info.cause)}`
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

  useEffect(() => {
    // Animate all news elements that were just rendered
    gsap.from(articlesRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
    });
  }, [articles]);
  useEffect(() => {
    fetchArticles(page);
  }, [page]);

  const fetchArticles = async (pageNum) => {
    try {
      const res = await get(`/articles?page=${pageNum}`);
      setArticles(res.articles);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error("Error fetching articles:", err);
    }
  };
  const formatRelativeDate = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now - past;

    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);

    if (minutes < 1) return "just now";
    if (minutes === 1) return "1 minute ago";
    if (minutes < 60) return `${minutes} minutes ago`;

    if (hours === 1) return "1 hour ago";
    if (hours < 24) return `${hours} hours ago`;

    if (days === 1) return "1 day ago";
    if (days < 7) return `${days} days ago`;

    if (weeks === 1) return "1 week ago";
    if (weeks < 4) return `${weeks} weeks ago`;

    // If older than ~1 month, show the full date
    return past.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <div className="page updates" dir="auto">
      {loading && <Loading />}

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
            {articles.map((article, index) => (
              <Link
                key={article._id}
                to={`/Article/${article._id}`}
                className="news"
                ref={(el) => (articlesRef.current[index] = el)}
              >
                <div className="img">
                  <img src={article.mediaUrl} alt={article.title} />
                </div>
                <div className="text">
                  <div className="title">
                    <p>{article.title}</p>
                  </div>
                  <div className="date">
                    <span>{formatRelativeDate(article.updatedAt)}</span> •{" "}
                    <span>{article.impactType}</span>
                  </div>
                  <div className="desc">
                    <p>{article.content}</p>
                  </div>
                </div>
                <span>{icons.arrowRight}</span>
              </Link>
            ))}

            {/* Pagination buttons */}
            <div className="pagination">
              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                {icons.arrowleft}
              </button>
              <p>
                {totalPages}/{page}
              </p>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                {icons.arrowRight}
              </button>
            </div>
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
