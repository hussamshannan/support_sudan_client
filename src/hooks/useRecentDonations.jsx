import { useState, useEffect } from "react";
import useAxios from "./useAxios";

const useRecentDonations = (page = 1, limit = 5) => {
  const { data, error, loading, get } = useAxios();
  const [donations, setDonations] = useState([]);
  const [allDonations, setAllDonations] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalDonations: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    const fetchRecentDonations = async () => {
      try {
        const response = await get(`/donations?page=${page}&limit=${limit}`);
        const all = await get(`/donations/all`);

        // The donations array is directly in response.data (not response.data.data)
        const donationsData = response?.data || [];
        const allDonationsData = all?.data || [];

        // Format donations for the component
        const formattedDonations = formatDonations(donationsData);
        const formattedAllDonations = formatDonations(allDonationsData);

        setDonations(formattedDonations);
        setAllDonations(formattedAllDonations);
        setPagination({
          currentPage: response?.currentPage || 1,
          totalPages: response?.totalPages || 1,
          totalDonations: response?.totalDonations || 0,
          hasNextPage: response?.hasNextPage || false,
          hasPrevPage: response?.hasPrevPage || false,
        });
      } catch (err) {
        console.error("Error in useRecentDonations:", err);
      }
    };

    fetchRecentDonations();
  }, [get, page, limit]);

  return {
    donations,
    allDonations,
    pagination,
    error,
    loading,
    nextPage: pagination.hasNextPage ? page + 1 : page,
    prevPage: pagination.hasPrevPage ? page - 1 : page,
  };
};

// Format donations to match the component's expected structure
const formatDonations = (donations) => {
  if (!donations || !Array.isArray(donations)) {
    console.warn("formatDonations received invalid data:", donations);
    return [];
  }

  return donations
    .map((donation) => {
      if (!donation) {
        console.warn("Invalid donation item:", donation);
        return null;
      }

      return {
        id: donation._id,
        date: formatDate(donation.createdAt),
        donor: donation.name || "Anonymous Donor",
        cause: donation.cause || "General Donation",
        amount: donation.amount || 0,
        method: donation.method || "Unknown",
        status: getStatus(donation.paymentStatus),
        email: donation.email,
        country: donation.country,
        isRecurring: donation.isRecurring || false,
        originalData: donation,
        receipt: donation.transactionId,
      };
    })
    .filter(Boolean); // Remove any null entries
};

// Format date to "MMM DD, YYYY" format
const formatDate = (dateString) => {
  if (!dateString) return "Unknown Date";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (error) {
    console.warn("Error formatting date:", dateString, error);
    return "Invalid Date";
  }
};

// Convert payment status to display format
const getStatus = (paymentStatus) => {
  const statusMap = {
    success: "Completed",
    failed: "Failed",
    pending: "Pending",
    refunded: "Refunded",
  };

  return statusMap[paymentStatus] || "Completed";
};

export default useRecentDonations;
