import React, { useState } from "react";
import useAxios from "../hooks/useAxios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import bg_img from "../assets/img/bg_img.jpg";
import TextPressure from "../components/animation/txt";
import icons from "../assets/icons/icons";
import { ROUTES } from "../constants/routes";

export default function ForgotPassword() {
  const { data, error, loading, get, post, delete: del, put } = useAxios();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [emailSent, setEmailSent] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const { email } = formData;

    if (!email) {
      toast.error("Please enter your email address", {
        style: {
          borderRadius: "var(--border-radius-large)",
          background: "var(--secondary-clr)",
          fontFamily: "var(--arabic-fm-r)",
          color: "var(--txt-clr)",
        },
      });
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address", {
        style: {
          borderRadius: "var(--border-radius-large)",
          background: "var(--secondary-clr)",
          fontFamily: "var(--arabic-fm-r)",
          color: "var(--txt-clr)",
        },
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await post("/auth/forgot-password", formData);

      if (response?.success) {
        setEmailSent(true);
        toast.success("Password reset email sent! Please check your inbox.", {
          style: {
            borderRadius: "var(--border-radius-large)",
            background: "var(--secondary-clr)",
            fontFamily: "var(--arabic-fm-r)",
            color: "var(--txt-clr)",
          },
          duration: 6000,
        });
      } else {
        toast.error(response?.message || "Failed to send reset email", {
          style: {
            borderRadius: "var(--border-radius-large)",
            background: "var(--secondary-clr)",
            fontFamily: "var(--arabic-fm-r)",
            color: "var(--txt-clr)",
          },
        });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      let errorMessage = "An error occurred while processing your request";

      // Handle specific error cases
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        style: {
          borderRadius: "var(--border-radius-large)",
          background: "var(--secondary-clr)",
          fontFamily: "var(--arabic-fm-r)",
          color: "var(--txt-clr)",
        },
      });
    }
  };

  // Success message component
  const SuccessMessage = () => (
    <div
      className="success-message"
      style={{
        textAlign: "center",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          color: "var(--success-clr)",
          fontSize: "3rem",
          marginBottom: "1rem",
        }}
      >
        ✓
      </div>
      <h2
        style={{
          color: "var(--txt-clr)",
          marginBottom: "1rem",
        }}
      >
        Check Your Email
      </h2>
      <p
        style={{
          color: "var(--txt-clr-secondary)",
          lineHeight: "1.6",
          marginBottom: "2rem",
        }}
      >
        We've sent a password reset link to <strong>{formData.email}</strong>.
        Please check your email and click the link to reset your password.
      </p>
      <div
        style={{
          fontSize: "0.9rem",
          color: "var(--txt-clr-secondary)",
          marginBottom: "2rem",
        }}
      >
        Didn't receive the email? Check your spam folder or{" "}
        <button
          onClick={() => setEmailSent(false)}
          style={{
            background: "none",
            border: "none",
            color: "var(--primary-clr)",
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          try again
        </button>
      </div>
      <Link
        to={ROUTES.AUTH.SIGNIN}
        style={{
          display: "inline-block",
          padding: "12px 24px",
          backgroundColor: "var(--primary-clr)",
          color: "white",
          textDecoration: "none",
          borderRadius: "var(--border-radius)",
          fontWeight: "bold",
        }}
      >
        Back to Sign In
      </Link>
    </div>
  );

  // Add links for navigation
  const AdditionalLinks = () => (
    <div className="auth-links">
      <div>
        Remember your password? <Link to={ROUTES.ADMIN.LOGIN}>Log in</Link>
      </div>
    </div>
  );

  return (
    <div className="signin-pages" dir="auto">
      <div className="image">
        <img src={bg_img} alt="" />
        <div className="logo">{icons.heart}</div>
        <div className="txt">
          <h2>Sudacand</h2>
          <p>
            Sudacand is a humanitarian organization born from compassion and
            hope — a mission to stand beside the resilient people of Sudan
            during their most challenging times. Our purpose is simple yet
            powerful: to bring relief, restore dignity, and rebuild lives
            through acts of kindness and solidarity. From providing clean water
            and food to supporting health care, education, and shelter, Sudacand
            believes that every small act of care can create lasting change. We
            are driven by the spirit of community — by the belief that when we
            come together with love and empathy, we can heal wounds, rekindle
            hope, and build a brighter future for Sudan.
          </p>
        </div>
        <div className="bottom">
          <p>
            Together, we can make a difference. Together, we are Sudacand. ❤️
          </p>
        </div>
      </div>
      <div className="main">
        {!emailSent ? (
          <form className="form" onSubmit={handleSubmit}>
            <div className="top">
              <h1>RESET PASSWORD</h1>
            </div>

            <label htmlFor="email">
              <p>Email Address *</p>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                placeholder=""
                dir="auto"
                required
                autoFocus
              />
            </label>

            <label htmlFor="submit">
              <button
                type="submit"
                name="submit"
                disabled={loading}
                style={{
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </label>

            <AdditionalLinks />
          </form>
        ) : (
          <div className="form">
            <SuccessMessage />
          </div>
        )}

        <div className="bottom">
          <div className="txt" dir="ltr">
            <TextPressure
              text="sudacand.org"
              flex={false}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              textColor="#000"
              strokeColor="#ff0000"
              minFontSize={36}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
