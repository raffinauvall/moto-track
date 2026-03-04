// hooks/useRideTracker.ts
import { useState, useRef, useEffect, useCallback } from "react";
import * as Location from "expo-location";
import { supabase } from "@/api/supabaseClient";
import { getDistanceFromLatLonInKm, requestLocationPermission } from "@/utils/location";

export function useRideTracker(activeMotor: any) {
  const [isRiding, setIsRiding] = useState(false);
  const [kmCounter, setKmCounter] = useState(0);
  const [rideId, setRideId] = useState<string | null>(null);
  const [componentsState, setComponentsState] = useState<any[]>([]);

  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const lastPosition = useRef<{ latitude: number; longitude: number } | null>(null);
  const kmRef = useRef<number>(0);
  const componentsRef = useRef<any[]>([]);

  /* ================= FETCH COMPONENTS ================= */
  const fetchComponents = useCallback(async (force = false) => {
    // skip fetch kalau lagi riding kecuali force=true
    if (!activeMotor || (isRiding && !force)) return;

    const { data, error } = await supabase
      .from("motor_components")
      .select("*")
      .eq("motor_id", activeMotor.id);

    if (error) {
      console.error("fetchComponents error:", error);
      return;
    }

    const formatted = data?.map(c => ({
      ...c,
      current_value: parseFloat(c.current_value),
      max_value: parseFloat(c.max_value),
    })) || [];

    // update state hanya kalau ga lagi riding
    if (!isRiding) {
      setComponentsState(formatted);
      componentsRef.current = formatted;
    }
  }, [activeMotor, isRiding]);

  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  /* ================= START RIDE ================= */
  const startRide = async () => {
    if (!activeMotor) return;

    try {
      const { data, error } = await supabase
        .from("rides")
        .insert([{ motor_id: activeMotor.id, distance: 0 }])
        .select()
        .single();
      if (error) throw error;

      setRideId(data.id);
      setIsRiding(true);
      setKmCounter(0);
      kmRef.current = 0;

      // ambil komponen terbaru sebelum ride
      await fetchComponents(true);

      const granted = await requestLocationPermission();
      if (!granted) return;

      lastPosition.current = null;

      locationSubscription.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 },
        location => {
          const { latitude, longitude } = location.coords;

          let distanceDelta = 0;
          if (lastPosition.current) {
            distanceDelta = getDistanceFromLatLonInKm(
              lastPosition.current.latitude,
              lastPosition.current.longitude,
              latitude,
              longitude
            );
          }

          if (distanceDelta > 0) {
            // update kmCounter
            kmRef.current += distanceDelta;
            setKmCounter(kmRef.current);

            // update componentsState
            const updatedComponents = componentsRef.current.map(c => ({
              ...c,
              current_value: Math.min(c.current_value + distanceDelta, c.max_value)
            }));

            componentsRef.current = updatedComponents;
            setComponentsState(updatedComponents);
          }

          lastPosition.current = { latitude, longitude };
        }
      );
    } catch (err) {
      console.error("startRide error:", err);
    }
  };

  /* ================= STOP RIDE ================= */
  const stopRide = async () => {
    if (!rideId) return;

    try {
      locationSubscription.current?.remove();
      locationSubscription.current = null;

      // update ride distance
      await supabase
        .from("rides")
        .update({ distance: kmRef.current })
        .eq("id", rideId);

      // update semua components di DB
      const updateResults = await Promise.all(
        componentsRef.current.map(c =>
          supabase
            .from("motor_components")
            .update({ current_value: c.current_value })
            .eq("id", c.id)
        )
      );

      updateResults.forEach(res => {
        if (res.error) console.error("component update error:", res.error);
      });

      setIsRiding(false);
      setRideId(null);

      await fetchComponents(true);

      console.log("Ride stopped, DB updated ✅", kmRef.current);
    } catch (err) {
      console.error("stopRide error:", err);
    }
  };

  /* ================= RESET COMPONENTS ================= */
  const resetComponents = (ids?: string[]) => {
    kmRef.current = 0;
    setKmCounter(0);

    const resetComps = componentsState.map(c => {
      if (!ids || ids.includes(c.id)) {
        return { ...c, current_value: 0 };
      }
      return c;
    });

    componentsRef.current = resetComps;
    setComponentsState(resetComps);
  };

  /* ================= RELOAD COMPONENTS ================= */
  const reloadComponents = async () => {
    await fetchComponents(true);
  };

  return {
    isRiding,
    kmCounter,
    componentsState,
    startRide,
    stopRide,
    setComponentsState,
    resetComponents,
    reloadComponents
  };
}
