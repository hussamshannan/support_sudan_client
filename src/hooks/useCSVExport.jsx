import { useCallback } from "react";

const useCSVExport = () => {
  const exportCSV = useCallback((data, fileName = "donations.csv") => {
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

    // Step 1 — Define the columns to export
    const headers = [
      "ID",
      "Date",
      "Donor Name",
      "Cause",
      "Amount (USD)",
      "Payment Method",
      "Status",
      "Email",
      "Country",
      "Recurring Donation",
      "Receipt URL",
      "Original Created Date",
      "Transaction ID",
      "Payment Status",
    ];

    // Step 2 — Convert objects to CSV rows with formatted dates
    const rows = data.map((item) => ({
      ID: item.id,
      Date: formatDate(item.date),
      "Donor Name": item.donor,
      Cause: item.cause,
      "Amount (USD)": `$${item.amount}`,
      "Payment Method": item.method,
      Status: item.status,
      Email: item.email || "Not provided",
      Country: item.country || "Not provided",
      "Recurring Donation": item.isRecurring ? "Yes" : "No",
      "Receipt URL": item.receipt || "Not available",
      "Original Created Date": formatISODate(item.originalData?.createdAt),
      "Transaction ID": item.originalData?.transactionId || "Not available",
      "Payment Status": item.originalData?.paymentStatus || "Completed",
    }));

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

export default useCSVExport;
