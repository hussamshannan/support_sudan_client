import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const useAxios = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Ref to track if component is mounted
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Generic request method
  const request = useCallback(async (config) => {
    if (!isMounted.current) return;

    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const response = await axiosInstance({
        ...config,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });

      if (isMounted.current) {
        setData(response.data);
        setProgress(100);
      }

      return response.data;
    } catch (err) {
      if (isMounted.current) {
        setError({
          message: err.response?.data?.error || err.message,
          status: err.response?.status,
          code: err.code,
        });
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
        // Reset progress after a delay
        setTimeout(() => setProgress(0), 500);
      }
    }
  }, []);

  // Specific HTTP methods
  const get = useCallback(
    (url, config = {}) => {
      return request({ method: "GET", url, ...config });
    },
    [request]
  );

  const post = useCallback(
    (url, data, config = {}) => {
      return request({ method: "POST", url, data, ...config });
    },
    [request]
  );

  const put = useCallback(
    (url, data, config = {}) => {
      return request({ method: "PUT", url, data, ...config });
    },
    [request]
  );

  const patch = useCallback(
    (url, data, config = {}) => {
      return request({ method: "PATCH", url, data, ...config });
    },
    [request]
  );

  const del = useCallback(
    (url, config = {}) => {
      return request({ method: "DELETE", url, ...config });
    },
    [request]
  );

  // Clear states
  const clear = useCallback(() => {
    setData(null);
    setError(null);
    setProgress(0);
  }, []);

  // Clear only error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // States
    data,
    error,
    loading,
    progress,

    // Methods
    request,
    get,
    post,
    put,
    patch,
    delete: del,

    // Utilities
    clear,
    clearError,

    // Axios instance for direct access
    axiosInstance,
  };
};

export default useAxios;
