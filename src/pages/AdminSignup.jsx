import React, { useState } from "react";
import useAxios from "../hooks/useAxios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import bg_img from "../assets/img/bg_img.jpg";
import TextPressure from "../components/animation/txt";
import icons from "../assets/icons/icons";
import { ROUTES } from "../constants/routes";

export default function AdminSignup() {
  const { data, error, loading, get, post, delete: del, put } = useAxios();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    role: "user", // Default role
  });

  // Password visibility icons (same as signin)
  const visible = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#000000"
    >
      <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-134 0-244.5-72T61-462q-5-9-7.5-18.5T51-500q0-10 2.5-19.5T61-538q64-118 174.5-190T480-800q134 0 244.5 72T899-538q5 9 7.5 18.5T909-500q0 10-2.5 19.5T899-462q-64 118-174.5 190T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
    </svg>
  );

  const hidden = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#000000"
    >
      <path d="M607-627q29 29 42.5 66t9.5 76q0 15-11 25.5T622-449q-15 0-25.5-10.5T586-485q5-26-3-50t-25-41q-17-17-41-26t-51-4q-15 0-25.5-11T430-643q0-15 10.5-25.5T466-679q38-4 75 9.5t66 42.5Zm-127-93q-19 0-37 1.5t-36 5.5q-17 3-30.5-5T358-742q-5-16 3.5-31t24.5-18q23-5 46.5-7t47.5-2q137 0 250.5 72T904-534q4 8 6 16.5t2 17.5q0 9-1.5 17.5T905-466q-18 40-44.5 75T802-327q-12 11-28 9t-26-16q-10-14-8.5-30.5T753-392q24-23 44-50t35-58q-50-101-144.5-160.5T480-720Zm0 520q-134 0-245-72.5T60-463q-5-8-7.5-17.5T50-500q0-10 2-19t7-18q20-40 46.5-76.5T166-680l-83-84q-11-12-10.5-28.5T84-820q11-11 28-11t28 11l680 680q11 11 11.5 27.5T820-84q-11 11-28 11t-28-11L624-222q-35 11-71 16.5t-73 5.5ZM222-624q-29 26-53 57t-41 67q50 101 144.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
    </svg>
  );

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const { name, username, email } = formData;

    if (!name || !username || !email) {
      toast.error("Please fill in all required fields", {
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

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (!usernameRegex.test(username)) {
      toast.error(
        "Username must be 3-30 characters and contain only letters, numbers, and underscores",
        {
          style: {
            borderRadius: "var(--border-radius-large)",
            background: "var(--secondary-clr)",
            fontFamily: "var(--arabic-fm-r)",
            color: "var(--txt-clr)",
          },
        }
      );
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
      const response = await post("/auth/signup", formData);

      if (response?.success) {
        toast.success(
          "Verification email sent! Please check your email to complete registration.",
          {
            style: {
              borderRadius: "var(--border-radius-large)",
              background: "var(--secondary-clr)",
              fontFamily: "var(--arabic-fm-r)",
              color: "var(--txt-clr)",
            },
            duration: 6000, // Longer duration for important message
          }
        );

        // Redirect to signin page after successful signup
        setTimeout(() => {
          navigate(ROUTES.ADMIN.USERS);
        }, 2000);
      } else {
        toast.error(response?.message || "Signup failed", {
          style: {
            borderRadius: "var(--border-radius-large)",
            background: "var(--secondary-clr)",
            fontFamily: "var(--arabic-fm-r)",
            color: "var(--txt-clr)",
          },
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      let errorMessage = "An error occurred during signup";

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

  // Add links for existing users
  const AdditionalLinks = () => (
    <div className="auth-links">
      <div>
        Already have an account? <Link to={ROUTES.ADMIN.LOGIN}>Sign In</Link>
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
        <form className="form" onSubmit={handleSubmit}>
          <div className="top">
            <h1>NEW USER</h1>
          </div>

          <label htmlFor="name">
            <p>Full Name *</p>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              placeholder=""
              dir="auto"
              required
            />
          </label>

          <label htmlFor="username">
            <p>Username *</p>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              placeholder=""
              dir="auto"
              required
            />
          </label>

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
            />
          </label>

          {/* Hidden role field - can be made visible for admin purposes */}
          <input type="hidden" name="role" value={formData.role} />

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
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </label>

          {/* <AdditionalLinks /> */}
        </form>

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
