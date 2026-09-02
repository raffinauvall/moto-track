import { useState, useCallback } from 'react';
import { getServiceDetails } from '@/api/service/getServiceDetails';
import type { ServiceDetail } from '@/types';

export function useServiceDetails(historyId: string) {
  const [details, setDetails] = useState<ServiceDetail[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getServiceDetails(historyId);
      setDetails(data);
    } catch (error) {
      console.error('Error fetching service details:', error);
      setDetails([]);
    }
    setLoading(false);
  }, [historyId]);

  return { details, loading, fetchDetails };
}
