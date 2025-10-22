import { useState, useEffect } from "react";

export function useFetchApplications() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "http://localhost:8000/recruiter/all-applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        setApplications(data);
        // Assuming stats are part of the response, otherwise adjust accordingly
        setStats(data.stats);
      } catch (error: any) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [filters]);

  return { applications, stats, isLoading, error, filters, setFilters };
}
