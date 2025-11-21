// hooks/useCampaigns.js
import { useState, useEffect } from "react";
import useAxios from "./useAxios";

const useCampaigns = (page = 1, limit = 5) => {
  const { data, error, loading, get } = useAxios();
  const [campaigns, setCampaigns] = useState([]);
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCampaigns: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await get(`/campaigns?page=${page}&limit=${limit}`);
        const all = await get(`/campaigns/all`);

        // The campaigns array is directly in response.data
        const campaignsData = response?.data || [];
        const allCampaignsData = all?.data || [];

        // Format campaigns for the component
        const formattedCampaigns = formatCampaigns(campaignsData);
        const formattedAllCampaigns = formatCampaigns(allCampaignsData);

        setCampaigns(formattedCampaigns);
        setAllCampaigns(formattedAllCampaigns);
        setPagination({
          currentPage: response?.currentPage || 1,
          totalPages: response?.totalPages || 1,
          totalCampaigns: response?.totalCampaigns || 0,
          hasNextPage: response?.hasNextPage || false,
          hasPrevPage: response?.hasPrevPage || false,
        });
      } catch (err) {
        console.error("Error in useCampaigns:", err);
      }
    };

    fetchCampaigns();
  }, [get, page, limit]);

  return {
    campaigns,
    allCampaigns,
    pagination,
    error,
    loading,
    nextPage: pagination.hasNextPage ? page + 1 : page,
    prevPage: pagination.hasPrevPage ? page - 1 : page,
  };
};

// Format campaigns to match the component's expected structure
const formatCampaigns = (campaigns) => {
  if (!campaigns || !Array.isArray(campaigns)) {
    console.warn("formatCampaigns received invalid data:", campaigns);
    return [];
  }

  return campaigns
    .map((campaign) => {
      if (!campaign) {
        console.warn("Invalid campaign item:", campaign);
        return null;
      }

      const progress =
        campaign.progress ||
        (campaign.totalRaised / campaign.targetAmount) * 100;
      const donorCount = campaign.donorCount || 0;

      return {
        id: campaign._id,
        title: campaign.title || "Untitled Campaign",
        cause: campaign.cause || "General Cause",
        targetAmount: campaign.targetAmount || 0,
        totalRaised: campaign.totalRaised || 0,
        progress: Math.round(progress),
        status: getCampaignStatus(campaign.status),
        donorCount: donorCount,
        startDate: formatDate(campaign.startDate || campaign.createdAt),
        endDate: formatDate(campaign.endDate),
        createdAt: formatDate(campaign.createdAt),
        updatedAt: formatDate(campaign.updatedAt),
        description: campaign.description || "",
        originalData: campaign,
      };
    })
    .filter(Boolean); // Remove any null entries
};

// Format date to "MMM DD, YYYY" format
const formatDate = (dateString) => {
  if (!dateString) return "Ongoing";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (error) {
    console.warn("Error formatting date:", dateString, error);
    return "Invalid Date";
  }
};

// Convert campaign status to display format
const getCampaignStatus = (status) => {
  const statusMap = {
    draft: "Draft",
    active: "Active",
    archived: "Archived",
    completed: "Completed",
    paused: "Paused",
  };

  return statusMap[status] || "Draft";
};

export default useCampaigns;
