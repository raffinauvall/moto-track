import { useState, useRef, useEffect, useCallback } from "react";
import * as Location from "expo-location";
import { getComponents } from "@/api/motorComponent/getComponents";
import { updateComponentValues } from "@/api/motorComponent/updateComponentValues";
import { startRide as apiStartRide, updateRideDistance } from "@/api";
import { getDistanceFromLatLonInKm, requestLocationPermission } from "@/utils/location";
import type { Motor, MotorComponent } from "@/types";

export function useRideTracker(activeMotor: Motor | null) {
  const [isRiding, setIsRiding] = useState(false);
  const [kmCounter, setKmCounter] = useState(0);
  const [rideId, setRideId] = useState<string | null>(null);
  const [componentsState, setComponentsState] = useState<MotorComponent[]>([]);

  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const lastPosition = useRef<{ latitude: number; longitude: number } | null>(null);
  const kmRef = useRef<number>(0);
  const componentsRef = useRef<MotorComponent[]>([]);

  /* ================= FETCH COMPONENTS ================= */
  const fetchComponents = useCallback(async (force = false) => {
    // skip fetch kalau lagi riding kecuali force=true
    if (!activeMotor || (isRiding && !force)) return;

    const formatted = await getComponents(activeMotor.id).catch((error) => {
      console.error("fetchComponents error:", error);
      return [] as MotorComponent[];
    });

    const parsed = formatted.map((c) => ({
      ...c,
      current_value: Number(c.current_value),
      max_value: Number(c.max_value),
    }));

    // update state hanya kalau ga lagi riding
    if (!isRiding) {
      setComponentsState(parsed);
      componentsRef.current = parsed;
    }
  }, [activeMotor, isRiding]);

  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  /* ================= START RIDE ================= */
  const startRide = async () => {
    if (!activeMotor) return;

    try {
      const ride = await apiStartRide(activeMotor.id);

      setRideId(ride.id);
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
        (location) => {
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
            const updatedComponents = componentsRef.current.map((c) => ({
              ...c,
              current_value: Math.min(c.current_value + distanceDelta, c.max_value),
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
      await updateRideDistance(rideId, kmRef.current);

      // update semua components di DB
      await updateComponentValues(componentsRef.current);

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

    const resetComps = componentsState.map((c) => {
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
    reloadComponents,
  };
}
