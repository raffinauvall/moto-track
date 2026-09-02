import { useState, useRef, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { getComponents } from '@/api/motorComponent/getComponents';
import { updateComponentValues } from '@/api/motorComponent/updateComponentValues';
import { startRide as apiStartRide, updateRide, insertRidePoints } from '@/api';
import { getDistanceFromLatLonInKm, requestLocationPermission } from '@/utils/location';
import { requestNotificationPermission, scheduleServiceReminder } from '@/utils/notifications';
import type { Motor, MotorComponent } from '@/types';
import type { RidePoint } from '@/api/ride/ridePoints';

export function useRideTracker(activeMotor: Motor | null) {
  const [isRiding, setIsRiding] = useState(false);
  const [kmCounter, setKmCounter] = useState(0);
  const [rideId, setRideId] = useState<string | null>(null);
  const [componentsState, setComponentsState] = useState<MotorComponent[]>([]);

  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const lastPosition = useRef<{ latitude: number; longitude: number } | null>(null);
  const kmRef = useRef<number>(0);
  const componentsRef = useRef<MotorComponent[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const pointsRef = useRef<RidePoint[]>([]);

  const fetchComponents = useCallback(
    async (force = false) => {
      if (!activeMotor || (isRiding && !force)) return;

      const formatted = await getComponents(activeMotor.id).catch((error) => {
        console.error('fetchComponents error:', error);
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
    },
    [activeMotor, isRiding]
  );

  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);
  const startRide = async () => {
    if (!activeMotor) return;

    try {
      const ride = await apiStartRide(activeMotor.id);

      setRideId(ride.id);
      setIsRiding(true);
      setKmCounter(0);
      kmRef.current = 0;
      startTimeRef.current = Date.now();
      pointsRef.current = [];

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

          // kumpulin titik pergerakan buat map
          pointsRef.current = [
            ...pointsRef.current,
            { latitude, longitude, recorded_at: new Date().toISOString() },
          ];
        }
      );
    } catch (err) {
      console.error('startRide error:', err);
    }
  };

  /* ================= STOP RIDE ================= */
  const stopRide = async () => {
    if (!rideId) return;

    try {
      locationSubscription.current?.remove();
      locationSubscription.current = null;

      // hitung durasi ride (detik)
      const duration = startTimeRef.current
        ? Math.round((Date.now() - startTimeRef.current) / 1000)
        : 0;
      startTimeRef.current = null;

      // update ride distance + end_time + duration
      await updateRide(rideId, kmRef.current, duration);

      // simpen titik GPS buat map di ride history (jangan block kalau tabel belum ada)
      try {
        await insertRidePoints(rideId, pointsRef.current);
      } catch (err) {
        console.warn('insertRidePoints skipped:', err);
      }
      pointsRef.current = [];

      // update semua components di DB
      await updateComponentValues(componentsRef.current);

      // schedule reminder buat komponen yang udah ≥80% dari limit
      const nearLimit = componentsRef.current.filter(
        (c) => c.max_value > 0 && c.current_value / c.max_value >= 0.8
      );

      if (nearLimit.length > 0) {
        const granted = await requestNotificationPermission();
        if (granted) {
          for (const comp of nearLimit) {
            await scheduleServiceReminder({
              title: `${comp.name} butuh servis`,
              body: `${comp.name} motor ${activeMotor?.name} udah ${Math.round(
                (comp.current_value / comp.max_value) * 100
              )}% dari batas. Yuk service sekarang!`,
              triggerDate: new Date(Date.now() + 60 * 60 * 1000), // +1 jam
            });
          }
        }
      }

      setIsRiding(false);
      setRideId(null);

      await fetchComponents(true);

      console.log('Ride stopped, DB updated ✅', kmRef.current);
    } catch (err) {
      console.error('stopRide error:', err);
    }
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
    reloadComponents,
  };
}
