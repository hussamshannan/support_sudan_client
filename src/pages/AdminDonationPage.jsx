import React from "react";
import DashboardSlides from "../components/DashboardSlides";
import RecentDonations from "../components/RecentDonations";
function adminDonationPage() {
  return (
    <div className="page AdminDonationPage">
      <DashboardSlides />
      <div className="cases-container">
        <RecentDonations show={true} isfilters={true} />
      </div>
    </div>
  );
}

export default adminDonationPage;
