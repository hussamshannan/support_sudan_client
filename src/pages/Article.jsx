import React, { useEffect, useState } from "react";
import icons from "../assets/icons/icons";
import useAxios from "../hooks/useAxios";
import Loading from "../components/Loading";

import { Link, useParams } from "react-router-dom";
function Article({ show }) {
  const { data, error, loading, get, post, put } = useAxios();
  const { articleId } = useParams();

  const [article, setArticle] = useState({ actions: [] });
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchArticles(page);
  }, [page]);

  const fetchArticles = async (pageNum) => {
    try {
      const res = await get(`/articles/${articleId}`);

      console.log(res);
      setArticle(res);
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

  return show ? (
    <div className={`page Article`} dir="auto">
      {loading && <Loading />}

      <article>
        <div className="media-container">
          <img src={article?.mediaUrl} alt={article?.title} />
        </div>
        <h1>{article?.title}</h1>
        <div className="user_info">
          <span id="avatar">{icons.user}</span>
          <p>{article?.userName}</p> •
          <span id="date">{formatRelativeDate(article?.updatedAt)}</span>
        </div>
        <div className="impacts info">
          <div className="impact">
            <p>{article?.impactType}</p>
          </div>
          <div className="impact">
            <p>{article?.impactKind}</p>
          </div>
          <div className="impact">
            <p>{article?.location}</p>
          </div>
        </div>
        <div className="card">
          <span>{article?.content}</span>
          <p>what was done</p>
          <ul>
            {article?.actions.map((action, index) => (
              <li key={index}>{action}</li>
            ))}
          </ul>
          {article?.showNote && (
            <div className="note">
              <span>{icons.stars}</span>
              <p>{article.note}</p>
            </div>
          )}

          <div className="impacts">
            {article?.impacts
              ?.filter((impact) => impact.isVisible) // show only visible ones
              .map((impact, index) => (
                <div className="impact" key={impact._id || index}>
                  {/* choose an icon based on the label */}
                  <span>
                    {impact.label.toLowerCase().includes("people")
                      ? icons.group
                      : impact.label.toLowerCase().includes("well")
                      ? icons.wrench
                      : impact.label.toLowerCase().includes("time")
                      ? icons.calendar
                      : icons.stars}
                  </span>
                  <p>{impact.value}</p>
                </div>
              ))}
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
  ) : (
    <article>
      <div className="media-container">
        <img src={article?.mediaUrl} alt={article?.title} />
      </div>
      <h1>{article?.title}</h1>
      <div className="user_info">
        <span id="avatar">{icons.user}</span>
        <p>{article?.userName}</p> •
        <span id="date">{formatRelativeDate(article?.updatedAt)}</span>
      </div>
      <div className="impacts info">
        <div className="impact">
          <p>{article?.impactType}</p>
        </div>
        <div className="impact">
          <p>{article?.impactKind}</p>
        </div>
        <div className="impact">
          <p>{article?.location}</p>
        </div>
      </div>
      <div className="card">
        <span>{article?.content}</span>
        <p>what was done</p>
        <ul>
          {article?.actions.map((action, index) => (
            <li key={index}>{action}</li>
          ))}
        </ul>
        {article?.showNote && (
          <div className="note">
            <span>{icons.stars}</span>
            <p>{article.note}</p>
          </div>
        )}

        <div className="impacts">
          {article?.impacts
            ?.filter((impact) => impact.isVisible) // show only visible ones
            .map((impact, index) => (
              <div className="impact" key={impact._id || index}>
                {/* choose an icon based on the label */}
                <span>
                  {impact.label.toLowerCase().includes("people")
                    ? icons.group
                    : impact.label.toLowerCase().includes("well")
                    ? icons.wrench
                    : impact.label.toLowerCase().includes("time")
                    ? icons.calendar
                    : icons.stars}
                </span>
                <p>{impact.value}</p>
              </div>
            ))}
        </div>
      </div>
      {show && (
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
      )}
    </article>
  );
}

export default Article;
