import { useState, useEffect } from "react";
import useAxios from "../hooks/useAxios";

const useDashboardStats = () => {
  const { data, error, loading, get } = useAxios();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get all donations to calculate totals
        const donationsResponse = await get("/donations/all");
        const donations = donationsResponse?.data || [];

        // Get donation targets for campaign info
        const targetsResponse = await get("/donations/targets");
        const targets = targetsResponse?.data || [];

        const calculatedStats = calculateStats(donations, targets);
        setStats(calculatedStats);
      } catch (err) {
        console.error("Error in useDashboardStats:", err);
      }
    };

    fetchStats();
  }, [get]);

  return { stats, error, loading };
};

// All calculations consolidated in one function
const calculateStats = (donations, targets) => {
  const now = new Date();

  // Define time periods for calculations
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sixtyDaysAgo = new Date(now);
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  // Filter donations by time periods
  const currentWeekDonations = donations.filter(
    (d) => new Date(d.createdAt) >= oneWeekAgo
  );

  const previousWeekDonations = donations.filter(
    (d) =>
      new Date(d.createdAt) >= twoWeeksAgo && new Date(d.createdAt) < oneWeekAgo
  );

  const currentPeriodDonations = donations.filter(
    (d) => new Date(d.createdAt) >= thirtyDaysAgo
  );

  const previousPeriodDonations = donations.filter(
    (d) =>
      new Date(d.createdAt) >= sixtyDaysAgo &&
      new Date(d.createdAt) < thirtyDaysAgo
  );

  // 1. TOTAL RAISED & PERCENTAGE CHANGE (Last 30 days vs Previous 30 days)
  const totalRaised = donations.reduce(
    (sum, donation) => sum + donation.amount,
    0
  );
  const currentPeriodTotal = currentPeriodDonations.reduce(
    (sum, d) => sum + d.amount,
    0
  );
  const previousPeriodTotal = previousPeriodDonations.reduce(
    (sum, d) => sum + d.amount,
    0
  );

  const percentageChange =
    previousPeriodTotal > 0
      ? ((currentPeriodTotal - previousPeriodTotal) / previousPeriodTotal) * 100
      : currentPeriodTotal > 0
      ? 100
      : 0;

  // 2. DONATIONS COUNT & AVERAGE
  const totalDonations = donations.length;
  const averageDonation = totalDonations > 0 ? totalRaised / totalDonations : 0;

  // 3. WEEKLY ACTIVITY (Last 7 days vs Previous 7 days)
  const weeklyAmount = currentWeekDonations.reduce(
    (sum, d) => sum + d.amount,
    0
  );
  const weeklyCount = currentWeekDonations.length;
  const previousWeekAmount = previousWeekDonations.reduce(
    (sum, d) => sum + d.amount,
    0
  );

  const weeklyGrowth =
    previousWeekAmount > 0
      ? ((weeklyAmount - previousWeekAmount) / previousWeekAmount) * 100
      : weeklyAmount > 0
      ? 100
      : 0;

  // 4. CAMPAIGN STATISTICS
  // Active campaigns count
  const activeCampaigns = targets.filter(
    (campaign) => campaign.status === "active"
  ).length;

  const campaignNames = targets
    .map((campaign) => {
      if (campaign.status === "active")
        return campaign.cause.split(" ")[0].toLowerCase();
    })
    .join(", ");

  const totalCampaigns = targets.length;

  // Draft campaigns count
  const draftCampaigns = targets.filter(
    (campaign) => campaign.status === "draft"
  ).length;

  // Completed/archived campaigns count
  const completedCampaigns = targets.filter(
    (campaign) =>
      campaign.status === "completed" || campaign.status === "archived"
  ).length;

  // Most funded campaign (highest progress)
  const mostFunded = targets.reduce(
    (max, target) => (target.progress > max.progress ? target : max),
    { progress: 0, cause: "None" }
  );

  // Campaign needing most attention (lowest funding)
  const leastFunded = targets.reduce(
    (min, target) => (target.progress < min.progress ? target : min),
    { progress: 100, cause: "All funded" }
  );

  const fundsNeeded = leastFunded.targetAmount - leastFunded.totalRaised;

  // 5. PAYMENT METHOD ANALYSIS
  const paymentMethods = donations.reduce((acc, donation) => {
    acc[donation.type] = (acc[donation.type] || 0) + 1;
    return acc;
  }, {});

  const topPaymentMethod = Object.entries(paymentMethods).reduce(
    (max, [method, count]) => (count > max.count ? { method, count } : max),
    { method: "", count: 0 }
  );

  // 6. DONOR RETENTION (Estimate based on email)
  const donorHistory = {};
  donations.forEach((donation) => {
    if (donation.email) {
      if (!donorHistory[donation.email]) {
        donorHistory[donation.email] = [];
      }
      donorHistory[donation.email].push(donation);
    }
  });

  const returningDonors = Object.values(donorHistory).filter(
    (donations) => donations.length > 1
  ).length;

  const totalDonors = Object.keys(donorHistory).length;
  const retentionRate =
    totalDonors > 0 ? (returningDonors / totalDonors) * 100 : 0;

  return {
    // Core metrics
    totalRaised,
    totalDonations,
    averageDonation: Math.round(averageDonation * 100) / 100,

    // Growth metrics
    percentageChange: Math.round(percentageChange * 10) / 10,
    weeklyAmount,
    weeklyCount,
    weeklyGrowth: Math.round(weeklyGrowth * 10) / 10,

    // Campaign metrics
    activeCampaigns,
    completedCampaigns,
    totalCampaigns,
    draftCampaigns,
    campaignNames,
    mostFundedCampaign: mostFunded.cause.split(" ")[0].toLowerCase(),
    highestCompletion: Math.round(mostFunded.progress),
    leastFundedCampaign: leastFunded.cause.split(" ")[0].toLowerCase(),
    leastFundedProgress: Math.round(leastFunded.progress),
    fundsNeeded: Math.round(fundsNeeded),

    // Additional insights
    topPaymentMethod: topPaymentMethod.method,
    returningDonors,
    retentionRate: Math.round(retentionRate),

    // Raw data for debugging
    _debug: {
      currentPeriodTotal,
      previousPeriodTotal,
      currentWeekAmount: weeklyAmount,
      previousWeekAmount,
      donorCount: totalDonors,
    },
  };
};

export default useDashboardStats;
