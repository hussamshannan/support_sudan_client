import React, { useState, useEffect } from "react";
import useRecentDonations from "../hooks/useRecentDonations";
import useCSVExport from "../hooks/useCSVExport";
import icons from "../assets/icons/icons";

function QuickActions() {
  const { donations, allDonations, loading, error } = useRecentDonations(
    1,
    1000
  );
  const { exportCSV } = useCSVExport();
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: "",
    cause: "",
    method: "",
    status: "",
  });

  // Get unique values for dropdowns
  const uniqueCauses = [...new Set(allDonations?.map((d) => d.cause) || [])];
  const uniqueMethods = [...new Set(allDonations?.map((d) => d.method) || [])];
  const uniqueStatuses = [...new Set(allDonations?.map((d) => d.status) || [])];

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

  // Filter donations based on selected filters
  const filteredDonations = React.useMemo(() => {
    if (!allDonations || !Array.isArray(allDonations)) return [];

    return allDonations.filter((donation) => {
      // Date range filter
      if (filters.dateRange) {
        const startDate = getDateRange(filters.dateRange);
        if (startDate) {
          const donationDate = new Date(
            donation.originalData?.createdAt || donation.date
          );
          if (donationDate < startDate) return false;
        }
      }

      // Cause filter
      if (filters.cause && donation.cause !== filters.cause) return false;

      // Method filter
      if (
        filters.method &&
        donation.method.toLowerCase() !== filters.method.toLowerCase()
      )
        return false;

      // Status filter
      if (
        filters.status &&
        donation.status.toLowerCase() !== filters.status.toLowerCase()
      )
        return false;

      return true;
    });
  }, [allDonations, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      dateRange: "",
      cause: "",
      method: "",
      status: "",
    });
  };

  const handleExportCSV = () => {
    const donationsToExport =
      filteredDonations.length > 0 ? filteredDonations : allDonations;

    // Generate filename based on filters
    let fileName = "donations";

    if (filters.dateRange) {
      const dateRangeText = getDateRangeDisplay()
        .toLowerCase()
        .replace(/\s+/g, "_");
      fileName += `_${dateRangeText}`;
    }

    if (filters.cause) {
      fileName += `_${filters.cause.toLowerCase().replace(/\s+/g, "_")}`;
    }

    if (filters.method) {
      fileName += `_${filters.method.toLowerCase()}`;
    }

    if (filters.status) {
      fileName += `_${filters.status.toLowerCase()}`;
    }

    fileName += ".csv";

    exportCSV(donationsToExport, fileName);
    setIsFilterPopupOpen(false);
    clearFilters();
  };

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

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="QuickActions">
      <div className="left">
        <span>{icons.bolt}</span>
        <p>Quick actions</p>
      </div>
      <div className="right">
        <button onClick={() => setIsFilterPopupOpen(true)} id="primary">New Campaign</button>
        <button onClick={() => setIsFilterPopupOpen(true)}>Export CSV</button>
      </div>

      {/* Filter Popup */}
      {isFilterPopupOpen && (
        <div className="filter-popup-overlay">
          <div className="popup-header">
            <h3>Filter Donations for Export</h3>
          </div>

          <div className="popup-content">
            <p>Filter Options:</p>
            <div className="filter-section">
              <div className="filter-group">
                <label>Date:</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) =>
                    handleFilterChange("dateRange", e.target.value)
                  }
                  className="filter-select"
                >
                  <option value="">All Time</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                </select>
              </div>

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
                <label>Method:</label>
                <select
                  value={filters.method}
                  onChange={(e) => handleFilterChange("method", e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Methods</option>
                  {uniqueMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
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
            </div>
          </div>

          <div className="export-info">
            <p>
              Exporting: <strong>{filteredDonations.length}</strong> donations
              {hasActiveFilters && " (filtered)"}
            </p>
          </div>
          <div className="popup-footer">
            <button
              onClick={clearFilters}
              className="clear-btn"
              disabled={!hasActiveFilters}
            >
              <p> Clear Filters</p>
            </button>
            <div className="action-buttons">
              <button
                onClick={() => {
                  setIsFilterPopupOpen(false);
                  clearFilters();
                }}
                className="cancel-btn"
              >
                <span>{icons.cancel}</span> <p>Cancel</p>
              </button>
              <button
                onClick={handleExportCSV}
                className="export-btn"
                disabled={filteredDonations.length === 0}
              >
                <span> {icons.download}</span>
                <p> Export CSV</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuickActions;
