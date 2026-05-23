# MediBook — Appointment Booking App

A scalable appointment scheduling mobile application built with React Native and Expo. Features structured booking logic, clean architecture, and relational data modeling concepts.

## Tech Stack

**Framework:** React Native, Expo SDK 54

**Navigation:** React Navigation v7

**Storage:** AsyncStorage

**Deployment:** Expo Go (Android)

## Features

- User registration, login, and logout with session persistence
- Provider listing with search and category filter
- Full provider profile with stats and available slots
- 14-day date picker with slot selection and booking summary
- Appointment management — upcoming and cancelled tabs
- Cancel appointment with confirmation dialog
- Slot deduplication — same slot can't be booked twice for the same provider

## Project Structure

```
AppointmentApp/
├── App.js
├── app.json
└── src/
    ├── components/
    │   ├── ProviderCard.js
    │   └── AppointmentCard.js
    ├── context/
    │   ├── AuthContext.js
    │   └── AppContext.js
    ├── data/
    │   └── mockProviders.js
    ├── navigation/
    │   └── AppNavigator.js
    ├── screens/
    │   ├── LoginScreen.js
    │   ├── RegisterScreen.js
    │   ├── HomeScreen.js
    │   ├── ProviderDetailsScreen.js
    │   ├── BookingScreen.js
    │   └── AppointmentsScreen.js
    └── utils/
        └── storage.js
```

## Local Setup

**Prerequisites:** Node.js 18+, Expo Go (SDK 54) on Android device

```bash
git clone https://github.com/karthiknani229-art/appointment-booking-mobile-app.git
cd AppointmentApp
npm install
npx expo start
```

Scan the QR code with Expo Go on Android. Press `a` to open on a connected emulator.

## Demo Flow

1. Register a new account
2. Browse providers using search or category chips
3. Select a provider and view details
4. Pick a date from the 14-day scroller
5. Select an available time slot
6. Confirm booking and view summary
7. Go to My Bookings to view upcoming appointments
8. Cancel an appointment and check the Cancelled tab

## APK Build

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

APK download link appears in your Expo dashboard after ~5 minutes.

## Architecture Notes

**Context API over Redux** — two contexts handle clean separation: `AuthContext` for identity/session and `AppContext` for appointments. No Redux boilerplate needed at this scope.

**Slot deduplication** — a slot is locked per `(providerId + slot + date)` tuple. Booked slots render as disabled with strikethrough.

**AsyncStorage schema:**
```
APPT_USER         → active session user
APPT_USERS_DB     → user registry keyed by email
APPT_APPOINTMENTS → appointments keyed by userId
```

## Assumptions

- Provider data is static mock data — no backend API
- Slot availability is per-user, not globally shared
- Authentication is local-only via AsyncStorage
- Targets Android — code is iOS-compatible but not explicitly tested

## Future Improvements

- Real backend with Node.js, Express, and MongoDB
- Real-time slot locking via WebSockets
- Push notifications for appointment reminders
- Reschedule flow without cancel and re-book
- Razorpay payment gateway integration
- OTP-based phone authentication

## Author

Penta Karthik — [GitHub](https://github.com/karthiknani229-art)
