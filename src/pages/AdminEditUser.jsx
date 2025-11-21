import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { toast } from "react-hot-toast";
import ROUTES from "../constants/routes";

function AdminEditUser() {
  const { userId } = useParams(); // Get user ID from URL
  const navigate = useNavigate();
  const { data, error, loading, get, post, put, delete: del } = useAxios();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    role: "user",
    emailVerified: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(!userId); // True if no userId in URL

  // Fetch user data when component mounts or ID changes
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setIsCreating(true);
        return;
      }

      try {
        setIsLoading(true);
        const response = await get(`/users/${userId}`);
        if (response.data.username === "hussamshannan")
          navigate(ROUTES.ADMIN.USERS);
        if (response.success) {
          setUser(response.data);
          // Pre-fill form with user data
          setFormData({
            name: response.data.name || "",
            username: response.data.username || "",
            email: response.data.email || "",
            role: response.data.role || "user",
            emailVerified: response.data.emailVerified || false,
          });
          setIsCreating(false);
        } else {
          toast.error("User not found", {
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
        toast.error("Error fetching user", {
          style: {
            borderRadius: "var(--border-radius-large)",
            background: "var(--secondary-clr)",
            fontFamily: "var(--arabic-fm-r)",
            color: "var(--txt-clr)",
          },
        });
        console.error("Error fetching user:", err);
        setIsCreating(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId, get]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Update user
  const handleUpdate = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);

      const updateData = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        role: formData.role,
        emailVerified: formData.emailVerified,
      };

      const response = await put(`/users/${userId}`, updateData);
      if (response.success) {
        toast.success("User updated successfully!", {
          style: {
            borderRadius: "var(--border-radius-large)",
            background: "var(--secondary-clr)",
            fontFamily: "var(--arabic-fm-r)",
            color: "var(--txt-clr)",
          },
        });
        setUser(response.data);
      } else {
        toast.error(response.message || "Failed to update user", {
          style: {
            borderRadius: "var(--border-radius-large)",
            background: "var(--secondary-clr)",
            fontFamily: "var(--arabic-fm-r)",
            color: "var(--txt-clr)",
          },
        });
      }
    } catch (err) {
      toast.error("Error updating user", {
        style: {
          borderRadius: "var(--border-radius-large)",
          background: "var(--secondary-clr)",
          fontFamily: "var(--arabic-fm-r)",
          color: "var(--txt-clr)",
        },
      });
      console.error("Error updating user:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update user role specifically
  const handleUpdateRole = async () => {
    if (!userId) return;
    if (user.username === "hussamshannan") navigate(ROUTES.ADMIN.USERS);
    try {
      setIsLoading(true);
      const response = await put(`/users/${userId}/role`, {
        role: formData.role,
      });

      if (response.success) {
        toast.success("User role updated successfully!", {
          style: {
            borderRadius: "var(--border-radius-large)",
            background: "var(--secondary-clr)",
            fontFamily: "var(--arabic-fm-r)",
            color: "var(--txt-clr)",
          },
        });
        setUser(response.data);
      } else {
        toast.error(response.message || "Failed to update user role", {
          style: {
            borderRadius: "var(--border-radius-large)",
            background: "var(--secondary-clr)",
            fontFamily: "var(--arabic-fm-r)",
            color: "var(--txt-clr)",
          },
        });
      }
    } catch (err) {
      toast.error("Error updating user role", {
        style: {
          borderRadius: "var(--border-radius-large)",
          background: "var(--secondary-clr)",
          fontFamily: "var(--arabic-fm-r)",
          color: "var(--txt-clr)",
        },
      });
      console.error("Error updating user role:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Manually verify user email
  const handleVerifyEmail = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const response = await put(`/users/${userId}/verify-email`, {});

      if (response.success) {
        toast.success("User email verified successfully!", {
          style: {
            borderRadius: "var(--border-radius-large)",
            background: "var(--secondary-clr)",
            fontFamily: "var(--arabic-fm-r)",
            color: "var(--txt-clr)",
          },
        });
        setUser(response.data);
        setFormData((prev) => ({ ...prev, emailVerified: true }));
      } else {
        toast.error(response.message || "Failed to verify user email", {
          style: {
            borderRadius: "var(--border-radius-large)",
            background: "var(--secondary-clr)",
            fontFamily: "var(--arabic-fm-r)",
            color: "var(--txt-clr)",
          },
        });
      }
    } catch (err) {
      toast.error("Error verifying user email", {
        style: {
          borderRadius: "var(--border-radius-large)",
          background: "var(--secondary-clr)",
          fontFamily: "var(--arabic-fm-r)",
          color: "var(--txt-clr)",
        },
      });
      console.error("Error verifying user email:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete user
  const handleDelete = async () => {
    if (
      !userId ||
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await del(`/users/${userId}`);

      if (response.success) {
        toast.success("User deleted successfully!");
        // Redirect to users list after 2 seconds
        setTimeout(() => {
          navigate("/admin/users");
        }, 2000);
      } else {
        toast.error(response.message || "Failed to delete user", {
          style: {
            borderRadius: "var(--border-radius-large)",
            background: "var(--secondary-clr)",
            fontFamily: "var(--arabic-fm-r)",
            color: "var(--txt-clr)",
          },
        });
      }
    } catch (err) {
      toast.error("Error deleting user", {
        style: {
          borderRadius: "var(--border-radius-large)",
          background: "var(--secondary-clr)",
          fontFamily: "var(--arabic-fm-r)",
          color: "var(--txt-clr)",
        },
      });
      console.error("Error deleting user:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form to original user data or clear for new user
  const handleResetForm = () => {
    if (user && !isCreating) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        role: user.role || "user",
        emailVerified: user.emailVerified || false,
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
      // Clear form for new user
      setFormData({
        name: "",
        username: "",
        email: "",
        role: "user",
        emailVerified: false,
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

  // Create new user mode
  const handleNewUser = () => {
    setIsCreating(true);
    setFormData({
      name: "",
      username: "",
      email: "",
      role: "user",
      emailVerified: false,
    });
    navigate("/admin/editusers/new");
  };

  if (loading || isLoading) {
    return (
      <div className="page AdminEditUser">
        <div className="loading">Loading user data...</div>
      </div>
    );
  }

  if (error && !user && !isCreating) {
    return (
      <div className="page AdminEditUser">
        <div className="error">Error loading user: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="page AdminEditUser">
      <div className="form-container">
        <div className="side info">
          <h6>User Information</h6>

          <label htmlFor="name">
            <p>Full Name</p>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter full name"
              required
            />
          </label>

          <label htmlFor="username">
            <p>Username</p>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter username"
              required
              disabled
            />
          </label>

          <label htmlFor="email">
            <p>Email Address</p>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              required
              disabled
            />
          </label>
          <label htmlFor="role">
            <p>Role</p>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>
        </div>

        {/* User stats overview (only for existing users) */}
        {!isCreating && user && (
          <div className="user-stats">
            <h6>User Statistics</h6>
            <label>
              <p>Account Created:</p>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </label>
            <label>
              <p>Last Login:</p>
              <span>
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleDateString()
                  : "Never"}
              </span>
            </label>
            <label>
              <p>Email Status:</p>
              <span
                className={
                  user.emailVerified ? "status-verified" : "status-pending"
                }
              >
                {user.emailVerified ? "Verified" : "Pending"}
              </span>
            </label>
            <label>
              <p>Login Attempts:</p>
              <span>{user.loginAttempts || 0}</span>
            </label>
            <label>
              <p>Account Status:</p>
              <span
                className={user.isLocked ? "status-locked" : "status-active"}
              >
                {user.isLocked ? "Locked" : "Active"}
              </span>
            </label>
          </div>
        )}

        <div className="actions">
          {isCreating ? (
            <></>
          ) : (
            <>
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="btn-primary"
              >
                <p>{isLoading ? "Updating..." : "Update User"}</p>
              </button>

              <button
                onClick={handleUpdateRole}
                disabled={isLoading}
                className="btn-warning"
              >
                <p>Update Role Only</p>
              </button>

              {!user?.emailVerified && (
                <button
                  onClick={handleVerifyEmail}
                  disabled={isLoading}
                  className="btn-info"
                >
                  <p>Verify Email</p>
                </button>
              )}

              <button
                onClick={handleResetForm}
                disabled={isLoading}
                className="btn-secondary"
              >
                <p>Reset Form</p>
              </button>

              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="btn-danger"
              >
                <p>Delete User</p>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminEditUser;
