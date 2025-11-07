import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
function Progress() {
  const location = useLocation();
  const [isTrue, setIsTrue] = useState(false);
  const { payment } = location.state || {};

  return (
    <div className="porgress">
      <span
        style={{
          background: location.pathname.endsWith("/donate")
            ? `var(--primary-clr)`
            : ``,
        }}
      ></span>
      <p
        style={{
          color: location.pathname.endsWith("/donate")
            ? `var(--txt-clr)`
            : `var(--txt-clr-gray)`,
        }}
      >
        cause
      </p>
      <p>{">"}</p>
      <span
        style={{
          background: location.pathname.endsWith("/pay")
            ? `var(--primary-clr)`
            : ``,
        }}
      ></span>
      <p
        style={{
          color: location.pathname.endsWith("/pay")
            ? `var(--txt-clr)`
            : `var(--txt-clr-gray)`,
        }}
      >
        pay
      </p>

      {payment !== "paypal" ? (
        <>
          <p>{">"}</p>
          <span
            style={{
              background: location.pathname.endsWith("/payNreview")
                ? `var(--primary-clr)`
                : ``,
            }}
          ></span>
          <p
            style={{
              color: location.pathname.endsWith("/payNreview")
                ? `var(--txt-clr)`
                : `var(--txt-clr-gray)`,
            }}
          >
            review
          </p>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Progress;
