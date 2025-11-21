import React, { useState } from "react";
import useArticle from "../hooks/useArticle";
import icons from "../assets/icons/icons";
import { Link, useNavigate } from "react-router-dom";
import ROUTES from "../constants/routes";
const ArticleTable = ({ show }) => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const { allArticle, pagination, loading, error, nextPage, prevPage } =
    useArticle(currentPage, 5);

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.hasPrevPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRetry = () => {
    setCurrentPage(1);
  };

  // Handle edit action
  const handleEdit = (articleId) => {
    navigate(
      ROUTES.ADMIN.EDIT_ARTICLE_WITH_ID.replace(":articleId?", articleId)
    );

    // Add your edit logic here
  };

  // Handle open action
  const handleOpen = (articleId) => {
    navigate(ROUTES.ADMIN.ARTICLE.replace(":articleId?", articleId));

    // Add your open logic here
  };

  if (loading) {
    return (
      <div className="article-table">
        {show ? <h3>Overview</h3> : <h3>Articles</h3>}
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Last Update</th>
              {show && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="loading-row">
                <td>
                  <div className="skeleton"></div>
                </td>
                <td>
                  <div className="skeleton"></div>
                </td>
                <td>
                  <div className="skeleton"></div>
                </td>
                <td>
                  <div className="skeleton"></div>
                </td>
                {show && (
                  <td>
                    <div className="skeleton"></div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="footer">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="article-table">
        {show ? <h3>Overview</h3> : <h3>Articles</h3>}
        <div className="error-message">
          Failed to load articles. Please try again.
          <button onClick={handleRetry} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="article-table">
      <div className="header">
        {show ? <h3>Overview</h3> : <h3>Articles</h3>}
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Status</th>
            <th>Last Update</th>
            {show && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {allArticle.map((article) => (
            <tr key={article.id}>
              <td>
                <span className="title">{article.title}</span>
              </td>

              <td>
                <span className="author">{article.author}</span>
              </td>

              <td>
                <span
                  className={`status ${article.status
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {article.status}
                </span>
              </td>

              <td>
                <span className="last-update">{article.updatedAt}</span>
              </td>

              {show && (
                <td>
                  <div className="actions">
                    <button
                      onClick={() => handleEdit(article.id)}
                      className="action-btn edit-btn"
                      title="Edit Article"
                    >
                      edit
                    </button>
                    <button
                      onClick={() => handleOpen(article.id)}
                      className="action-btn open-btn"
                      title="Open Article"
                    >
                      open
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}

          {allArticle.length === 0 && (
            <tr>
              <td colSpan={5} className="no-data">
                No articles found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="footer">
        <p>
          Showing {allArticle.length} of {pagination.totalArticle} articles
        </p>

        <div className="pagination-controls">
          <button
            onClick={handlePrevPage}
            disabled={!pagination.hasPrevPage}
            className="pagination-btn"
          >
            Prev
          </button>

          <button
            onClick={handleNextPage}
            disabled={!pagination.hasNextPage}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleTable;
