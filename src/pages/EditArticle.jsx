import React, { useState, useEffect, useCallback } from "react";
import icons from "../assets/icons/icons";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Loading from "../components/Loading";

import useAxios from "../hooks/useAxios";
import ROUTES from "../constants/routes";

// --- Helper Functions ---

const formatRelativeDate = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInDays = Math.floor((now - past) / (1000 * 60 * 60 * 24));

  if (diffInDays < 1) return "just now";
  if (diffInDays < 7)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  if (diffInDays < 21) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }
  if (diffInDays < 30) return `3 weeks ago`;
  return past.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const initialArticleState = {
  title: "article title",
  mediaUrl: null,
  userName: localStorage.getItem("name"),
  date: new Date().toISOString(),
  impactType: "",
  impactKind: "",
  location: "location",
  content: "content of the article",
  actions: [],
  note: "add a note",
  showNote: true,
  impacts: [
    {
      id: 1,
      label: "People Impacted",
      icon: icons.group,
      value: "18K people",
      isVisible: true,
    },
    {
      id: 2,
      label: "Wells Repaired",
      icon: icons.wrench,
      value: "12 wells",
      isVisible: true,
    },
    {
      id: 3,
      label: "Time Taken",
      icon: icons.calendar,
      value: "2 weeks",
      isVisible: true,
    },
  ],
  status: "",
  mediaFile: null,
  previewMedia: null,
};

// --- Component ---
function EditArtical() {
  const { data, error, loading, get, post, delete: del, put } = useAxios();

  const { articleId } = useParams();
  const navigate = useNavigate();
  const [articleData, setArticleData] = useState(initialArticleState);
  const [isEditing, setIsEditing] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isNewArticle = !articleId;

  useEffect(() => {
    const fetchArticle = async () => {
      if (articleId) {
        try {
          setIsEditing(false);
          const response = await get(`/articles/${articleId}`);
          setArticleData({
            ...response,
            previewMedia: response?.mediaUrl || water,
            mediaFile: null,
          });
        } catch (error) {
          console.error("Error fetching article:", error);
        }
      } else {
        setIsEditing(true);
        setArticleData(initialArticleState);
      }
    };

    fetchArticle();
  }, [articleId]);

  // --- Handlers ---

  const handleTextChange = useCallback((key, value) => {
    setArticleData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleMediaChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setArticleData((prev) => ({
        ...prev,
        mediaFile: file,
        previewMedia: URL.createObjectURL(file),
      }));
    }
  };

  const handleToggleNote = () => {
    setArticleData((prev) => ({ ...prev, showNote: !prev.showNote }));
  };

  const handleActionChange = (index, value) => {
    const newActions = [...articleData.actions];
    newActions[index] = value;
    setArticleData((prev) => ({ ...prev, actions: newActions }));
  };

  const handleAddAction = () => {
    setArticleData((prev) => ({
      ...prev,
      actions: [...prev.actions, "New Action"],
    }));
  };

  const handleRemoveAction = (index) => {
    setArticleData((prev) => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index),
    }));
  };

  const handleImpactsBlockChange = (index, key, value) => {
    const newImpacts = [...articleData.impacts];
    newImpacts[index] = { ...newImpacts[index], [key]: value };
    setArticleData((prev) => ({ ...prev, impacts: newImpacts }));
  };

  const handleImpactVisibilityToggle = (index) => {
    handleImpactsBlockChange(
      index,
      "isVisible",
      !articleData.impacts[index].isVisible
    );
  };

  const validateInputs = () => {
    const newErrors = {};

    if (!articleData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!articleData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!articleData.content.trim()) {
      newErrors.content = "Content is required";
    }

    const emptyActions = articleData.actions.filter((action) => !action.trim());
    if (emptyActions.length > 0) {
      newErrors.actions = "All actions must have content";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) {
      alert("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add the media file if it exists
      if (articleData.mediaFile) {
        formData.append("media", articleData.mediaFile);
      }

      // Add all other article data
      const { mediaFile, previewMedia, ...submissionData } = articleData;

      // Add fields to FormData
      Object.keys(submissionData).forEach((key) => {
        if (key === "actions" || key === "impacts") {
          // Stringify arrays for FormData
          formData.append(key, JSON.stringify(submissionData[key]));
        } else {
          formData.append(key, submissionData[key]);
        }
      });

      // Add user ID
      formData.append("userId", "user-123");

      let response;

      if (isNewArticle) {
        response = await post(`/articles`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await put(`/articles/${articleId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      toast(
        isNewArticle
          ? "Article created successfully!"
          : "Article updated successfully!",
        {
          style: {
            borderRadius: "var(--border-radius-large)",
            background: "var(--secondary-clr)",
            fontFamily: "var(--arabic-fm-r)",
            color: "var(--txt-clr)",
          },
        }
      );

      if (isNewArticle) {
        navigate(`/admin/article/${response.article._id}`);
      } else {
        setIsEditing(false);
        setArticleData((prev) => ({
          ...response.article,
          previewMedia: response.article.mediaUrl || water,
          mediaFile: null,
        }));
      }
    } catch (error) {
      console.error("Error saving article:", error);

      if (error.response) {
        const serverErrors = error.response.data;
        if (serverErrors.errors) {
          const validationErrors = {};
          serverErrors.errors.forEach((err) => {
            if (err.includes("title")) validationErrors.title = err;
            if (err.includes("location")) validationErrors.location = err;
            if (err.includes("content")) validationErrors.content = err;
          });
          setErrors(validationErrors);
        } else {
          toast.error(
            serverErrors.message || "Error saving article. Please try again.",
            {
              style: {
                borderRadius: "var(--border-radius-large)",
                background: "var(--secondary-clr)",
                fontFamily: "var(--arabic-fm-r)",
                color: "var(--txt-clr)",
              },
            }
          );
        }
      } else if (error.request) {
        toast.error("Network error.", {
          style: {
            borderRadius: "var(--border-radius-large)",
            background: "var(--secondary-clr)",
            fontFamily: "var(--arabic-fm-r)",
            color: "var(--txt-clr)",
          },
        });
      } else {
        toast.error("Error saving article. Please try again.", {
          style: {
            borderRadius: "var(--border-radius-large)",
            background: "var(--secondary-clr)",
            fontFamily: "var(--arabic-fm-r)",
            color: "var(--txt-clr)",
          },
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isNewArticle) {
      setArticleData(initialArticleState);
      setIsEditing((prev) => !prev);
    } else {
      setIsEditing((prev) => !prev);
    }
  };
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this article?"))
      return;

    try {
      setIsDeleting(true);
      await del(`/articles/${articleId}`); // replace with your endpoint

      // Redirect after deletion
      navigate(ROUTES.ADMIN.ARTICLE_LIST);
    } catch (err) {
      console.error("Error deleting article:", err);
      toast.error("Failed to delete article", {
        style: {
          borderRadius: "var(--border-radius-large)",
          background: "var(--secondary-clr)",
          fontFamily: "var(--arabic-fm-r)",
          color: "var(--txt-clr)",
        },
      });
    } finally {
      setIsDeleting(false);
    }
  };
  const handleNewArticle = () => {
    navigate(ROUTES.ADMIN.EDIT_ARTICLE);
  };
  return (
    <div className="page Article" dir="auto">
      {loading && <Loading />}
      <article>
        <div className="header_actions">
          <button popoverTarget="menu">{icons.menu}</button>
          <div id="menu" popover="auto">
            {!isNewArticle && (
              <button
                className="button secondary"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <span> {isEditing ? icons.cancel : icons.write}</span>
                {isEditing ? "Cancel" : "Edit Article"}
              </button>
            )}

            {!isEditing && (
              <button
                className="button secondary"
                onClick={handleNewArticle}
                disabled={isSubmitting}
              >
                <span> {isEditing ? icons.cancel : icons.plus}</span>
                {isEditing ? "Cancel" : "new article"}
              </button>
            )}
            {isEditing && (
              <>
                <button
                  className="button primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  <span>
                    {isSubmitting
                      ? ""
                      : isNewArticle
                      ? icons.plus
                      : icons.write}
                  </span>
                  {isSubmitting
                    ? "Saving..."
                    : isNewArticle
                    ? "Create Article"
                    : "update "}
                </button>

                {/* Delete Button */}
                {!isNewArticle && (
                  <button
                    className="button danger"
                    onClick={handleDelete}
                    disabled={isDeleting} // optional state for delete
                  >
                    <span>{icons.trash}</span>
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        <div className={`media-container ${isEditing ? "editing" : ""}`}>
          {articleData.previewMedia && (
            <img
              src={articleData.previewMedia}
              alt="Article visual"
              className="article-media"
            />
          )}
          {isEditing && (
            <div className="media-upload-overlay">
              <label htmlFor="media-upload" className="upload-button fillNone">
                <span>{icons.upload}</span>
              </label>
              <input
                id="media-upload"
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                style={{ display: "none" }}
              />
            </div>
          )}
        </div>

        <h1
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => handleTextChange("title", e.target.innerText)}
          dangerouslySetInnerHTML={{ __html: articleData.title }}
          className={errors.title ? "input-error" : ""}
        />

        <div className="user_info">
          <span id="avatar">{icons.user}</span>
          <p>{articleData.userName}</p> •
          <span id="date">{formatRelativeDate(articleData.date)}</span>
        </div>
        <div className="impacts info">
          <div className="impact">
            {isEditing ? (
              <select
                name="impactType"
                value={articleData.impactType}
                onChange={(e) => handleTextChange("impactType", e.target.value)}
              >
                <option value=""></option>
                <option value="water">water</option>
                <option value="health">health</option>
                <option value="food">food</option>
                <option value="education">education</option>
              </select>
            ) : (
              <p className="view-mode">{articleData.impactType}</p>
            )}
          </div>
          <div className="impact">
            {isEditing ? (
              <select
                name="impactKind"
                value={articleData.impactKind}
                onChange={(e) => handleTextChange("impactKind", e.target.value)}
              >
                <option value=""></option>
                <option value="impact">impact</option>
                <option value="update">update</option>
              </select>
            ) : (
              <p className="view-mode">{articleData.impactKind}</p>
            )}
          </div>
          <div className="impact">
            <p
              contentEditable={isEditing}
              onBlur={(e) => handleTextChange("location", e.target.innerText)}
              dangerouslySetInnerHTML={{ __html: articleData.location }}
              className={`view-mode ${errors.location ? "input-error" : ""}`}
            />
            {errors.location && (
              <p className="error-message">{errors.location}</p>
            )}
          </div>
          <div className="impact">
            {isEditing ? (
              <select
                name="status"
                value={articleData.status}
                onChange={(e) => handleTextChange("status", e.target.value)}
              >
                <option value=""></option>
                <option value="draft">draft</option>
                <option value="published">published</option>
                <option value="archived">archived</option>
              </select>
            ) : (
              <p className="view-mode">{articleData.status}</p>
            )}
          </div>
        </div>

        <div className="card">
          <span
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleTextChange("content", e.target.innerText)}
            dangerouslySetInnerHTML={{ __html: articleData.content }}
            style={{ width: "100%" }}
          />

          <p>What was done</p>
          <ul className="editable-list">
            {articleData.actions.map((action, index) => (
              <li key={index}>
                <div className="list-content">
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                    onBlur={(e) =>
                      handleActionChange(index, e.target.innerText)
                    }
                    dangerouslySetInnerHTML={{ __html: action }}
                    className={`editable-span ${
                      errors.actions ? "input-error" : ""
                    }`}
                  />
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveAction(index)}
                      className="remove-btn"
                    >
                      {icons.delete}
                    </button>
                  )}
                </div>
              </li>
            ))}
            {isEditing && (
              <li>
                <button onClick={handleAddAction} className="add-btn">
                  {icons.add} Add Action
                </button>
              </li>
            )}
          </ul>

          {isEditing && (
            <div className="note-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={articleData.showNote}
                  onChange={handleToggleNote}
                />
                <p>Show Impact Note</p>
              </label>
            </div>
          )}

          {articleData.showNote && (
            <div className="note">
              <span>{icons.stars}</span>
              <p
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange("note", e.target.innerText)}
                dangerouslySetInnerHTML={{ __html: articleData.note }}
                className="editable-span"
              />
            </div>
          )}

          <div className="impacts">
            {articleData.impacts.map(
              (impact, index) =>
                (impact.isVisible || isEditing) && (
                  <div key={index} className="impact">
                    {isEditing && (
                      <div className="impact-controls">
                        <label>
                          <input
                            type="checkbox"
                            checked={impact.isVisible}
                            onChange={() => handleImpactVisibilityToggle(index)}
                          />
                        </label>
                      </div>
                    )}
                    {impact.label == "People Impacted" ? (
                      <span>{icons.group}</span>
                    ) : impact.label == "Wells Repaired" ? (
                      <span>{icons.wrench}</span>
                    ) : (
                      <span>{icons.calendar}</span>
                    )}
                    <p
                      contentEditable={isEditing}
                      suppressContentEditableWarning={true}
                      onBlur={(e) =>
                        handleImpactsBlockChange(
                          index,
                          "value",
                          e.target.innerText
                        )
                      }
                      dangerouslySetInnerHTML={{ __html: impact.value }}
                      className="editable-span"
                    />
                  </div>
                )
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

export default EditArtical;
