import React, { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";

function DonationsTargets() {
  const [targets, setTargets] = useState([]);
  const { data, error, loading, get } = useAxios();

  async function fetch() {
    try {
      const res = await get("/donations/targets");
      if (error) throw error;
      setTargets(res.data);
    } catch (error) {
      console.log(error.response?.data?.message || "Error fetching targets");
    }
  }

  useEffect(() => {
    fetch();
  }, []);

  // Skeleton loading state
  if (loading) {
    return (
      <div className="cases">
        {[...Array(3)].map((_, index) => (
          <div className="case skeleton" key={index}>
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-amount"></div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="cases">
        <div className="case error">
          <p>Failed to load donation targets</p>
          <button onClick={fetch} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (targets.length === 0 && !loading) {
    return (
      <div className="cases">
        <div className="case empty">
          <p>No donation targets found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cases">
      {targets.map((value, index) => (
        <div className="case" key={value.id || value._id || index}>
          <p>{value.cause}</p>{" "}
          <span>${value.totalRaised?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export default DonationsTargets;
