import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Home from "./pages/Home";
import Donate from "./pages/Donation";
import CreditCardPayment from "./pages/CreditCardPayment";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import PayNreview from "./pages/PayNreview";
import Success from "./pages/Success";
import Article from "./pages/Article";
import Updates from "./pages/Updates";
import { Toaster } from "react-hot-toast";
function App() {
  const location = useLocation();

  return (
    <div className="container" dir="auto">
      <Nav />
      <Toaster position="top-center" reverseOrder={false} />
      {/* AnimatePresence enables exit animations */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageWrapper>
                <Home />
              </PageWrapper>
            }
          />
          <Route
            path="/pay"
            element={
              <PageWrapper>
                <CreditCardPayment />
              </PageWrapper>
            }
          />
          <Route
            path="/donate"
            element={
              <PageWrapper>
                <Donate />
              </PageWrapper>
            }
          />
          <Route
            path="/payNreview"
            element={
              <PageWrapper>
                <PayNreview />
              </PageWrapper>
            }
          />
          <Route
            path="/success"
            element={
              <PageWrapper>
                <Success />
              </PageWrapper>
            }
          />
          <Route
            path="/article"
            element={
              <PageWrapper>
                <Article />
              </PageWrapper>
            }
          />
          <Route
            path="/Updates"
            element={
              <PageWrapper>
                <Updates />
              </PageWrapper>
            }
          />
        </Routes>
      </AnimatePresence>

      <Footer />
    </div>
  );
}

// Reusable animation wrapper
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }} // Fade in + slight slide up
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }} // Fade out + slight slide up
    transition={{ duration: 0.4, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

export default App;
