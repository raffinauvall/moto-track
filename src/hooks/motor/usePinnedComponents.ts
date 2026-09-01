import { useState, useCallback } from "react";
import { getPinnedComponents } from "@/api/motorComponent/getPinnedComponents";
import type { MotorComponent } from "@/types";

export function usePinnedComponents(motorId: string | null) {
  const [pinnedComponents, setPinnedComponents] = useState<MotorComponent[]>([]);

  const fetchPinned = useCallback(async () => {
    if (!motorId) {
      setPinnedComponents([]);
      return;
    }
    try {
      const data = await getPinnedComponents(motorId);
      setPinnedComponents(data);
    } catch (error) {
      console.error("Error fetching pinned components:", error);
      setPinnedComponents([]);
    }
  }, [motorId]);

  return { pinnedComponents, fetchPinned };
}
