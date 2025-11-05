import React from "react";
import icons from "../assets/icons/icons";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer>
      <div className="contact">
        <div className="email">
          <span>{icons.mail}</span>
          <a href="mailto:hussamshannan5@gmail.com">hussamshannan5@gmail.com</a>
        </div>
        <div className="phone">
          <span>{icons.phone}</span>
          <a href="tel:+971 58 503 1581">+971 58 503 1581</a>
        </div>
      </div>
      <p>
        100% encrypted payments. Funds are allocated to on-the-ground partners
        with monthly impact reports.
      </p>
    </footer>
  );
}

export default Footer;
