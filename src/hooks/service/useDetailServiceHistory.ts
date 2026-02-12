import { useState, useCallback } from "react";
import { GetServiceDetails } from "@/api/service/getServiceDetails";

export function useServiceDetails(historyId: string) {
  const [details, setDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    try {
      const data = await GetServiceDetails(historyId);
      setDetails(data);
    } catch (error) {
      console.error("Error fetching service details:", error);
      setDetails([]);
    }
    setLoading(false);
  }, [historyId]);

  return { details, loading, fetchDetails };
}
