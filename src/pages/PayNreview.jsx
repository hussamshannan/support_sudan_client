import React, { useState, useEffect } from "react";
import icons from "../assets/icons/icons";
import Progress from "../components/Progress";
import { Link, replace, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001/api";

function PayNreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cardDetails, cause, amount, name, email } = location.state || {};
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripeLoaded, setStripeLoaded] = useState(false);

  const causes = cause;
  const [details, setDetails] = useState({
    name: name || "",
    email: email || "",
  });

  // Check if cardDetails exists
  useEffect(() => {
    if (!cardDetails) {
      toast.error(
        "No payment data found. Please go back and enter card details.",
        {
          style: {
            borderRadius: "var(--border-radius-large)",
            background: "var(--secondary-clr)",
            fontFamily: "var(--arabic-fm-r)",
            color: "var(--txt-clr)",
          },
        }
      );
      navigate("/donate");
    }
  }, [cardDetails, navigate]);

  // Load Stripe script
  useEffect(() => {
    if (!window.document.getElementById("stripe-script")) {
      const s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://js.stripe.com/v2/";
      s.onload = () => {
        window.Stripe.setPublishableKey(
          import.meta.env.VITE_STRIPE_PULISHABLE_KEY
        );
        setStripeLoaded(true);
      };
      s.onerror = () => {
        toast.error("Failed to load payment processor", {
          style: {
            borderRadius: "var(--border-radius-large)",
            background: "var(--secondary-clr)",
            fontFamily: "var(--arabic-fm-r)",
            color: "var(--txt-clr)",
          },
        });
      };
      window.document.body.appendChild(s);
    } else {
      setStripeLoaded(true);
    }
  }, []);

  // User details input
  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async () => {
    if (!stripeLoaded) {
      toast.error("Payment processor not ready. Please try again.", {
        style: {
          borderRadius: "var(--border-radius-large)",
          background: "var(--secondary-clr)",
          fontFamily: "var(--arabic-fm-r)",
          color: "var(--txt-clr)",
        },
      });
      return;
    }

    setIsProcessing(true);

    try {
      const [exp_month, exp_year] = cardDetails.expiry.split("/");

      window.Stripe.card.createToken(
        {
          number: cardDetails.cardNumber.replace(/\s/g, ""),
          exp_month: parseInt(exp_month, 10),
          exp_year: parseInt(exp_year, 10),
          cvc: cardDetails.cvv,
          name: cardDetails.name,
        },
        async (status, response) => {
          if (response.error) {
            toast.error(response.error.message);
            setIsProcessing(false);
            return;
          }

          if (status === 200) {
            try {

              // Send only the token ID, not the entire response object
              const paymentResponse = await axios.post("/stripe-payment", {
                token: response.id, // This should be a string, not an object
                email: details.email || email,
                amount: amount,
                cause: causes,
                name_oncard: cardDetails.name,
                name: details.name,
                country: cardDetails.country || "",
              });

              console.log("Payment successful:", paymentResponse.data);

              setDetails({ name: "", email: "" });

              toast.success("Payment processed successfully!", {
                style: {
                  borderRadius: "var(--border-radius-large)",
                  background: "var(--secondary-clr)",
                  fontFamily: "var(--arabic-fm-r)",
                  color: "var(--txt-clr)",
                },
              });

              navigate("/success", { replace: true });
            } catch (error) {
              console.error("Server error:", error);
              const errorMessage =
                error.response?.data?.error || "Payment processing failed";
              toast.error(errorMessage, {
                style: {
                  borderRadius: "var(--border-radius-large)",
                  background: "var(--secondary-clr)",
                  fontFamily: "var(--arabic-fm-r)",
                  color: "var(--txt-clr)",
                },
              });
            }
          }
          setIsProcessing(false);
        }
      );
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An unexpected error occurred.", {
        style: {
          borderRadius: "var(--border-radius-large)",
          background: "var(--secondary-clr)",
          fontFamily: "var(--arabic-fm-r)",
          color: "var(--txt-clr)",
        },
      });
      setIsProcessing(false);
    }
  };

  // If no card details, show error message
  if (!cardDetails) {
    return (
      <div className="page pay">
        <Progress />
        <h2>Review & Confirm</h2>
        <div className="error-message">
          <p>
            No payment data found. Please go back and enter your card details.
          </p>
          <Link to="/donate" className="backBtn">
            Back to Donation
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page pay">
      <Progress />
      <h2>review & confirm</h2>
      <div className="details review">
        {/* Display Selected Causes */}
        <div className="selected-causes">
          <span>{icons.heart}</span>
          <p>{cause}</p>
          <span id="amount">${amount}</span>
        </div>

        <label htmlFor="payment_method">
          <span>{icons.creditCard}</span>
          <p>
            payment method
            <button>credit card</button>
          </p>
        </label>

        <label htmlFor="doner_details">
          <span>{icons.user}</span>
          <p>
            donor details
            <button onClick={() => setShowUserDetails((prev) => !prev)}>
              {showUserDetails ? "Cancel" : "Edit"}
            </button>
          </p>
        </label>

        {showUserDetails && (
          <>
            <label htmlFor="name">
              {details.name === "" && (
                <div className="placeholder">
                  <span>{icons.write}</span>
                  <p>Full Name</p>
                </div>
              )}
              <input
                type="text"
                id="name"
                dir="auto"
                name="name"
                value={details.name}
                onChange={handleDetailsChange}
                disabled={isProcessing}
              />
            </label>

            <label htmlFor="email">
              {details.email === "" && (
                <div className="placeholder">
                  <span>{icons.mail}</span>
                  <p>Email for receipt</p>
                </div>
              )}
              <input
                type="email"
                id="email"
                name="email"
                value={details.email}
                onChange={handleDetailsChange}
                disabled={isProcessing}
              />
            </label>
          </>
        )}

        <label htmlFor="donation_type">
          <span>{icons.stars}</span>
          <p>
            one-time donation
            <button className="fade">change to monthly</button>
          </p>
        </label>

        <div className="total-charged">
          <p>total charged today</p>
          <span id="amount">${amount}</span>
        </div>

        <span>
          <span>{icons.close_lock}</span>Cards are encrypted and never stored.
        </span>

        <div>
          <span>{icons.shield}</span>
          <p>secure</p>
        </div>

        <div>
          <span>{icons.check_badge}</span>
          <p>trusted partners</p>
        </div>
      </div>

      {/* Submit / Donate Button */}
      <button
        onClick={onSubmit}
        className={`donateBtn ${isProcessing ? "processing" : ""}`}
        disabled={isProcessing || !stripeLoaded}
      >
        {isProcessing ? "Processing..." : "Confirm Donation"}
      </button>
      {details.email ? (
        <p id="message">a receipt will be sent to your email immediately.</p>
      ) : (
        <></>
      )}

      <button
        onClick={() => navigate(-1)}
        className="backBtn"
        disabled={isProcessing}
      >
        back
      </button>
    </div>
  );
}

export default PayNreview;
