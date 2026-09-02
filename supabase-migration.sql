-- ============================================
-- Moto-Track: Migration untuk fitur Ride History + Map
-- Jalanin di Supabase Dashboard -> SQL Editor
-- ============================================

-- 1. Tambah kolom waktu di tabel rides (kalau belum ada)
ALTER TABLE rides
  ADD COLUMN IF NOT EXISTS start_time timestamptz,
  ADD COLUMN IF NOT EXISTS end_time timestamptz,
  ADD COLUMN IF NOT EXISTS duration integer;

-- 2. Buat tabel ride_points buat nyimpen rute GPS
CREATE TABLE IF NOT EXISTS ride_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id uuid NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Index biar query per-ride cepet
CREATE INDEX IF NOT EXISTS idx_ride_points_ride_id ON ride_points(ride_id);
CREATE INDEX IF NOT EXISTS idx_rides_motor_id ON rides(motor_id);

-- 4. Enable RLS + policy (samain dengan tabel lain)
ALTER TABLE ride_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own ride points"
  ON ride_points
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM rides r
      JOIN motors m ON m.id = r.motor_id
      WHERE r.id = ride_points.ride_id
        AND m.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM rides r
      JOIN motors m ON m.id = r.motor_id
      WHERE r.id = ride_points.ride_id
        AND m.user_id = auth.uid()
    )
  );
