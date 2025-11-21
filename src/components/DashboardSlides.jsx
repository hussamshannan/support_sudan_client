import React from "react";
import useDashboardStats from "../service/dashboardService";

const DashboardSlides = () => {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <div className="slides">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="slide loading">
            <div className="skeleton-line short"></div>
            <div className="skeleton-line medium"></div>
            <div className="skeleton-line long"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="slides">
        <div className="slide error">
          <p>Failed to load dashboard statistics</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="slides">
        <div className="slide">
          <span>No data available</span>
        </div>
      </div>
    );
  }
  const formatNumberWithCommas = (number) => {
    if (!number) return "";
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="slides">
      <div className="slide">
        <span>total raised</span>
        <h6>${formatNumberWithCommas(stats.totalRaised.toFixed(1))}</h6>
        <p>+{formatNumberWithCommas(stats.percentageChange)}% vs prev</p>
      </div>
      <div className="slide">
        <span>donations</span>
        <h6>{stats.totalDonations.toLocaleString()}</h6>
        <p>avg ${formatNumberWithCommas(stats.averageDonation.toFixed(1))}</p>
      </div>
      <div className="slide">
        <span>needs attention</span>
        <h6>{stats.leastFundedCampaign}</h6>
        <p>${formatNumberWithCommas(stats.fundsNeeded)} needed</p>
      </div>
      <div className="slide">
        <span>active campaigns</span>
        <h6>{stats.activeCampaigns}</h6>
        <p>{stats.campaignNames}</p>
      </div>
    </div>
  );
};

export default DashboardSlides;
