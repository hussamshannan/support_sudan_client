import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { toast } from "react-hot-toast";

function AdminEditCampaign() {
  const { campaignId } = useParams(); // Get campaign ID from URL
  const navigate = useNavigate();
  const { data, error, loading, get, post, delete: del, put } = useAxios();

  const [campaign, setCampaign] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cause: "",
    status: "draft",
    targetAmount: "",
    startDate: "",
    endDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(!campaignId); // True if no campaignId in URL

  // Fetch campaign data when component mounts or ID changes
  useEffect(() => {
    const fetchCampaign = async () => {
      if (!campaignId) {
        setIsCreating(true);
        return;
      }

      try {
        setIsLoading(true);
        const response = await get(`/campaigns/byid/${campaignId}`);
        if (response.success) {
          setCampaign(response.data);
          // Pre-fill form with campaign data
          setFormData({
            title: response.data.title || "",
            description: response.data.description || "",
            cause: response.data.cause || "",
            status: response.data.status || "draft",
            targetAmount: response.data.targetAmount || "",
            startDate: response.data.startDate
              ? new Date(response.data.startDate).toISOString().split("T")[0]
              : "",
            endDate: response.data.endDate
              ? new Date(response.data.endDate).toISOString().split("T")[0]
              : "",
          });
          setIsCreating(false);
        } else {
          toast.error("Campaign not found", {
            style: {
              borderRadius: "var(--border-radius-large)",
              background: "var(--secondary-clr)",
              fontFamily: "var(--arabic-fm-r)",
              color: "var(--txt-clr)",
            },
          });
          setIsCreating(true);
        }
      } catch (err) {
        toast.error("Error fetching campaign", {
          style: {
            borderRadius: "var(--border-radius-large)",
            background: "var(--secondary-clr)",
            fontFamily: "var(--arabic-fm-r)",
            color: "var(--txt-clr)",
          },
        });
        console.error("Error fetching campaign:", err);
        setIsCreating(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId, get]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create new campaign
  const handleCreate = async () => {
    try {
      setIsLoading(true);

      const createData = {
        ...formData,
        targetAmount: Number(formData.targetAmount),
      };

      const response = await post(`/campaigns`, createData);

      if (response.success) {
        toast.success("Campaign created successfully!", {
          style: {
            borderRadius: "var(--border-radius-large)",
            background: "var(--secondary-clr)",
            fontFamily: "var(--arabic-fm-r)",
            color: "var(--txt-clr)",
          },
        });
        setCampaign(response.data);
        setIsCreating(false);
        // Redirect to the edit page for the new campaign
        navigate(`/admin/editcampaigns/${response.data._id}`);
      } else {
        toast.error(response.message || "Failed to create campaign", {
          style: {
            borderRadius: "var(--border-radius-large)",
            background: "var(--secondary-clr)",
            fontFamily: "var(--arabic-fm-r)",
            color: "var(--txt-clr)",
          },
        });
      }
    } catch (err) {
      toast.error("Error creating campaign", {
        style: {
          borderRadius: "var(--border-radius-large)",
          background: "var(--secondary-clr)",
          fontFamily: "var(--arabic-fm-r)",
          color: "var(--txt-clr)",
        },
      });
      console.error("Error creating campaign:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update campaign
  const handleUpdate = async () => {
    if (!campaignId) return;

    try {
      setIsLoading(true);

      const updateData = {
        ...formData,
        targetAmount: Number(formData.targetAmount),
      };

      const response = await put(`/campaigns/${campaignId}`, updateData);
      if (response.success) {
        toast.success("Campaign updated successfully!", {
          style: {
            borderRadius: "var(--border-radius-large)",
            background: "var(--secondary-clr)",
            fontFamily: "var(--arabic-fm-r)",
            color: "var(--txt-clr)",
          },
        });
        setCampaign(response.data);
      } else {
        toast.error(response.message || "Failed to update campaign", {
          style: {
            borderRadius: "var(--border-radius-large)",
            background: "var(--secondary-clr)",
            fontFamily: "var(--arabic-fm-r)",
            color: "var(--txt-clr)",
          },
        });
      }
    } catch (err) {
      toast.error("Error updating campaign", {
        style: {
          borderRadius: "var(--border-radius-large)",
          background: "var(--secondary-clr)",
          fontFamily: "var(--arabic-fm-r)",
          color: "var(--txt-clr)",
        },
      });
      console.error("Error updating campaign:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete campaign
  const handleDelete = async () => {
    if (
      !campaignId ||
      !window.confirm(
        "Are you sure you want to delete this campaign? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await del(`/campaigns/${campaignId}`);

      if (response.success) {
        toast.success("Campaign deleted successfully!");
        // Redirect to campaigns list after 2 seconds
        setTimeout(() => {
          navigate("/admin/campaigns");
        }, 2000);
      } else {
        toast.error(response.message || "Failed to delete campaign", {
          style: {
            borderRadius: "var(--border-radius-large)",
            background: "var(--secondary-clr)",
            fontFamily: "var(--arabic-fm-r)",
            color: "var(--txt-clr)",
          },
        });
      }
    } catch (err) {
      toast.error("Error deleting campaign", {
        style: {
          borderRadius: "var(--border-radius-large)",
          background: "var(--secondary-clr)",
          fontFamily: "var(--arabic-fm-r)",
          color: "var(--txt-clr)",
        },
      });
      console.error("Error deleting campaign:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset campaign (set raised amount to 0)
  const handleReset = async () => {
    if (
      !campaignId ||
      !window.confirm(
        "Are you sure you want to reset this campaign? This will set raised amount to 0 and reset donor count."
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await put(`/campaigns/${campaignId}/reset`, {});

      if (response.success) {
        toast.success("Campaign reset successfully!", {
          style: {
            borderRadius: "var(--border-radius-large)",
            background: "var(--secondary-clr)",
            fontFamily: "var(--arabic-fm-r)",
            color: "var(--txt-clr)",
          },
        });
        setCampaign(response.data);
      } else {
        toast.error(response.message || "Failed to reset campaign", {
          style: {
            borderRadius: "var(--border-radius-large)",
            background: "var(--secondary-clr)",
            fontFamily: "var(--arabic-fm-r)",
            color: "var(--txt-clr)",
          },
        });
      }
    } catch (err) {
      toast.error("Error resetting campaign", {
        style: {
          borderRadius: "var(--border-radius-large)",
          background: "var(--secondary-clr)",
          fontFamily: "var(--arabic-fm-r)",
          color: "var(--txt-clr)",
        },
      });
      console.error("Error resetting campaign:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form to original campaign data or clear for new campaign
  const handleResetForm = () => {
    if (campaign && !isCreating) {
      setFormData({
        title: campaign.title || "",
        description: campaign.description || "",
        cause: campaign.cause || "",
        status: campaign.status || "draft",
        targetAmount: campaign.targetAmount || "",
        startDate: campaign.startDate
          ? new Date(campaign.startDate).toISOString().split("T")[0]
          : "",
        endDate: campaign.endDate
          ? new Date(campaign.endDate).toISOString().split("T")[0]
          : "",
      });
      toast.success("Form reset to original values", {
        style: {
          borderRadius: "var(--border-radius-large)",
          background: "var(--secondary-clr)",
          fontFamily: "var(--arabic-fm-r)",
          color: "var(--txt-clr)",
        },
      });
    } else {
      // Clear form for new campaign
      setFormData({
        title: "",
        description: "",
        cause: "",
        status: "draft",
        targetAmount: "",
        startDate: "",
        endDate: "",
      });
      toast.success("Form cleared", {
        style: {
          borderRadius: "var(--border-radius-large)",
          background: "var(--secondary-clr)",
          fontFamily: "var(--arabic-fm-r)",
          color: "var(--txt-clr)",
        },
      });
    }
  };

  // Create new campaign mode
  const handleNewCampaign = () => {
    setIsCreating(true);
    setFormData({
      title: "",
      description: "",
      cause: "",
      status: "draft",
      targetAmount: "",
      startDate: "",
      endDate: "",
    });
    navigate("/admin/editcampaigns/new");
  };

  if (loading || isLoading) {
    return (
      <div className="page AdminEditCampaign">
        <div className="loading">Loading campaign data...</div>
      </div>
    );
  }

  if (error && !campaign && !isCreating) {
    return (
      <div className="page AdminEditCampaign">
        <div className="error">Error loading campaign: {error}</div>
      </div>
    );
  }

  return (
    <div className="page AdminEditCampaign">
      {/* Header with mode indication */}
      <div className="form-container">
        <div className="side">
          <h6>Basics</h6>
          <label htmlFor="title">
            <p>Campaign Name</p>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter campaign name"
            />
          </label>
          <label htmlFor="description">
            <p>Short Description</p>
            <textarea
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter campaign description"
            />
          </label>
          <div className="twoInputs">
            <label htmlFor="cause">
              <p>Cause</p>
              <input
                type="text"
                id="cause"
                name="cause"
                value={formData.cause}
                onChange={handleInputChange}
                placeholder="e.g., Food & Water"
              />
            </label>
            <label htmlFor="status">
              <p>Status</p>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </label>
          </div>
        </div>
        {!isCreating && campaign && (
          <div className="campaign-stats">
            <h6>Current Stats</h6>
            <label>
              <p>Raised Amount:</p>
              <span>${campaign.totalRaised?.toLocaleString()}</span>
            </label>
            <label>
              <p>Donor Count:</p>
              <span>{campaign.donorCount}</span>
            </label>
            <label>
              <p>Progress:</p>
              <span>{campaign.progress}%</span>
            </label>
            <label>
              <p>Days Remaining:</p>
              <span>
                {campaign.daysRemaining > 0
                  ? campaign.daysRemaining
                  : "Expired"}
              </span>
            </label>
          </div>
        )}
        <div className="side">
          <h6>Funding</h6>
          <label htmlFor="targetAmount">
            <p>Goal Amount (USD)</p>
            <input
              type="number"
              id="targetAmount"
              name="targetAmount"
              value={formData.targetAmount}
              onChange={handleInputChange}
              min="1"
              placeholder="Enter target amount"
            />
          </label>

          <div className="twoInputs">
            <label htmlFor="startDate">
              <p>Start Date</p>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </label>
            <label htmlFor="endDate">
              <p>End Date</p>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
              />
            </label>
          </div>
        </div>
        {/* Campaign stats overview (only for existing campaigns) */}

        <div className="actions">
          {isCreating ? (
            <>
              <button
                onClick={handleCreate}
                disabled={isLoading}
                className="btn-success"
              >
                <p>{isLoading ? "Creating..." : "Create Campaign"}</p>
              </button>
              <button
                onClick={handleResetForm}
                disabled={isLoading}
                className="btn-secondary"
              >
                <p>Clear Form</p>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="btn-primary"
              >
                <p>{isLoading ? "Updating..." : "Update Campaign"}</p>
              </button>
              <button
                onClick={handleResetForm}
                disabled={isLoading}
                className="btn-secondary"
              >
                <p>Reset Form</p>
              </button>
              <button
                onClick={handleReset}
                disabled={isLoading}
                className="btn-warning"
              >
                <p>Reset Data</p>
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="btn-danger"
              >
                <p>Delete Campaign</p>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminEditCampaign;
