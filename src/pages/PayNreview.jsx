import React, { useState, useEffect } from "react";
import icons from "../assets/icons/icons";
import Progress from "../components/progress";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

function payNreview() {
  useEffect(() => {
    if (!window.document.getElementById("stripe-script")) {
      var s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://js.stripe.com/v2/";
      s.onload = () => {
        window["Stripe"].setPublishableKey(
          import.meta.env.VITE_STRIPE_PULISHABLE_KEY
        );
      };
      window.document.body.appendChild(s);
    }
  }, []);
  const location = useLocation();
  const { cardDetails, cause, amount, name, email } = location.state || {};
  const [showUserDetails, setshowUserDetails] = useState(false);
  console.log(cardDetails);
  const causes = cause;
  const [details, setDetails] = useState({ name, email });
  // User details input
  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };
  const onSubmit = async () => {
    await sleep(300);
    try {
      window.Stripe.card.createToken(
        {
          number: cardDetails.cardNumber.replace(/\s+/g, ""),
          exp_month: cardDetails.expiry.split("/")[0],
          exp_year: cardDetails.expiry.split("/")[1],
          cvc: cardDetails.cvv,
          name: name,
        },
        (status, response) => {
          if (status === 200) {
            axios
              .post("/stripe-payment", {
                token: response,
                email: email,
                amount: amount,
              })
              .then((res) => window.alert(JSON.stringify(res.data, 0, 2)))
              .catch((err) => console.log(err));
          } else {
            console.log(response.error.message);
          }
        }
      );
    } catch (error) {}
  };
  return (
    <div className="page pay">
      <Progress />
      <h2>review & confirm</h2>
      <div className="details review">
        {/* Card Number */}

        {/* Display Selected Causes */}
        <div className="selected-causes">
          <span>{icons.heart}</span>
          <p>{cause}</p>
          <span id="amount">${amount}</span>
        </div>

        <label htmlFor="payment_method">
          <p>
            <span>{icons.cridetCard}</span>payment method
            <button>cridet card</button>
          </p>
        </label>
        <label htmlFor="doner_details">
          <p>
            <span>{icons.user}</span>doner details
            <button onClick={() => setshowUserDetails((prev) => !prev)}>
              Edit
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
          </>
        )}

        <label htmlFor="donation_type">
          <p>
            <span>{icons.stars}</span>one-time donation
            <button className="fade">change to monthly</button>
          </p>
        </label>
        <div className="total-charged">
          {/* <span>{icons.heart}</span> */}
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
      <button onClick={onSubmit} className="donateBtn">
        Confirm Donation
      </button>
      {/* <Link to={"/success"} className="donateBtn">
        Confirm Donation
      </Link> */}
      <p id="message">a receipt will be sent to your email immediately.</p>
      <Link
        to={`/pay?cause=${encodeURIComponent(
          causes
        )}&amount=${encodeURIComponent(amount)}&name=${encodeURIComponent(
          name
        )}&email=${encodeURIComponent(email)}`}
        className="backBtn"
      >
        back
      </Link>
    </div>
  );
}

export default payNreview;
