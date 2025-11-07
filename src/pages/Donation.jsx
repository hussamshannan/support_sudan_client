import React, { useState } from "react";
import icons from "../assets/icons/icons";
import Progress from "../components/progress";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { toast } from "react-hot-toast";
import { PiPaypalLogoFill } from "react-icons/pi";

function Donation() {
  const [selectedCause, setSelectedCause] = useState(""); // single cause
  const [activeAmount, setActiveAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [details, setDetails] = useState({ name: "", email: "" });
  const [selectedPayment, setSelectedPayment] = useState(""); // payment method
  const navigate = useNavigate(); // Initialize navigate

  // Select only one cause
  const handleSelectCause = (cause) => {
    setSelectedCause((prev) => (prev === cause ? "" : cause));
  };

  // Amount selection
  const handleClickAmount = (amount) => {
    setActiveAmount(amount);
    setCustomAmount(""); // reset custom amount when preset selected
  };

  // Select payment method
  const handleSelectPayment = (method) => {
    setSelectedPayment(method);
  };

  // Format number with commas
  const formatNumberWithCommas = (number) =>
    number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const removeNonDigits = (str) => str.replace(/[^0-9]/g, "");

  const handleCustomAmountChange = (e) => {
    let value = e.target.value.replace("$", "");
    let onlyNums = removeNonDigits(value);
    let formattedValue = formatNumberWithCommas(onlyNums);
    setCustomAmount("$" + formattedValue);
    if (onlyNums !== "") setActiveAmount(null);
  };

  const getRawAmount = () => removeNonDigits(customAmount);

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const finalAmount = customAmount !== "" ? getRawAmount() : activeAmount;

  // Check if required fields are filled
  const isFormValid = selectedCause && finalAmount && selectedPayment;

  // Handle navigation with state
  const handleDonateClick = () => {
    if (isFormValid) {
      navigate("/pay", {
        state: {
          cause: selectedCause,
          amount: finalAmount,
          name: details.name,
          email: details.email,
          payment: selectedPayment,
        },
      });
    } else {
      toast.error("Please fill out the form", {
        style: {
          borderRadius: "var(--border-radius-large)",
          background: "var(--secondary-clr)",
          fontFamily: "var(--arabic-fm-r)",
          color: "var(--txt-clr)",
        },
      });
    }
  };

  return (
    <div className="page donation">
      <Progress />
      <h2>Make a Donation</h2>

      {/* Cause selection */}
      <div className="cause">
        <p>Choose a cause</p>
        {[
          { key: "Food & Water", label: "Food & Water", icon: icons.food },
          { key: "Medical Aid", label: "Medical Aid", icon: icons.med },
          {
            key: "Shelter & Education",
            label: "Shelter & Education",
            icon: icons.shelter,
          },
        ].map((c) => (
          <button
            key={c.key}
            className={selectedCause === c.key ? "active" : ""}
            onClick={() => handleSelectCause(c.key)}
          >
            <span>{c.icon}</span>
            <p>{c.label}</p>
          </button>
        ))}
      </div>

      {/* Amount selection */}
      <div className="amount">
        <p>Select amount</p>
        {[5, 10, 25, 50].map((amt) => (
          <button
            key={amt}
            className={activeAmount === amt ? "active" : ""}
            onClick={() => handleClickAmount(amt)}
          >
            <p>${amt}</p>
          </button>
        ))}

        <label htmlFor="customAmount">
          {customAmount === "" && (
            <div className="placeholder">
              <span>{icons.write}</span>
              <p>Custom Amount</p>
            </div>
          )}
          <input
            type="text"
            id="customAmount"
            name="customAmount"
            inputMode="numeric"
            pattern="[0-9]*"
            value={customAmount}
            onChange={handleCustomAmountChange}
          />
        </label>
      </div>

      {/* User details */}
      <div className="details">
        <p>Your details (optional)</p>
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
          />
        </label>
      </div>

      {/* Payment selection */}
      <div className="payment">
        <p>Payment</p>
        <button
          className={selectedPayment === "card" ? "active" : ""}
          onClick={() => handleSelectPayment("card")}
        >
          <span className="fillNone">{icons.creditCard}</span>
          <p>Credit/Debit Card</p>
        </button>
        <button
          className={selectedPayment === "paypal" ? "active" : ""}
          onClick={() => handleSelectPayment("paypal")}
        >
          <span>
            <PiPaypalLogoFill size={24} strokeWidth="5px" />
          </span>
          <p>paypal</p>
        </button>
        <span>
          Your payment is protected with industry-standard encryption.
        </span>
      </div>

      {/* Single button that handles both cases */}
      <button className="donateBtn" onClick={handleDonateClick}>
        Donate securely
      </button>
    </div>
  );
}

export default Donation;
