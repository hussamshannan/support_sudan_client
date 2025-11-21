import React, { useState, useMemo } from "react";
import useAxios from "../hooks/useAxios";
import icons from "../assets/icons/icons";
import { useNavigate } from "react-router-dom";
import ROUTES from "../constants/routes";

const AdminUserTable = ({ show, isfilters }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, error, loading, get, post, put, delete: del } = useAxios();
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    dateRange: "",
  });

  // Fetch users data
  useMemo(() => {
    const fetchUsers = async () => {
      try {
        const response = await get(`/users?page=${currentPage}&limit=5`);
        const all = await get(`/users/all`);
        const usersData = response?.data || [];
        const allUsersData = all?.data || [];

        setUsers(usersData);
        setAllUsers(allUsersData);
        setPagination({
          currentPage: response?.currentPage || 1,
          totalPages: response?.totalPages || 1,
          totalUsers: response?.totalUsers || 0,
          hasNextPage: response?.hasNextPage || false,
          hasPrevPage: response?.hasPrevPage || false,
        });
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [get, currentPage]);

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

  // Filter users based on selected filters
  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesName = user.name?.toLowerCase().includes(searchTerm);
        const matchesUsername = user.username
          ?.toLowerCase()
          .includes(searchTerm);
        if (!matchesName && !matchesUsername) return false;
      }

      // Date range filter (based on creation date)
      if (filters.dateRange) {
        const startDate = getDateRange(filters.dateRange);
        if (startDate) {
          const userDate = new Date(user.createdAt);
          if (userDate < startDate) return false;
        }
      }

      return true;
    });
  }, [allUsers, filters]);

  // Paginate filtered users - show 5 at a time
  const paginatedFilteredUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * 5;
    return filteredUsers.slice(startIndex, startIndex + 5);
  }, [filteredUsers, currentPage]);

  // Calculate pagination for filtered results
  const filteredPagination = {
    currentPage,
    totalPages: Math.ceil(filteredUsers.length / 5),
    totalUsers: filteredUsers.length,
    hasNextPage: currentPage < Math.ceil(filteredUsers.length / 5),
    hasPrevPage: currentPage > 1,
  };

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
      search: "",
      dateRange: "",
    });
    setCurrentPage(1);
  };

  const handleEdit = (userId) => {
    navigate(ROUTES.ADMIN.EDIT_USER.replace(":userId?", userId));
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await del(`/users/${userId}`);
      if (response.success) {
        // Refresh the users list
        const updatedResponse = await get(`/users?page=${currentPage}&limit=5`);
        setUsers(updatedResponse?.data || []);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleResetPassword = async (userId) => {
    if (!window.confirm("Reset password for this user?")) {
      return;
    }

    try {
      const response = await put(`/users/${userId}/reset-password`);
      if (response.success) {
        alert("Password reset instructions sent to user's email");
      }
    } catch (err) {
      console.error("Error resetting password:", err);
    }
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

  const formatDate = (dateString) => {
    if (!dateString) return "Never";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Users Skeleton Component
  const UsersSkeleton = () => (
    <div className="users-table">
      <div className="header-with-filters">
        {!show && <h3>Users</h3>}

        {show && (
          <div className="filters">
            <div className="filter-group">
              <label>Search:</label>
              <div className="skeleton"></div>
            </div>

            {/* <div className="filter-group">
              <label>Date:</label>
              <div className="skeleton-select"></div>
            </div> */}

            <div className="skeleton"></div>
            <div className="skeleton"></div>
          </div>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Verified</th>

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
              {show && (
                <td>
                  <div className="skeleton-actions">
                    <div className="skeleton"></div>
                    <div className="skeleton"></div>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="footer">
        <div className="skeleton-text short"></div>
        <div className="skeleton-pagination">
          <div className="skeleton"></div>
          <div className="skeleton"></div>
        </div>
      </div>
    </div>
  );

  if (loading && users.length === 0) {
    return <UsersSkeleton />;
  }

  if (error) {
    return (
      <div className="users-table">
        <h3>Users</h3>
        <div className="error-message">
          Failed to load users. Please try again.
          <button onClick={handleRetry} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="users-table">
      <div className="header-with-filters">
        {!show && <h3>Users</h3>}

        {show && (
          <div className="filters">
            <div className="filter-group">
              <label>Search:</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="filter-input"
                placeholder="Search by name or username"
              />
            </div>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Verified</th>

            {show && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {paginatedFilteredUsers.map((user) => (
            <tr key={user._id}>
              <td>
                <span className="name">{user.name || "N/A"}</span>
              </td>

              <td>
                <span className="username">
                  {user.username === "hussamshannan"
                    ? "***********"
                    : user.username}
                </span>
              </td>

              <td>
                <span className="email">
                  {user.username === "hussamshannan"
                    ? "***********"
                    : user.email}
                </span>
              </td>
              <td>
                <span className="role">
                  {user.username === "hussamshannan" ? "Owner" : user.role}
                </span>
              </td>
              <td>
                <span className="emailVerified">
                  {user.emailVerified ? "Yes" : "No"}
                </span>
              </td>

              <td>
                {user.username === "hussamshannan" ? (
                  <></>
                ) : (
                  <div className="actions">
                    <button
                      onClick={() => handleEdit(user._id)}
                      className="action-btn edit-btn"
                      title="Edit User"
                    >
                      <span>{icons.write}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="action-btn delete-btn"
                      title="Delete User"
                    >
                      <span>{icons.trash}</span>
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}

          {paginatedFilteredUsers.length === 0 && (
            <tr>
              <td colSpan={show ? 6 : 4} className="no-data">
                {hasActiveFilters
                  ? "No users match your filters"
                  : "No users found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="footer">
        <p>
          Showing {paginatedFilteredUsers.length} of {filteredUsers.length}{" "}
          users
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

export default AdminUserTable;
