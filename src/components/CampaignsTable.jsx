// components/CampaignsTable.js
import React, { useState, useMemo } from "react";
import useCampaigns from "../hooks/useCampaigns";
import useCampaignCSVExport from "../hooks/useCampaignCSVExport";
import icons from "../assets/icons/icons";
import { useNavigate } from "react-router-dom";
import ROUTES from "../constants/routes";
const CampaignsTable = ({ show, isfilters }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const {
    campaigns,
    allCampaigns,
    pagination,
    loading,
    error,
    nextPage,
    prevPage,
  } = useCampaigns(currentPage, 5);

  // Use the CSV export hook
  const { exportCSV } = useCampaignCSVExport();

  // Filter states
  const [filters, setFilters] = useState({
    status: "",
    cause: "",
    dateRange: "",
  });

  // Calculate date range based on selection
  const getDateRange = (range) => {
    const now = new Date();
    const startDate = new Date();

    switch (range) {
      case "7days":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90days":
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        return null;
    }

    return startDate;
  };

  // Filter campaigns based on selected filters
  const filteredCampaigns = useMemo(() => {
    return allCampaigns.filter((campaign) => {
      // Status filter
      if (filters.status && campaign.status !== filters.status) return false;

      // Cause filter
      if (filters.cause && campaign.cause !== filters.cause) return false;

      // Date range filter (based on creation date)
      if (filters.dateRange) {
        const startDate = getDateRange(filters.dateRange);
        if (startDate) {
          const campaignDate = new Date(
            campaign.originalData?.createdAt || campaign.createdAt
          );
          if (campaignDate < startDate) return false;
        }
      }

      return true;
    });
  }, [allCampaigns, filters]);

  // Paginate filtered campaigns - show 5 at a time
  const paginatedFilteredCampaigns = useMemo(() => {
    const startIndex = (currentPage - 1) * 5;
    return filteredCampaigns.slice(startIndex, startIndex + 5);
  }, [filteredCampaigns, currentPage]);

  // Calculate pagination for filtered results
  const filteredPagination = {
    currentPage,
    totalPages: Math.ceil(filteredCampaigns.length / 5),
    totalCampaigns: filteredCampaigns.length,
    hasNextPage: currentPage < Math.ceil(filteredCampaigns.length / 5),
    hasPrevPage: currentPage > 1,
  };

  // Get unique values for dropdowns
  const uniqueCauses = [...new Set(allCampaigns.map((c) => c.cause))];
  const uniqueStatuses = [...new Set(allCampaigns.map((c) => c.status))];

  const handleNextPage = () => {
    if (filteredPagination.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (filteredPagination.hasPrevPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRetry = () => {
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      cause: "",
      dateRange: "",
    });
    setCurrentPage(1);
  };

  // Handle CSV export with filtered data
  const handleExportCSV = () => {
    // Generate filename based on filters
    let fileName = "campaigns";

    if (filters.dateRange) {
      const dateRangeText = getDateRangeDisplay()
        .toLowerCase()
        .replace(/\s+/g, "_");
      fileName += `_${dateRangeText}`;
    }

    if (filters.cause) {
      fileName += `_${filters.cause.toLowerCase().replace(/\s+/g, "_")}`;
    }

    if (filters.status) {
      fileName += `_${filters.status.toLowerCase()}`;
    }

    fileName += ".csv";

    // Pass the filtered campaigns to the CSV export hook
    exportCSV(filteredCampaigns, fileName);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  // Get display text for current date range
  const getDateRangeDisplay = () => {
    switch (filters.dateRange) {
      case "7days":
        return "Last 7 Days";
      case "30days":
        return "Last 30 Days";
      case "90days":
        return "Last 90 Days";
      default:
        return "All Time";
    }
  };
  function handleEdit(campaignId) {
    navigate(ROUTES.ADMIN.EDIT_CAMPAIGN.replace(":campaignId?", campaignId));
  }
  if (loading) {
    return (
      <div className="campaigns-table">
        <h3>Campaigns</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Cause</th>
              <th>Progress</th>
              <th>Raised</th>
              <th>Status</th>
              <th>Donors</th>
              <th>Actions</th>
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
                <td>
                  <div className="skeleton"></div>
                </td>

                <td>
                  <div className="skeleton"></div>
                </td>
                <td>
                  <div className="skeleton"></div>
                </td>
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
      <div className="campaigns-table">
        <h3>Campaigns</h3>
        <div className="error-message">
          Failed to load campaigns. Please try again.
          <button onClick={handleRetry} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="campaigns-table">
      <div className="header-with-filters">
        {!show && <h3>Campaigns</h3>}

        {show && (
          <div className="filters">
            <div className="filter-group">
              <label>Cause:</label>
              <select
                value={filters.cause}
                onChange={(e) => handleFilterChange("cause", e.target.value)}
                className="filter-select"
              >
                <option value="">All Causes</option>
                {uniqueCauses.map((cause) => (
                  <option key={cause} value={cause}>
                    {cause}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Status:</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="filter-select"
              >
                <option value="">All Status</option>
                {uniqueStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear Filters
              </button>
            )}

            {/* Add Export CSV button */}
            {show && (
              <button
                onClick={handleExportCSV}
                className="export-csv-btn"
                disabled={filteredCampaigns.length === 0}
              >
                <span>{icons.download}</span> Export CSV
              </button>
            )}
          </div>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Cause</th>
            <th>Progress</th>
            {show && <th>Raised</th>}
            <th>Status</th>
            {show && <th>Donors</th>}
            {show && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {paginatedFilteredCampaigns.map((campaign) => (
            <tr key={campaign.id}>
              <td>
                <span className="title">{campaign.title}</span>
              </td>

              <td>
                <span className="cause">{campaign.cause}</span>
              </td>

              <td>
                <div className="progress-container">
                  <span className="progress-text">{campaign.progress}%</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${campaign.progress}%` }}
                    ></div>
                  </div>
                </div>
              </td>

              {show && (
                <td>
                  <span className="raised">
                    ${campaign.totalRaised.toLocaleString()}
                  </span>
                  <span className="target">
                    / ${campaign.targetAmount.toLocaleString()}
                  </span>
                </td>
              )}

              <td>
                <span className={`status ${campaign.status.toLowerCase()}`}>
                  {campaign.status}
                </span>
              </td>

              {show && (
                <td>
                  <span className="donors">{campaign.donorCount} donors</span>
                </td>
              )}
              {show && (
                <td>
                  <span className="actions">
                    <button
                      onClick={() => handleEdit(campaign.id)}
                      className="action-btn edit-btn"
                      title="Edit cause"
                    >
                      edit
                    </button>
                  </span>
                </td>
              )}
            </tr>
          ))}

          {paginatedFilteredCampaigns.length === 0 && (
            <tr>
              <td colSpan={show ? 6 : 5} className="no-data">
                {hasActiveFilters
                  ? "No campaigns match your filters"
                  : "No campaigns found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="footer">
        <p>
          Showing {paginatedFilteredCampaigns.length} of{" "}
          {filteredCampaigns.length} campaigns
          {hasActiveFilters && ` • ${getDateRangeDisplay()}`}
        </p>

        <div className="pagination-controls">
          <button
            onClick={handlePrevPage}
            disabled={!filteredPagination.hasPrevPage}
            className="pagination-btn"
          >
            Prev
          </button>

          <button
            onClick={handleNextPage}
            disabled={!filteredPagination.hasNextPage}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignsTable;
