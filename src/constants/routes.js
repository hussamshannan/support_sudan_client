/**
 * Application route constants
 * Centralized route management for maintainability
 */

export const ROUTES = {
  // Public routes
  HOME: "/",
  DONATE: "/donate",
  PAY: "/pay",
  PAY_REVIEW: "/payNreview",
  SUCCESS: "/success",
  ARTICLE: "/article/:articleId?",
  UPDATES: "/updates",

  // Admin routes
  ADMIN: {
    LOGIN: "/admin/login",
    SIGNUP: "/admin/signup",
    DASHBOARD: "/admin/dashboard",
    EDIT_ARTICLE: "/admin/EditArtical",
    EDIT_ARTICLE_WITH_ID: "/admin/EditArtical/:articleId?",
    ARTICLE_LIST: "/admin/ArticleList",
    ARTICLE: "/admin/article/:articleId?",
    DONATIONS: "/admin/Donations",
    USERS: "/admin/Users",
    CAMPAIGNS: "/admin/campaigns",
    EDIT_CAMPAIGN: "/admin/editcampaigns/:campaignId?",
    EDIT_USER: "/admin/edituser/:userId?",
  },
  AUTH: {
    FORGOT_PASSWORD: "/admin/forgot-password",
    RESET_PASSWORD: "/admin/reset-password",
    VERIFY_EMAIL: "/verify-email",
    RESEND_VERIFICATION: "/admin/resend-verification",
  },
};

/**
 * Helper function to generate article route with ID
 * @param {string} articleId - The article ID
 * @returns {string} Formatted route
 */
export const getArticleRoute = (articleId) => {
  return `/article/${articleId}`;
};

/**
 * Helper function to generate edit article route with ID
 * @param {string} articleId - The article ID
 * @returns {string} Formatted route
 */
export const getEditArticleRoute = (articleId) => {
  return `/admin/edit/${articleId}`;
};

/**
 * Check if current route is an admin route
 * @param {string} pathname - Current pathname
 * @returns {boolean} True if admin route
 */
export const isAdminRoute = (pathname) => {
  return pathname.startsWith("/admin");
};

/**
 * Check if current route is a public route
 * @param {string} pathname - Current pathname
 * @returns {boolean} True if public route
 */
export const isPublicRoute = (pathname) => {
  return !isAdminRoute(pathname) || pathname === "/admin/login";
};

/**
 * Get all public routes as array (for navigation, etc.)
 */
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.DONATE,
  ROUTES.PAY,
  ROUTES.PAY_REVIEW,
  ROUTES.SUCCESS,
  ROUTES.UPDATES,
];

/**
 * Get all protected admin routes as array
 */
export const PROTECTED_ROUTES = [
  ROUTES.ADMIN.DASHBOARD,
  ROUTES.ADMIN.EDIT_ARTICLE,
  ROUTES.ADMIN.EDIT_ARTICLE_WITH_ID,
];

/**
 * Routes that should not show navigation
 */
export const HIDDEN_NAV_ROUTES = [
  ROUTES.ADMIN.LOGIN,
  ROUTES.SUCCESS,
  ROUTES.PAY_REVIEW,
];

// Default export for backward compatibility
export default ROUTES;
