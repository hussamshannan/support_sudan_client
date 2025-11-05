import React, { useState } from "react";
import icons from "../assets/icons/icons";
import Progress from "../components/progress";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
function CreditCardPayment() {
  const navigate = useNavigate();
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    name: "",
    expiry: "",
    cvv: "",
    country: "",
    zip: "",
  });
  const [errors, setErrors] = useState({
    expiry: false,
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const formatNumberWithCommas = (number) => {
    if (!number) return "";
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const cause = searchParams.get("cause");
  const amount = formatNumberWithCommas(searchParams.get("amount"));
  const name = searchParams.get("name");
  const email = searchParams.get("email");

  const causes = cause;

  // Check if all required fields are filled and valid
  const isFormValid = () => {
    const { cardNumber, name, expiry, cvv, country, zip } = cardDetails;
    const rawCardNumber = cardNumber.replace(/\s/g, "");

    return (
      rawCardNumber.length === 16 &&
      name.trim() !== "" &&
      expiry.length === 5 &&
      !errors.expiry &&
      cvv.length >= 3 &&
      country.trim() !== "" &&
      zip.trim() !== ""
    );
  };

  // Check if a specific field is empty
  const isFieldEmpty = (fieldName) => {
    return submitAttempted && cardDetails[fieldName].trim() === "";
  };

  // Handle all input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "cardNumber") {
      // Remove all non-digits and limit to 16 characters
      newValue = value.replace(/\D/g, "").slice(0, 16);

      // Format as #### #### #### ####
      if (newValue.length > 0) {
        // Simple approach: insert space every 4 characters
        let formatted = "";
        for (let i = 0; i < newValue.length; i++) {
          if (i > 0 && i % 4 === 0) {
            formatted += " ";
          }
          formatted += newValue[i];
        }
        newValue = formatted;
      }
    } else if (name === "cvv" || name === "zip") {
      newValue = value.replace(/\D/g, "");
    } else if (name === "expiry") {
      // Remove all non-digits and limit to 4 characters
      newValue = value.replace(/\D/g, "").slice(0, 4);

      // Format as MM/YY
      if (newValue.length > 2) {
        newValue = newValue.slice(0, 2) + "/" + newValue.slice(2, 4);
      }

      // Validate if we have a complete date (MM/YY format)
      let isExpiryValid = true;
      if (newValue.length === 5) {
        const [monthStr, yearStr] = newValue.split("/");
        const month = parseInt(monthStr, 10);
        const year = parseInt("20" + yearStr, 10); // Convert YY to YYYY

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // January is 0

        // Create date object for the expiry
        const expiryDate = new Date(year, month - 1); // month is 0-indexed in Date

        // Check if the date is valid and not in the past
        const isValidMonth = month >= 1 && month <= 12;
        const isFutureDate = expiryDate > currentDate;

        isExpiryValid = isValidMonth && isFutureDate;

        if (!isExpiryValid) {
          console.warn("Invalid expiry date: Card is expired or invalid month");
        }
      }

      // Update error state
      setErrors((prev) => ({
        ...prev,
        expiry: !isExpiryValid && newValue.length === 5,
      }));
    } else {
      newValue = value;
    }

    setCardDetails((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleInvalidSubmit = () => {
    setSubmitAttempted(true);
    toast.error("Please fill out the form", {
      style: {
        borderRadius: "var(--border-radius-large)",
        background: "var(--secondary-clr)",
        fontFamily: "var(--arabic-fm-r)",
        color: "var(--txt-clr)",
      },
    });
  };

  // Secure navigation with React Router state
  const handleSecurePayment = () => {
    if (isFormValid()) {
      navigate("/payNreview", {
        state: {
          cardDetails: cardDetails,
          cause: causes,
          amount: amount,
          name: name,
          email: email,
        },
      });
    } else {
      handleInvalidSubmit();
    }
  };

  return (
    <div className="page pay">
      <Progress />
      <h2>Card Details</h2>
      <div className="details">
        {/* Display Selected Causes */}
        <div className="selected-causes">
          <span>{icons.heart}</span>
          <p>{causes}</p>
          <span id="amount">${amount}</span>
        </div>

        <label htmlFor="cardNumber">
          {cardDetails.cardNumber === "" && (
            <div className="placeholder">
              <span>{icons.write}</span>
              <p>Card Number</p>
            </div>
          )}
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            inputMode="numeric"
            pattern="[0-9]*"
            value={cardDetails.cardNumber}
            onChange={handleChange}
            className={isFieldEmpty("cardNumber") ? "error-border" : ""}
          />
        </label>

        <div className="twoInputs">
          <label htmlFor="expiry">
            {cardDetails.expiry === "" && (
              <div className="placeholder">
                <span>{icons.calendar}</span>
                <p>MM/YY</p>
              </div>
            )}
            <input
              type="text"
              id="expiry"
              name="expiry"
              pattern="[0-9\s]*"
              className={
                errors.expiry || isFieldEmpty("expiry") ? "error-border" : ""
              }
              value={cardDetails.expiry}
              onChange={handleChange}
              maxLength={5}
            />
          </label>
          <label htmlFor="cvv">
            {cardDetails.cvv === "" && (
              <div className="placeholder">
                <span>{icons.lock}</span>
                <p>CVV</p>
              </div>
            )}
            <input
              type="text"
              id="cvv"
              name="cvv"
              inputMode="numeric"
              pattern="[0-9]*"
              value={cardDetails.cvv}
              onChange={handleChange}
              maxLength={4}
              className={isFieldEmpty("cvv") ? "error-border" : ""}
            />
          </label>
        </div>

        {/* Name on Card */}
        <label htmlFor="name">
          {cardDetails.name === "" && (
            <div className="placeholder">
              <span>{icons.user}</span>
              <p>Name on Card</p>
            </div>
          )}
          <input
            type="text"
            id="name"
            name="name"
            value={cardDetails.name}
            onChange={handleChange}
            className={isFieldEmpty("name") ? "error-border" : ""}
          />
        </label>

        <div className="twoInputs">
          {/* Country */}
          <label htmlFor="country">
            {cardDetails.country === "" && (
              <div className="placeholder">
                <span>{icons.globe}</span>
                <p>Country</p>
              </div>
            )}
            <input
              type="text"
              id="country"
              name="country"
              value={cardDetails.country}
              onChange={handleChange}
              className={isFieldEmpty("country") ? "error-border" : ""}
            />
          </label>

          {/* ZIP / Postal Code */}
          <label htmlFor="zip">
            {cardDetails.zip === "" && (
              <div className="placeholder">
                <span>{icons.pin}</span>
                <p>ZIP / Postal Code</p>
              </div>
            )}
            <input
              type="text"
              id="zip"
              name="zip"
              inputMode="numeric"
              pattern="[0-9]*"
              value={cardDetails.zip}
              onChange={handleChange}
              className={isFieldEmpty("zip") ? "error-border" : ""}
            />
          </label>
        </div>
        <span>
          <span>{icons.close_lock}</span>Cards are encrypted and never stored.
        </span>
      </div>

      {/* Submit / Donate Button - Now using secure navigation */}
      <button className="donateBtn" onClick={handleSecurePayment}>
        pay ${amount}
      </button>

      <p id="message">
        You will receive an email receipt immediately after payment.
      </p>
      <Link to={"/donate"} className="backBtn">
        back
      </Link>
    </div>
  );
}

export default CreditCardPayment;
