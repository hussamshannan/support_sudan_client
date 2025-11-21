/**
 * Authentication utilities for token management
 */

/**
 * Decodes a JWT token and returns the payload
 * @param {string} token - JWT token
 * @returns {object|null} Decoded token payload or null if invalid
 */
export const decodeToken = (token) => {
  if (!token) return null;

  try {
    // The token is in format: header.payload.signature
    const payload = token.split(".")[1];
    // Base64 decode and parse JSON
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/**
 * Checks if user is authenticated and token is valid
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const payload = decodeToken(token);
    if (!payload) {
      // Invalid token format, remove it
      localStorage.removeItem("token");
      return false;
    }

    // Check if token is expired (exp is in seconds, Date.now() in milliseconds)
    const isExpired = payload.exp * 1000 < Date.now();
    if (isExpired) {
      localStorage.removeItem("token");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating token:", error);
    localStorage.removeItem("token");
    return false;
  }
};

/**
 * Gets user information from the token
 * @returns {object|null} User info object or null if not available
 */
export const getUserInfo = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = decodeToken(token);
    if (!payload) return null;

    return {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      role: payload.role,
      exp: payload.exp,
      iat: payload.iat,
    };
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
};

/**
 * Saves token to localStorage
 * @param {string} token - JWT token
 */
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

/**
 * Removes token from localStorage and logs user out
 */
export const logout = () => {
  localStorage.removeItem("token");
  // Optional: Clear any other user-related storage
  // localStorage.removeItem("userPreferences");
  window.location.href = "/admin/login";
};

/**
 * Gets the raw token from localStorage
 * @returns {string|null} The token string or null
 */
export const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Checks if token will expire soon (within 5 minutes)
 * @returns {boolean} True if token expires soon
 */
export const isTokenExpiringSoon = () => {
  const token = getToken();
  if (!token) return true;

  const payload = decodeToken(token);
  if (!payload) return true;

  // Check if token expires within 5 minutes (300000 ms)
  return payload.exp * 1000 - Date.now() < 300000;
};

/**
 * Validates token structure without checking expiration
 * @returns {boolean} True if token has valid structure
 */
export const isValidTokenFormat = () => {
  const token = getToken();
  if (!token) return false;

  const parts = token.split(".");
  return parts.length === 3; // header.payload.signature
};
