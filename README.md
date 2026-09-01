# 🏍️ MotoTrack

Aplikasi mobile untuk memantau kesehatan & perawatan motor. Lacak pemakaian motor, pantau kondisi komponen secara real-time, dan catat riwayat servis — semua dalam satu aplikasi.

Dibangun dengan **React Native (Expo SDK 57)** + **Supabase**.

---

## ✨ Fitur

- **Auth** — Registrasi & login dengan email/password (Supabase Auth)
- **Manajemen Motor** — Tambah, edit, hapus, dan set motor aktif
- **Health Score** — Skor kesehatan motor (0–100%) dihitung dari kondisi semua komponen
- **Komponen Motor** — Tambah komponen (sparepart) per motor, pin komponen penting, edit nilai pemakaian
- **Ride Tracker** — Mulai tracking perjalanan pakai GPS, jarak tempuh terakumulasi otomatis ke nilai komponen (wear & tear)
- **Riwayat Servis** — Catat servis, detail komponen yang diservis + KM saat servis, dan riwayat lengkap per motor
- **Status Komponen** — GOOD / WARNING / SERVICE dengan health bar visual
- **Custom Toast** — Notifikasi in-app sukses/error
- **Dark UI** — Tampilan gelap konsisten dengan animasi tab bar & font custom

## 🧱 Tech Stack

| Teknologi | Kegunaan |
|---|---|
| [Expo SDK 57](https://expo.dev) | Framework React Native |
| [React Native](https://reactnative.dev) 0.86 | UI framework |
| [Supabase](https://supabase.com) | Auth + Database (Postgres) + API |
| [React Navigation](https://reactnavigation.org) v7 | Navigasi (native-stack + tab) |
| [NativeWind](https://www.nativewind.dev) v4 | Styling Tailwind untuk React Native |
| [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) | Animasi |
| [react-native-tab-view](https://github.com/react-native-tab-view/react-native-tab-view) | Custom bottom tab |
| [lucide-react-native](https://lucide.dev) | Ikon |
| [expo-location](https://docs.expo.dev/versions/latest/sdk/location/) | Tracking GPS untuk ride tracker |

## 📁 Struktur Project

```
moto-track/
├── App.tsx                    # Entry point: fonts, auth state, toast, navigator
├── app.json                   # Expo app config
├── assets/
│   └── fonts/maison/          # Custom fonts (Maison Neue)
└── src/
    ├── api/                   # Lapisan Supabase API
    │   ├── auth/              # login, register, signOut
    │   ├── motor/             # CRUD motor + active motor
    │   ├── motorComponent/    # CRUD komponen + pin + update nilai
    │   ├── ride/              # startRide, updateRideDistance
    │   └── service/           # createService, getService, getServiceDetails
    ├── components/            # UI reusable (Header, MotorCard, HealthBar, dst)
    ├── context/               # ActiveMotorContext (motor aktif global)
    ├── hooks/                 # useRideTracker, useServiceDetails, dst
    ├── navigation/            # Stack navigator + custom animated bottom tab
    ├── screens/
    │   ├── auth/              # Welcome, Login, Register
    │   ├── home/              # HomeScreen (health, ride tracker, pinned)
    │   ├── motor/             # Daftar motor, detail, add/edit, komponen
    │   ├── service/           # Riwayat servis + form servis
    │   └── profile/           # ProfileScreen
    ├── types/                 # TypeScript types (Motor, Component, Ride, dst)
    └── utils/                 # location helpers, toast service
```

## 🚀 Cara Menjalankan

### Prasyarat

- Node.js ≥ 20
- npm
- Expo Go di HP (atau emulator Android/iOS)
- Akun & project Supabase (untuk auth + database)

### 1. Install dependencies

```bash
npm install
```

> **Catatan:** pastikan `NODE_ENV` tidak `production` saat install, karena npm akan melewati `devDependencies`.

### 2. Siapkan Supabase

Buat project di [supabase.com](https://supabase.com), lalu isi kredensial di `app.json`:

```jsonc
// app.json → expo.extra
{
  "SUPABASE_URL": "https://xxx.supabase.co",
  "SUPABASE_ANON_KEY": "eyJhbGciOi..."
}
```

Buat tabel berikut (sesuai skema di `src/types/index.ts`):

- `motors` — `id`, `user_id`, `name`, `brand`, `is_active`, `created_at`
- `motor_components` — `id`, `motor_id`, `name`, `current_value`, `max_value`, `is_pinned`
- `rides` — `id`, `motor_id`, `distance`, `start_time`, `end_time`
- `service_history` — `id`, `motor_id`, `motor_name`, `service_type`, `total_components`, `service_date`
- `motor_services` — `id`, `motor_id`, `service_history_id`, `component_id`, `component_name`, `km_at_service`

Aktifkan **Supabase Auth** (email/password) di dashboard.

### 3. Jalankan

```bash
npx expo start
```

Lalu scan QR code dengan Expo Go, atau tekan `a` untuk Android emulator / `w` untuk web.

Script lain yang tersedia:

```bash
npm run android   # buka di Android emulator
npm run ios       # buka di iOS simulator
npm run web       # buka di browser
npm run lint      # eslint + prettier check
npm run format    # auto-fix eslint + prettier
npm run prebuild  # generate native project (bare workflow)
```

## 🔑 Alur Auth

`App.tsx` mendengarkan perubahan state auth dari Supabase. Ketika tidak ada user, navigator menampilkan `Welcome → Login/Register`. Setelah login, masuk ke `MainTabs` (Home, Motor, Service, Profile) + stack screens (detail motor, komponen, servis).

## 📱 Fitur Detail

### Home
- Menampilkan motor aktif, health score, dan komponen yang di-pin
- Tombol **Start Tracking** — mulai GPS tracking; jarak yang ditempuh otomatis menambah `current_value` komponen (simulasi keausan)
- Health = rata-rata `(1 - current/max)` dari semua komponen × 100

### Motor
- Daftar semua motor dengan health bar & status (GOOD / WARNING / SERVICE)
- Set motor aktif, edit, hapus
- Tambah/atur komponen per motor (nama, nilai saat ini, nilai maksimal, pin)

### Service
- Pilih motor → centang komponen yang diservis
- Otomatis diklasifikasikan **Service Ringan** (≤ 2 komponen) atau **Service Berat** (> 2)
- Simpan servis → catat di riwayat + reset nilai komponen ke 0
- Lihat riwayat servis lengkap + detail komponen & KM saat servis

## 🛠 Troubleshooting

- **`expo-doctor` / versi package tidak cocok** — jalankan `npx expo install --check` untuk sinkronkan dependency dengan SDK.
- **Audit vulnerabilities** — project sudah bersih (`npm audit` → 0 vulnerabilities). Overrides untuk `uuid`, `xcode`, `query-string`, `decode-uri-component` ada di `package.json` untuk menutup advisory transitif dari toolchain Expo.
- **Bundling error "Cannot find module"** — pastikan path import di `src/` menggunakan alias `@/` (dikonfigurasi di `tsconfig.json`).

## 📄 Lisensi

Private project — © 2026 [raffinauvall](https://github.com/raffinauvall)
