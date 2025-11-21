import { Suspense, lazy, useState, useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import img from "./assets/img/undraw_page-not-found_6wni.svg";

// Utils
import { isAuthenticated } from "./utils/auth";
import { ROUTES } from "./constants/routes";

// Components
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import AdminNav from "./components/AdminNav";
import TopBar from "./components/TopBar";
import Loading from "./components/Loading";

// Lazy loaded pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Donate = lazy(() => import("./pages/Donation"));
const CreditCardPayment = lazy(() => import("./pages/CreditCardPayment"));
const PayNreview = lazy(() => import("./pages/payNreview"));
const Success = lazy(() => import("./pages/Success"));
const Article = lazy(() => import("./pages/Article"));
const Updates = lazy(() => import("./pages/Updates"));
const EditArticle = lazy(() => import("./pages/EditArticle"));
const Admin = lazy(() => import("./pages/AdminDashboared"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminSignup = lazy(() => import("./pages/AdminSignup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const AdminEditUser = lazy(() => import("./pages/AdminEditUser"));
const ResendVerification = lazy(() => import("./pages/ResendVerification"));
const AdminDonationPage = lazy(() => import("./pages/AdminDonationPage"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const ArticleList = lazy(() => import("./pages/ArticleList"));
const AdminViewArticle = lazy(() => import("./pages/AdminViewArticle"));
const AdminCampaign = lazy(() => import("./pages/AdminCampaign"));
const AdminEditCampaign = lazy(() => import("./pages/AdminEditCampaign"));

// Protected Route component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? (
    children
  ) : (
    <Navigate to={ROUTES.ADMIN.LOGIN} replace />
  );
};

// Unified smooth animation wrapper for all routes
const SmoothPageWrapper = ({ children, isAdmin = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
      opacity: { duration: 0.4 },
    }}
    style={{
      width: "100%",
      minHeight: "auto",
    }}
  >
    {children}
  </motion.div>
);

// Wrapper components for routes with loading
const AnimatedPage = ({ children, isAdmin = false }) => (
  <Suspense fallback={<Loading />}>
    <SmoothPageWrapper isAdmin={isAdmin}>{children}</SmoothPageWrapper>
  </Suspense>
);

// Main App component
function App() {
  const [showTopbar, setShowTopBar] = useState(true);

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname === ROUTES.ADMIN.LOGIN;
  const isSignPage = location.pathname === ROUTES.ADMIN.SIGNUP;
  const isVerifyEmailPage = location.pathname === ROUTES.AUTH.VERIFY_EMAIL;
  const isVirefiedPage = location.pathname === ROUTES.AUTH.RESEND_VERIFICATION;
  const isForgotPasswordPage =
    location.pathname === ROUTES.AUTH.FORGOT_PASSWORD;

  const path = location.pathname;

  const hideTopbar =
    path === ROUTES.ADMIN.LOGIN ||
    path === ROUTES.ADMIN.SIGNUP ||
    path === ROUTES.AUTH.VERIFY_EMAIL ||
    path === ROUTES.AUTH.FORGOT_PASSWORD;

  const AdminLayout = ({ children }) => {
    return (
      <div className="admin-container">
        {!hideTopbar && <TopBar />}
        {children}
      </div>
    );
  };

  return (
    <div className={`container ${isAdminRoute ? "admin" : ""}`} dir="auto">
      {/* Conditional rendering based on route */}
      {!isAdminRoute &&
        !isLoginPage &&
        !isSignPage &&
        !isVerifyEmailPage &&
        !isForgotPasswordPage && <Nav />}

      <Toaster position="top-center" reverseOrder={false} />

      {/* Admin Nav - only show on admin routes when authenticated */}
      {isAdminRoute &&
        !isLoginPage &&
        !isSignPage &&
        !isVirefiedPage &&
        !isForgotPasswordPage &&
        isAuthenticated() && <AdminNav />}

      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route
            path={ROUTES.HOME}
            element={
              <AnimatedPage>
                <Home />
              </AnimatedPage>
            }
          />
          <Route
            path={ROUTES.PAY}
            element={
              <AnimatedPage>
                <CreditCardPayment />
              </AnimatedPage>
            }
          />
          <Route
            path={ROUTES.DONATE}
            element={
              <AnimatedPage>
                <Donate />
              </AnimatedPage>
            }
          />
          <Route
            path={ROUTES.PAY_REVIEW}
            element={
              <AnimatedPage>
                <PayNreview />
              </AnimatedPage>
            }
          />
          <Route
            path={ROUTES.SUCCESS}
            element={
              <AnimatedPage>
                <Success />
              </AnimatedPage>
            }
          />
          <Route
            path={ROUTES.ARTICLE}
            element={
              <AnimatedPage>
                <Article show={true} />
              </AnimatedPage>
            }
          />
          <Route
            path={ROUTES.UPDATES}
            element={
              <AnimatedPage>
                <Updates />
              </AnimatedPage>
            }
          />

          {/* Admin Routes */}
          <Route
            path={ROUTES.ADMIN.LOGIN}
            element={
              <AnimatedPage isAdmin={true}>
                <AdminLogin />
              </AnimatedPage>
            }
          />
          <Route
            path={ROUTES.AUTH.RESEND_VERIFICATION}
            element={
              <AnimatedPage isAdmin={true}>
                <ResendVerification />
              </AnimatedPage>
            }
          />
          <Route
            path={ROUTES.AUTH.FORGOT_PASSWORD}
            element={
              <AnimatedPage isAdmin={true}>
                <ForgotPassword />
              </AnimatedPage>
            }
          />
          <Route
            path={ROUTES.AUTH.RESET_PASSWORD}
            element={
              <AnimatedPage isAdmin={true}>
                <ResetPassword />
              </AnimatedPage>
            }
          />
          <Route
            path={ROUTES.ADMIN.SIGNUP}
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AnimatedPage isAdmin={true}>
                    <AdminSignup />
                  </AnimatedPage>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.AUTH.VERIFY_EMAIL}
            element={
              <AnimatedPage isAdmin={true}>
                <VerifyEmail />
              </AnimatedPage>
            }
          />

          <Route
            path={ROUTES.ADMIN.DASHBOARD}
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AnimatedPage isAdmin={true}>
                    <Admin />
                  </AnimatedPage>
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN.EDIT_ARTICLE_WITH_ID}
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AnimatedPage isAdmin={true}>
                    <EditArticle />
                  </AnimatedPage>
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN.EDIT_ARTICLE}
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AnimatedPage isAdmin={true}>
                    <EditArticle />
                  </AnimatedPage>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN.ARTICLE_LIST}
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AnimatedPage isAdmin={true}>
                    <ArticleList />
                  </AnimatedPage>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN.DONATIONS}
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AnimatedPage isAdmin={true}>
                    <AdminDonationPage />
                  </AnimatedPage>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN.EDIT_USER}
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AnimatedPage isAdmin={true}>
                    <AdminEditUser />
                  </AnimatedPage>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN.USERS}
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AnimatedPage isAdmin={true}>
                    <AdminUsers />
                  </AnimatedPage>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN.ARTICLE}
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AnimatedPage isAdmin={true}>
                    <AdminViewArticle />
                  </AnimatedPage>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN.CAMPAIGNS}
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AnimatedPage isAdmin={true}>
                    <AdminCampaign />
                  </AnimatedPage>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN.EDIT_CAMPAIGN}
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AnimatedPage isAdmin={true}>
                    <AdminEditCampaign />
                  </AnimatedPage>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          {/* Redirect for admin root */}
          <Route
            path="/admin"
            element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />}
          />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <AnimatedPage>
                <div
                  className="notFound"
                  style={{
                    display: "grid",
                    placeContent: "center",
                    width: "100%",
                  }}
                >
                  <img
                    src={img}
                    style={{
                      width: "100%",
                    }}
                    alt="Page not found"
                  />
                </div>
              </AnimatedPage>
            }
          />
        </Routes>
      </AnimatePresence>

      {/* Footer - hide on admin routes and login */}
      {!isAdminRoute &&
        !isLoginPage &&
        !isSignPage &&
        !isVerifyEmailPage &&
        !isForgotPasswordPage && <Footer />}
    </div>
  );
}

export default App;
