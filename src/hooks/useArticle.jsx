import { useState, useEffect } from "react";
import useAxios from "./useAxios";

const useArticle = (page = 1, limit = 5) => {
  const { data, error, loading, get } = useAxios();
  const [allArticle, setAllArticle] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalArticle: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    const fetchRecentArticle = async () => {
      try {
        const response = await get(`/articles/all`);

        // The articles array is directly in response.data
        const allArticleData = response?.data || [];

        // Format articles for the component
        const formattedAllArticle = formatArticle(allArticleData);

        setAllArticle(formattedAllArticle);
        setPagination({
          currentPage: page,
          totalPages: Math.ceil(allArticleData.length / limit),
          totalArticle: allArticleData.length,
          hasNextPage: page < Math.ceil(allArticleData.length / limit),
          hasPrevPage: page > 1,
        });
      } catch (err) {
        console.error("Error in useArticle:", err);
      }
    };

    fetchRecentArticle();
  }, [get, page, limit]);

  return {
    allArticle,
    pagination,
    error,
    loading,
    nextPage: pagination.hasNextPage ? page + 1 : page,
    prevPage: pagination.hasPrevPage ? page - 1 : page,
  };
};

// Format articles to match the component's expected structure
const formatArticle = (articles) => {
  if (!articles || !Array.isArray(articles)) {
    console.warn("formatArticle received invalid data:", articles);
    return [];
  }

  return articles
    .map((article) => {
      if (!article) {
        console.warn("Invalid article item:", article);
        return null;
      }

      return {
        id: article._id,
        title: article.title || "Untitled Article",
        date: formatDate(article.date || article.createdAt),
        author: article.userName || "Unknown Author",
        impactType: article.impactType || "General",
        impactKind: article.impactKind || "impact",
        location: article.location || "Not specified",
        content: article.content || "",
        status: getArticleStatus(article.status),
        mediaUrl: article.mediaUrl || "",
        note: article.note || "",
        showNote: article.showNote || false,
        actions: article.actions || [],
        impacts: article.impacts || [],
        slug: article.slug || "",
        createdAt: formatDate(article.createdAt),
        updatedAt: formatDate(article.updatedAt),
        originalData: article,
      };
    })
    .filter(Boolean);
};

// Format date to readable format
const formatDate = (dateString) => {
  if (!dateString) return "Unknown Date";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.warn("Error formatting date:", dateString, error);
    return "Invalid Date";
  }
};

// Convert article status to display format
const getArticleStatus = (status) => {
  const statusMap = {
    draft: "Draft",
    published: "Published",
    archived: "Archived",
    pending: "Pending Review",
  };

  return statusMap[status] || "Draft";
};

export default useArticle;
