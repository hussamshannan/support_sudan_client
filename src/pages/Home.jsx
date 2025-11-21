import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import img from "../assets/img/mobile/wadi-lissa-RsgIenJC8ag-unsplash.jpg";
import icons from "../assets/icons/icons";
import useAxios from "../hooks/useAxios";
import gsap from "gsap";

function Home() {
  const { data, error, loading, get, post, put } = useAxios();
  const [articles, setArticles] = useState([]);
  const [campaigns, setcampaigns] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const articlesRef = useRef([]);

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
    fetchcampaigns();
  }, [page]);

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

  // Loading skeleton component
  const HomeSkeleton = () => (
    <div className="page home" dir="auto">
      <div className="hero">
        {/* Hero image skeleton */}
        <div className="media skeleton-media">
          <div className="skeleton-img"></div>
        </div>

        {/* Title skeleton */}
        <div className="skeleton-title"></div>

        {/* Description skeleton */}
        <div className="skeleton-text long"></div>

        {/* Button skeleton */}
        <div className="links">
          <div className="skeleton-button"></div>
        </div>

        {/* Campaigns skeleton */}
        {[1, 2].map((item) => (
          <div className="support skeleton-support" key={item}>
            <span className="skeleton-icon"></span>
            <div className="text">
              <span className="skeleton-text short"></span>
              <p className="skeleton-text medium"></p>
            </div>
          </div>
        ))}

        {/* Articles card skeleton */}
        <div className="card">
          <div className="title fillNone">
            <p className="skeleton-text short"></p>
            <div className="skeleton-button small"></div>
          </div>
          <div className="updates">
            {[1, 2, 3].map((item) => (
              <div key={item} className="news skeleton-news">
                <div className="img skeleton-img"></div>
                <div className="text">
                  <div className="title">
                    <p className="skeleton-text long"></p>
                  </div>
                  <div className="date">
                    <span className="skeleton-text xshort"></span>
                  </div>
                  <div className="desc">
                    <p className="skeleton-text medium"></p>
                  </div>
                </div>
                <span className="skeleton-icon small"></span>
              </div>
            ))}

            {/* Pagination skeleton */}
            <div className="pagination skeleton-pagination">
              <div className="skeleton-button small"></div>
              <div className="skeleton-text xshort"></div>
              <div className="skeleton-button small"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading && articles.length === 0 && campaigns.length === 0) {
    return <HomeSkeleton />;
  }
  const fetchArticles = async (pageNum) => {
    try {
      const res = await get(`/articles?page=${pageNum}`);
      setArticles(res.articles);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error("Error fetching articles:", err);
    }
  };
  const fetchcampaigns = async (pageNum) => {
    try {
      const res = await get(`/campaigns/all`);
      console.log(res);
      const activeCampaigns = res.data.filter((campaign) => campaign.isActive);

      console.log(activeCampaigns);
      setcampaigns(activeCampaigns);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    }
  };

  return (
    <div className="page home" dir="auto">
      <div className="hero">
        <div className="media">
          <img src={img} alt="" />
        </div>
        <h2>support sudan.</h2>
        <p>
          Your donation brings food, clean water, and medical care to families
          affected by the crisis in Sudan. Every dollar helps provide urgent aid
          with full transparency.
        </p>
        <div className="links">
          <Link to={"/donate"}>donate now</Link>
        </div>
        {campaigns.map((campaigns, index) => (
          <div className="support" key={index}>
            <span>{icons.target}</span>
            <div className="text">
              <span>{campaigns.cause}</span>
              <p>{campaigns.description}</p>
            </div>
          </div>
        ))}
        <div className="card">
          <div className="title fillNone">
            <p>latest impact articles</p>
            <Link to={"/donate"}>
              <span>{icons.shield}</span>
              <p>Donate</p>
            </Link>
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
      </div>
    </div>
  );
}

export default Home;
