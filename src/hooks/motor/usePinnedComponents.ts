import { useState, useCallback } from "react";
import { supabase } from "@/api/supabaseClient";

export function usePinnedComponents(motorId: string | null) {
    const [pinnedComponents, setPinnedComponents] = useState<any[]>([]);

    const fetchPinned = useCallback(async () => {
        if (!motorId) return setPinnedComponents([]);
        const { data, error } = await supabase
            .from("motor_components")
            .select("*")
            .eq("motor_id", motorId)
            .eq("is_pinned", true)
            .limit(4);
        if (!error && data) setPinnedComponents(data);
    }, [motorId]);

    return { pinnedComponents, fetchPinned };
}
