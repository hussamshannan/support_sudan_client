import { useCallback } from "react";

const useCampaignCSVExport = () => {
  const exportCSV = useCallback((data, fileName = "campaigns.csv") => {
    if (!data || data.length === 0) return;

    // Helper function to format dates to readable format
    const formatDate = (dateString) => {
      if (!dateString) return "";

      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          // If it's already a formatted date string like "Jan 01, 2023", return as is
          return dateString;
        }

        // Format to: "January 1, 2023"
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch (error) {
        console.warn("Error formatting date:", dateString, error);
        return dateString;
      }
    };

    // Helper function to format ISO dates to readable format
    const formatISODate = (isoString) => {
      if (!isoString) return "";

      try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return "";

        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        });
      } catch (error) {
        console.warn("Error formatting ISO date:", isoString, error);
        return isoString;
      }
    };

    // Helper to calculate days remaining
    const getDaysRemaining = (endDate) => {
      if (!endDate) return "Ongoing";

      try {
        const end = new Date(endDate);
        const now = new Date();
        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays.toString() : "Expired";
      } catch (error) {
        return "Invalid Date";
      }
    };

    // Step 1 — Define the columns to export for campaigns
    const headers = [
      "ID",
      "Title",
      "Cause",
      "Target Amount (USD)",
      "Total Raised (USD)",
      "Progress (%)",
      "Remaining Amount (USD)",
      "Status",
      "Donor Count",
      "Start Date",
      "End Date",
      "Days Remaining",
      "Description",
      "Created At",
      "Updated At",
      "Campaign Duration (Days)",
      "Average Donation (USD)",
      "Completion Rate (%)",
    ];

    // Step 2 — Convert campaign objects to CSV rows with formatted data
    const rows = data.map((campaign) => {
      const remainingAmount = Math.max(
        0,
        campaign.targetAmount - campaign.totalRaised
      );
      const averageDonation =
        campaign.donorCount > 0
          ? (campaign.totalRaised / campaign.donorCount).toFixed(2)
          : "0.00";

      // Calculate campaign duration in days
      let campaignDuration = "Ongoing";
      if (campaign.startDate && campaign.endDate) {
        try {
          const start = new Date(campaign.startDate);
          const end = new Date(campaign.endDate);
          const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
          campaignDuration =
            durationDays > 0 ? durationDays.toString() : "Invalid";
        } catch (error) {
          campaignDuration = "Invalid Dates";
        }
      }

      // Calculate completion rate (progress towards goal)
      const completionRate =
        campaign.targetAmount > 0
          ? ((campaign.totalRaised / campaign.targetAmount) * 100).toFixed(1)
          : "0.0";

      return {
        ID: campaign.id,
        Title: campaign.title,
        Cause: campaign.cause,
        "Target Amount (USD)": `$${campaign.targetAmount.toLocaleString()}`,
        "Total Raised (USD)": `$${campaign.totalRaised.toLocaleString()}`,
        "Progress (%)": `${campaign.progress}%`,
        "Remaining Amount (USD)": `$${remainingAmount.toLocaleString()}`,
        Status: campaign.status,
        "Donor Count": campaign.donorCount,
        "Start Date": formatDate(campaign.startDate),
        "End Date": formatDate(campaign.endDate),
        "Days Remaining": getDaysRemaining(campaign.endDate),
        Description: campaign.description || "No description",
        "Created At": formatISODate(
          campaign.originalData?.createdAt || campaign.createdAt
        ),
        "Updated At": formatISODate(
          campaign.originalData?.updatedAt || campaign.updatedAt
        ),
        "Campaign Duration (Days)": campaignDuration,
        "Average Donation (USD)": `$${averageDonation}`,
        "Completion Rate (%)": `${completionRate}%`,
      };
    });

    // Step 3 — Build CSV string
    const csvContent = [
      headers.join(","), // header row
      ...rows.map((row) =>
        headers
          .map((header) => {
            const value = row[header] ?? "";
            // Handle special characters and commas in values
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");

    // Step 4 — Trigger file download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }, []);

  return { exportCSV };
};

export default useCampaignCSVExport;
