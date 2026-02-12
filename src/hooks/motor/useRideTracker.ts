// hooks/useRideTracker.ts
import { useState, useRef } from "react";
import * as Location from 'expo-location';
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

      const { data: compData } = await supabase
        .from("motor_components")
        .select("*")
        .eq("motor_id", activeMotor.id);

      const initialComponents = compData?.map(c => ({
        ...c,
        current_value: parseFloat(c.current_value.toFixed(2)),
        max_value: parseFloat(c.max_value.toFixed(2)),
      })) || [];

      setComponentsState(initialComponents);
      kmRef.current = 0;
      componentsRef.current = initialComponents;

      const granted = await requestLocationPermission();
      if (!granted) return;

      lastPosition.current = null;

      locationSubscription.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 },
        (location) => {
          const { latitude, longitude } = location.coords;

          if (lastPosition.current) {
            const distanceDelta = getDistanceFromLatLonInKm(
              lastPosition.current.latitude,
              lastPosition.current.longitude,
              latitude,
              longitude
            );

            // update kmCounter
            setKmCounter(prev => {
              const newKm = parseFloat((prev + distanceDelta).toFixed(2));
              kmRef.current = newKm;
              return newKm;
            });

            // update components
            setComponentsState(prev => {
              const updated = prev.map(c => ({
                ...c,
                current_value: Math.min(parseFloat((c.current_value + distanceDelta).toFixed(2)), c.max_value)
              }));
              componentsRef.current = updated;
              return updated;
            });
          }

          lastPosition.current = { latitude, longitude };
        }
      );

    } catch (err) {
      console.error("startRide error:", err);
    }
  };
  const resetComponents = (ids?: string[]) => {
    setKmCounter(0);
    kmRef.current = 0;

    // reset current_value komponen yang dipilih atau semua
    const resetComps = componentsState.map(c => {
      if (!ids || ids.includes(c.id)) {
        return { ...c, current_value: 0 };
      }
      return c;
    });

    setComponentsState(resetComps);
    componentsRef.current = resetComps;
  };


  const stopRide = async () => {
    if (!rideId) return;

    try {
      locationSubscription.current?.remove();
      locationSubscription.current = null;

      await supabase
        .from("rides")
        .update({ distance: kmRef.current })
        .eq("id", rideId);

      for (const comp of componentsRef.current) {
        await supabase
          .from("motor_components")
          .update({ current_value: comp.current_value })
          .eq("id", comp.id);
      }

      setIsRiding(false);
      setRideId(null);
      console.log("Ride stopped, DB updated ✅", kmRef.current);

    } catch (err) {
      console.error("stopRide error:", err);
    }
  };

  return { isRiding, kmCounter, componentsState, startRide, stopRide, setComponentsState, resetComponents };
}
