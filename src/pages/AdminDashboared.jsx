import React from "react";
import DashboardSlides from "../components/DashboardSlides";
import RecentDonations from "../components/RecentDonations";
import DonationsTagrets from "../components/DonationsTagrets";
import QuickActions from "../components/QuickActions";
import ArticleListcomponent from "../components/ArticleList";
import CampaignsTable from "../components/CampaignsTable";

function AdminDashboared() {
  return (
    <div className="page AdminDashboared">
      <DashboardSlides />
      <QuickActions />
      <div className="cases-container">
        <RecentDonations show={false} isfilters={false} />
        <DonationsTagrets />
      </div>
      <div className="cases-container">
        <CampaignsTable show={false} />
        <ArticleListcomponent show={false} />
      </div>
    </div>
  );
}

export default AdminDashboared;
