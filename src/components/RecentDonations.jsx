import React, { useState, useMemo } from "react";
import useRecentDonations from "../hooks/useRecentDonations";
import useCSVExport from "../hooks/useCSVExport"; // Import the CSV export hook
import icons from "../assets/icons/icons";
const RecentDonations = ({ show, isfilters }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    donations,
    allDonations,
    pagination,
    loading,
    error,
    nextPage,
    prevPage,
  } = useRecentDonations(currentPage, 100);

  // Use the CSV export hook
  const { exportCSV } = useCSVExport();

  // Filter states
  const [filters, setFilters] = useState({
    dateRange: "",
    cause: "",
    method: "",
    status: "",
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

  // Filter donations based on selected filters
  const filteredDonations = useMemo(() => {
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

  // Paginate filtered donations - show 5 at a time
  const paginatedFilteredDonations = useMemo(() => {
    const startIndex = (currentPage - 1) * 5;
    return filteredDonations.slice(startIndex, startIndex + 5);
  }, [filteredDonations, currentPage]);

  // Calculate pagination for filtered results
  const filteredPagination = {
    currentPage,
    totalPages: Math.ceil(filteredDonations.length / 5),
    totalDonations: filteredDonations.length,
    hasNextPage: currentPage < Math.ceil(filteredDonations.length / 5),
    hasPrevPage: currentPage > 1,
  };

  // Get unique values for dropdowns
  const uniqueCauses = [...new Set(allDonations.map((d) => d.cause))];
  const uniqueMethods = [...new Set(allDonations.map((d) => d.method))];
  const uniqueStatuses = [...new Set(allDonations.map((d) => d.status))];

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
      dateRange: "",
      cause: "",
      method: "",
      status: "",
    });
    setCurrentPage(1);
  };

  // Handle CSV export with filtered data
  const handleExportCSV = () => {
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

    // Pass the filtered donations to the CSV export hook
    exportCSV(filteredDonations, fileName);
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

  if (loading) {
    return (
      <div className="recent-donations">
        <h3>Recent donations</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Donor / Cause</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              {show ? <th>Reciept</th> : null}
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
                {show ? (
                  <td>
                    <div className="skeleton"></div>
                  </td>
                ) : null}
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
      <div className="recent-donations">
        <h3>Recent donations</h3>
        <div className="error-message">
          Failed to load recent donations. Please try again.
          <button onClick={handleRetry} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-donations">
      <div className="header-with-filters">
        {!isfilters && <h3>Recent donations</h3>}

        {isfilters && (
          <div className="filters">
            <div className="filter-group">
              <label>Date:</label>
              <select
                value={filters.dateRange}
                onChange={(e) =>
                  handleFilterChange("dateRange", e.target.value)
                }
                className="filter-select"
              >
                <option value="">View All</option>
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
                disabled={filteredDonations.length === 0}
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
            <th>Date</th>
            <th>Donor / Cause</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
            {show ? <th>Reciept</th> : null}
          </tr>
        </thead>

        <tbody>
          {paginatedFilteredDonations.map((donation) => (
            <tr key={donation.id}>
              <td>{donation.date}</td>

              <td>
                <span className="donor">{donation.donor}</span>
                <span className="cause"> — {donation.cause}</span>
              </td>

              <td>${donation.amount.toLocaleString()}</td>

              <td>
                <span className={`method ${donation.method.toLowerCase()}`}>
                  {donation.method}
                </span>
              </td>

              <td>
                <span className={`status ${donation.status.toLowerCase()}`}>
                  {donation.status}
                </span>
              </td>
              {show ? (
                <td>
                  <span className={`status ${donation.receipt}`}>
                    {donation.receipt}
                  </span>
                </td>
              ) : null}
            </tr>
          ))}

          {paginatedFilteredDonations.length === 0 && (
            <tr>
              <td colSpan={show ? 6 : 5} className="no-data">
                {hasActiveFilters
                  ? "No donations match your filters"
                  : "No donations found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="footer">
        <p>
          Showing {paginatedFilteredDonations.length} of{" "}
          {filteredDonations.length} donations
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

export default RecentDonations;
