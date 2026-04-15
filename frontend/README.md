# ViaPool Frontend

Frontend for ViaPool, a ride-sharing and carpool web app built with React and Vite. The app supports both passenger and driver flows, including authentication, ride discovery, booking, payments, live tracking, messaging, notifications, reviews, profile management, and installable PWA support.

## Overview

ViaPool is designed to help users:

- Search and book shared rides
- Post and manage rides as a driver
- Track rides live with map-based updates
- Chat in real time between drivers and passengers
- Handle booking and payment status from the app
- Manage notifications, profile data, privacy preferences, and account settings

The frontend is optimized as a single-page application with route-based code splitting, responsive screens, and offline-aware PWA behavior.

## What Is Implemented So Far

### Authentication and account flows

- User registration with passenger or driver role selection
- Login flow with token-based session handling
- Forgot password and reset password flows
- Current-user fetch and persisted local session state
- Forbidden and not-found screens

### Passenger experience

- Ride search with filters and route/date inputs
- Ride detail page with driver profile preview, vehicle info, and reviews
- Booking flow with pickup point and passenger note support
- Payment page and payment status screen
- Booking history and booking detail pages
- Live ride tracking
- Passenger-to-driver in-app chat
- Leave review flow after ride completion

### Driver experience

- Driver onboarding and profile setup
- Driver dashboard
- Post a ride flow
- Ride management with passenger list and pickup actions
- Live ride view for active trips
- Driver-to-passenger in-app chat
- Earnings history view
- Vehicle management
- My rides listing

### Shared platform features

- Unified app shell with passenger/driver role switching
- Profile and public user profile pages
- Notifications list and unread count support
- Settings and privacy preferences
- Offline notice for reduced-connectivity scenarios
- Reusable UI components for buttons, badges, dialogs, and notices

### Realtime and map-based features

- Socket.IO integration for:
  - notifications
  - chat
  - typing indicators
  - live location updates
  - ride room / user room events
- Leaflet and React Leaflet integration for trip maps
- Route, distance, and autocomplete lookups through backend map endpoints
- SOS trigger calls during live ride flows

### PWA support

- Installable Progressive Web App setup using `vite-plugin-pwa`
- Auto-updating service worker registration
- Offline-ready event handling
- Asset caching for scripts, styles, media, and ride-related API responses
- App manifest with icons for install surfaces

## Tech Stack

- React 19
- React Router 7
- Vite 7
- Tailwind CSS 4
- Framer Motion
- Leaflet + React Leaflet
- Socket.IO Client
- Lucide React
- ESLint
- Vite PWA Plugin

## App Routes

### Public and auth routes

- `/`
- `/register`
- `/login`
- `/forgot-password`
- `/reset-password/:token`
- `/403`
- `*`

### Shared user routes

- `/profile`
- `/notifications`
- `/u/:userId`
- `/settings`

### Driver routes

- `/driver/setup`
- `/driver/dashboard`
- `/driver/rides/create`
- `/driver/rides`
- `/driver/rides/:rideId`
- `/driver/rides/:rideId/live`
- `/driver/rides/:rideId/chat/:passengerId`
- `/driver/earnings`
- `/driver/vehicles`

### Passenger routes

- `/search`
- `/rides/:rideId`
- `/rides/:rideId/book`
- `/bookings/:bookingId/payment`
- `/bookings/:bookingId/payment/status`
- `/passenger/bookings`
- `/passenger/bookings/:bookingId`
- `/rides/:rideId/track`
- `/rides/:rideId/chat/driver/:driverId`
- `/rides/:rideId/review`

## Project Structure

```text
frontend/
|-- public/                 # PWA icons and static assets
|-- src/
|   |-- components/         # Shared UI, layout, map, offline, and home sections
|   |-- hooks/              # Custom hooks such as PWA install handling
|   |-- lib/                # API client, logger, animation helpers
|   |-- pages/              # Passenger, driver, auth, and settings pages
|   |-- pwa/                # Service worker registration
|   |-- App.jsx             # Main route configuration
|   |-- main.jsx            # App bootstrap
|   |-- index.css           # Global styles
|-- .env.example
|-- eslint.config.js
|-- vite.config.js
|-- package.json
```

## Environment Variables

Create a `.env` file in `frontend/` and configure:

```env
VITE_API_URL=https://viapool.onrender.com
```

This value is used by the shared API client in `src/lib/api.js`.

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm
- A running ViaPool backend with the expected `/api/v1/...` endpoints

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Lint the codebase

```bash
npm run lint
```

## Backend Dependencies

The frontend expects backend support for:

- authentication and profile APIs
- rides, bookings, vehicles, reviews, notifications, earnings, and settings APIs
- map helpers such as autocomplete, route, and distance endpoints
- payment endpoints
- Socket.IO events for chat, tracking, and notifications

If the backend is unavailable, screens that depend on live data will not function correctly.

## Architecture Notes

- Routing uses `React.lazy` and `Suspense` for page-level code splitting
- Authentication token is stored in local storage as `via-token`
- User and selected role are persisted locally as `via-user` and `via-role`
- Shared `api.js` automatically injects the bearer token for authenticated requests
- `AppShell` coordinates role-aware navigation, unread notifications, and socket setup
- `registerSW.js` wires service worker updates into app-level browser events

## Current Status

The frontend is well beyond initial scaffolding and already includes the primary user flows for both passengers and drivers. It currently behaves like a feature-complete application shell connected to a backend API, with production-oriented additions such as PWA support, lazy-loaded routes, realtime sockets, and offline messaging.

Areas that may still evolve depending on backend and product needs:

- final deployment and environment hardening
- broader test coverage
- CI/CD automation
- additional empty-state, error-state, and edge-case polish
- deeper admin or moderation tooling if planned later

## Available Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - create production build
- `npm run preview` - preview production build locally
- `npm run lint` - run ESLint

## Notes

- The frontend uses a generated `dist/` directory for production output
- PWA assets and manifest configuration are defined in `vite.config.js`
- Offline mode still limits live tracking, chat, and payment-related functionality

## License

This project is licensed under the MIT License.
