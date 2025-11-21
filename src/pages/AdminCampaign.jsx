import React from "react";
import CampaignsTable from "../components/CampaignsTable";
function AdminCampaign() {
  return (
    <div className="page Campaigns">
      <CampaignsTable show={true} />
    </div>
  );
}

export default AdminCampaign;
