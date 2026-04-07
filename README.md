# MediBook — Appointment Booking App
### Built with Expo SDK 54 · React Native 0.79 · React 19

A production-ready React Native (Expo) application that allows users to register, browse service providers, book appointments, and manage bookings — with a polished, recruiter-ready UI.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 Authentication | Register, Login, Logout with AsyncStorage persistence |
| 🏥 Provider Listing | Filterable list with search + category chips |
| 👤 Provider Details | Full profile with stats, about, and available slots preview |
| 📅 Appointment Booking | 14-day date picker + slot selection + booking summary |
| 📋 Appointment Management | Upcoming/cancelled tabs, cancel with confirmation dialog |
| 🎨 Polished UI | Cards, badges, empty states, loading indicators, tab navigation |

---

## 🧭 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Expo SDK | ~54.0.0 |
| React Native | React Native | 0.79.2 |
| React | React | 19.0.0 |
| Navigation | React Navigation | v7 |
| Storage | AsyncStorage | 2.2.0 |
| Gestures | react-native-gesture-handler | ~2.24.0 |
| Safe Area | react-native-safe-area-context | ~5.4.0 |
| Screens | react-native-screens | ~4.10.0 |

> **Note:** Uses New Architecture (`newArchEnabled: true`) — compatible with Expo Go SDK 54.

---

## 📁 Project Structure

```
AppointmentApp/
├── App.js                         # Entry — GestureHandlerRootView + AuthProvider
├── app.json                       # Expo config (SDK 54, newArchEnabled, android package)
├── eas.json                       # EAS build profiles (preview APK / production AAB)
├── babel.config.js
├── package.json
└── src/
    ├── components/
    │   ├── ProviderCard.js        # Reusable provider card with rating, fee, location
    │   └── AppointmentCard.js     # Appointment card with status badge + cancel action
    ├── context/
    │   ├── AuthContext.js         # Auth state: register, login, logout, session restore
    │   └── AppContext.js          # Appointments: book, cancel, isSlotBooked
    ├── data/
    │   └── mockProviders.js       # 6 mock doctors + category filter chips
    ├── navigation/
    │   └── AppNavigator.js        # Auth stack / Main stack + bottom tab navigator
    ├── screens/
    │   ├── LoginScreen.js         # Email + password with validation + error handling
    │   ├── RegisterScreen.js      # Full registration form with all field validations
    │   ├── HomeScreen.js          # Doctor list with live search + category filter
    │   ├── ProviderDetailsScreen.js  # Doctor profile, stats, slot preview, book CTA
    │   ├── BookingScreen.js       # Date picker (14 days) + slots + booking summary
    │   └── AppointmentsScreen.js  # Upcoming/cancelled tabs, user profile card
    └── utils/
        └── storage.js             # Typed AsyncStorage wrapper with error handling
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js 18+
- Expo Go app (SDK 54) installed on your Android device

### Steps

```bash
# 1. Unzip and enter the project
cd AppointmentApp

# 2. Install all dependencies
npm install

# 3. Start the Expo dev server
npx expo start

# 4. Scan QR code with Expo Go (Android) — make sure Expo Go is SDK 54
```

> Press `a` to open directly on a connected Android emulator.

---

## 📱 APK Build (EAS)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account (free)
eas login

# Build APK for internal distribution
eas build -p android --profile preview
```

APK download link appears in your Expo dashboard at https://expo.dev after ~5 minutes.

### Local APK build (no Expo account needed)

```bash
# Requires Android Studio + Java 17
npx expo run:android --variant release
```

---

## 🧪 How to Test

1. **Register** a new account (any email + password ≥ 6 chars)
2. **Browse** doctors — use the search bar or category chips
3. Tap a doctor → **View Details** → tap **Book Appointment**
4. **Pick a date** from the horizontal 14-day scroller
5. **Select a time slot** — booked slots are crossed out and disabled
6. **Confirm booking** — see the summary card before committing
7. Go to **My Bookings tab** → view upcoming appointment
8. Tap **Cancel Appointment** → confirm in the dialog
9. Switch to **Cancelled tab** to see the cancelled record

---

## 🏗️ Architecture Notes

### Why Context API over Redux?
Clean separation with two contexts — `AuthContext` (identity/session) and `AppContext` (appointments, only mounted when authenticated). No Redux boilerplate needed at this scope.

### AsyncStorage Schema
```
APPT_USER         → { id, name, email, phone }         (active session)
APPT_USERS_DB     → { [email]: { ...user, password } }  (user registry)
APPT_APPOINTMENTS → { [userId]: [ ...appointments ] }   (per-user data)
```

### Slot Deduplication
A slot is locked per `(providerId + slot + date)` tuple — you can't book the same slot twice for the same doctor on the same day. The slot renders disabled with strikethrough.

### SDK 54 / New Architecture
- `newArchEnabled: true` in app.json — fully compatible with Expo Go SDK 54
- `GestureHandlerRootView` wraps the app (required by react-navigation v7)
- `@react-native-async-storage/async-storage@2.2.0` — the only version compatible with SDK 54 (v3.x has a known build issue)

---

## 🎨 Design Tokens

| Token | Value |
|---|---|
| Primary | `#6C63FF` |
| Background | `#F8F7FF` |
| Surface | `#FFFFFF` |
| Text Primary | `#1A1A2E` |
| Text Muted | `#64748B` |
| Success | `#22C55E` |
| Danger | `#EF4444` |
| Warning | `#F59E0B` |

---

## 🔮 Future Improvements

- **Real backend** — Node.js + Express + MongoDB / Firebase
- **Real-time slot locking** — WebSockets to prevent race conditions
- **Push notifications** — expo-notifications for appointment reminders
- **Reschedule** — modify booking without cancel/re-book flow
- **Doctor ratings** — let users rate after appointment
- **Location filter** — find doctors near you via GPS
- **Payment gateway** — Razorpay integration for fee collection
- **OTP login** — phone-based authentication

---

## ⚙️ Assumptions

- All provider data is static mock data (no backend API)
- Available time slots are fixed per provider (not real-time inventory)
- Slot availability is per-user (not globally shared across users)
- Authentication is local-only via AsyncStorage (no JWT / OAuth)
- App targets Android; code is iOS-compatible but not explicitly tested

---

## 📦 Key Dependencies

```json
{
  "expo": "~54.0.0",
  "react": "19.0.0",
  "react-native": "0.79.2",
  "@react-native-async-storage/async-storage": "2.2.0",
  "@react-navigation/native": "^7.0.14",
  "@react-navigation/native-stack": "^7.2.0",
  "@react-navigation/bottom-tabs": "^7.2.0",
  "react-native-gesture-handler": "~2.24.0",
  "react-native-safe-area-context": "~5.4.0",
  "react-native-screens": "~4.10.0"
}
```

---

*MediBook · React Native + Expo SDK 54 · Android*
