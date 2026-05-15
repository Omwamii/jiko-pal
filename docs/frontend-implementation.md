# Chapter 5: Frontend System Implementation

## 5.1 Frontend Stack, Project Structure, and Design Approach

The JIkopal mobile frontend is implemented as a React Native application built with **Expo** and **expo-router** (file‑based routing). The implementation is organized into:

- `app/`: application screens/routes (Expo Router).
- `components/`: reusable UI building blocks (cards, buttons, list items, summaries).
- `lib/`: API/service layer (Axios clients + per-resource modules).
- `hooks/`: React Query hooks wrapping the service layer for data fetching/mutations.
- `providers/`: application providers (authentication state and React Query client).
- `types/`: shared TypeScript types matching backend response shapes.
- `constants/`: shared constants (colors and seeded local data where applicable).

The UI is implemented using React Native primitives (`View`, `Text`, `ScrollView`, etc.) with a consistent color system (primary indigo) and iconography via `@expo/vector-icons` (MaterialCommunityIcons). Most screens follow a pattern of:

1. Load required data using React Query hooks.
2. Display loading/empty states.
3. Render the primary content and actions.
4. Trigger backend mutations through dedicated `lib/*` service functions (wrapped by `hooks/*` mutations).

## 5.2 Navigation and Routing (expo-router)

Routing is handled by Expo Router through the `app/` directory:

- Global navigation container and route registration live in `app/_layout.tsx`.
- Tab navigation lives in `app/(tabs)/_layout.tsx`.
- Feature flows use nested folders (e.g., `app/add-monitor/*`, `app/my-circle/*`, `app/invite-users/*`).

The root entry (`app/index.tsx`) implements onboarding state using `AsyncStorage`. If the user has already completed onboarding, they are redirected directly to `app/login.tsx`; otherwise they are sent to the onboarding carousel in `app/welcome.tsx`.

Authentication routing is role-aware: after login, the user is routed to either:

- Client experience: tabbed dashboard `/(tabs)`
- Vendor experience: vendor dashboard `/vendor-dashboard`

## 5.3 State Management and Data Synchronization

### 5.3.1 Server State with React Query

Server state is handled using **@tanstack/react-query**. The global query client is configured in `providers/QueryProvider.tsx` with:

- A default `staleTime` (1 minute) to avoid excessive refetching.
- Limited retries (`retry: 1`) to prevent repeated failures on unstable networks.
- `refetchOnWindowFocus: false` to avoid aggressive refetching when the app resumes.

The React Query layer is exposed through `hooks/queries.ts`, which provides:

- Queries such as `useDevices`, `useDeviceReadings`, `useLatestDeviceReading`, `useVendors`, `useNotifications`, `useRefillRequests`, and more.
- Mutations such as `useUpdateDevice`, `useChangeActivityMode`, `useCreateRefillRequest`, `useMarkNotificationRead`, etc.
- Cache invalidation after successful writes to keep UI state consistent without manual refresh.

### 5.3.2 Authentication State with Context

Client-side auth state is managed through `providers/AuthProvider.tsx`:

- JWT tokens (access/refresh) are persisted in `AsyncStorage`.
- On app start, tokens are loaded and the user profile is fetched using `authService.getCurrentUser()`.
- Profile hydration is role-based: client profiles come from `clientService.getMyClient()` and vendor profiles from `/vendors/me/` (or vendor list fallback where applicable).
- `logout()` clears local storage and resets in-memory token state, then routes the user back to `/login`.

## 5.4 API Layer (Axios + Service Modules)

Network communication with the backend REST API is implemented in `lib/api.ts` using **Axios**:

- Base URL is read from `EXPO_PUBLIC_API_URL` (fallback `http://localhost:8000/api`).
- `api` includes an interceptor that injects `Authorization: Bearer <access>` when available.
- A refresh-token flow retries requests once on `401` by calling `/auth/refresh/` and replaying the original request.
- `publicApi` is provided for endpoints that must not send auth headers (e.g., registration).

On top of the Axios client, the frontend defines resource-specific service modules in `lib/`:

- `lib/auth.ts`: login, registration, logout, current user, profile updates, password change.
- `lib/device.ts`: devices CRUD, readings history, latest reading, stats, activity-mode change, disconnect.
- `lib/vendor.ts`: vendor discovery, subscriptions, vendor availability, catalogue CRUD (multipart image upload).
- `lib/refill.ts`: refill request creation and status transitions; reviews.
- `lib/circle.ts`: monitoring circles creation, join/leave, circle devices.
- `lib/notification.ts`: notification listing and read/unread operations.
- `lib/chat.ts`: REST chat endpoints + WebSocket URL construction (`EXPO_PUBLIC_WS_URL`).
- `lib/userSettings.ts`: user notification preferences and account deletion request.
- `lib/invites.ts`: invite creation/acceptance by code.

This separation keeps screens focused on UX while the service layer owns endpoint paths, payload formats, and response normalization.

## 5.5 Core Client Modules and Features

### 5.5.1 Onboarding, Registration, and Login

- **Onboarding** (`app/welcome.tsx`) implements a paged carousel and stores completion state (`hasSeenOnboarding`) in `AsyncStorage`.
- **Account type selection** (`app/account-type.tsx`) routes the user to signup with `accountType=client|vendor`.
- **Login** (`app/login.tsx`) uses the auth provider’s `login()` method and handles special cases:
  - If an invite code exists in local storage (`pendingInviteCode`), it is accepted after successful login via `invitesApi.accept(code)`.
  - Navigation is role-based (client tabs vs vendor dashboard).

### 5.5.2 Client Dashboard and Monitor Overview

The client dashboard (`app/(tabs)/index.tsx`) is built around device telemetry and quick access actions:

- Devices are fetched via `useDevices()`.
- The primary cylinder is rendered as a “main card” with:
  - Percentage remaining (`IoTDevice.current_level`)
  - Battery level (`IoTDevice.battery_level`)
  - Last seen (`IoTDevice.last_seen`)
- Fine-grained telemetry summaries (temperature, tilt, RSSI quality, and “no liquid” alerts) are shown via the reusable component `components/MonitorReadingSummary.tsx`, which polls the latest reading every 30 seconds (`useLatestDeviceReading()`).
- “Request Refill” deep-links into the vendor browsing experience with the cylinder context passed as route params.

### 5.5.3 Device Provisioning and Attachment (Wi‑Fi SoftAP flow)

The “Add Monitor” wizard in `app/add-monitor/*` implements the IoT provisioning flow described in the device documentation:

1. **Select Device Type** (`app/add-monitor/index.tsx`): starts either a smart sensor onboarding path or attaches an existing cylinder to a circle.
2. **Provisioning**:
   - The app connects to the sensor’s SoftAP network (SSID prefix `LPG-Tank-`) using `lib/wifi.ts` where supported.
   - Wi‑Fi scanning and connection is implemented using `react-native-wifi-reborn`, with Android permission handling and SSID deduplication.
3. **Send home Wi‑Fi credentials** (`app/add-monitor/wifi-credentials.tsx`):
   - Credentials are posted to the sensor’s local endpoint (`http://192.168.4.1/credentials`).
   - On Android, the app forces routing through the sensor Wi‑Fi during provisioning and removes the override afterwards (`stopForcingWifiUsage()`).
4. **Attach to account** (`app/add-monitor/details.tsx`):
   - The sensor’s hardware ID is derived from the SSID/tankId and used as `device_id`.
   - The app updates the device record to set `owner_id`, optional `circle_id`, and optional `cylinder_size`.
   - Activity mode is configured via a dedicated call to `/devices/{id}/change_activity_mode/` if missing (defaulting to `medium`).
5. **Completion** (`app/add-monitor/success.tsx`): routes back to the dashboard or circle context depending on origin.

### 5.5.4 Monitoring Circles (Shared Visibility)

Circle workflows are implemented under `app/my-circle/*` and backed by `lib/circle.ts` and React Query hooks:

- Create and manage circles (`circleService.createCircle`, `circleService.updateCircle`).
- Join/leave flows using invite codes (`lib/invites.ts` + `app/invite/[code].tsx`).
- Add devices into a circle context via the add-monitor flow using route parameters (`circleId`, `circleName`, `members`).

### 5.5.5 Notifications (In‑App + Push Registration)

Notification history and read/unread state is implemented with:

- API integration in `lib/notification.ts` (list, unread count, mark read, mark all read).
- Query hooks (`useNotifications`, `useUnreadNotificationCount`, `useMarkNotificationRead`).

Push notification registration is initialized globally in `app/_layout.tsx`:

- When `useAuth().isAuthenticated` becomes true, the app:
  - Requests notification permission.
  - Retrieves an Expo push token (when supported by the runtime/build).
  - Registers the token with the backend via `POST /notifications/register-device/`.

This ensures the backend can deliver alerts to the correct devices while the in-app list remains the source of truth for notification history.

### 5.5.6 Vendor Marketplace, Catalogue, and Refill Workflows

Vendor workflows are implemented as a set of screens in `app/vendor-*.tsx` with API access via `lib/vendor.ts` and `lib/refill.ts`.

Key capabilities include:

- Vendor discovery and subscription management for clients.
- Vendor catalogue CRUD, including image upload via `multipart/form-data` (`vendorService.createCatalogueItem`, `vendorService.updateCatalogueItem`).
- Refill request creation and lifecycle transitions (pending → accepted → in_transit → completed/cancelled) via `refillRequestService`.
- Review submission after completion via `reviewService`.

Client order screens (`app/client-orders.tsx`, `app/client-order-detail.tsx`) and vendor order screens (`app/vendor-orders.tsx`, `app/vendor-order-detail.tsx`, `app/vendor-mark-delivered.tsx`) implement the two-sided view of the same refill lifecycle.

### 5.5.7 Real‑Time Messaging (REST + WebSockets)

Messaging is implemented through:

- REST endpoints in `lib/chat.ts` for conversation and message listing plus sending messages.
- WebSocket URL generation in `getWebSocketUrl(conversationId, token)` which converts `EXPO_PUBLIC_WS_URL` to `ws://` or `wss://`.

Screens such as `app/vendor-customer-chat.tsx` and `app/member-chat.tsx` integrate these endpoints to support real-time conversation UX while maintaining message persistence on the backend.

## 5.6 Error Handling, Offline Considerations, and UX Guardrails

The frontend includes multiple practical guardrails to improve reliability:

- Centralized token refresh and request replay on `401` (Axios interceptor).
- API response normalization for endpoints that may return different shapes (e.g., `deviceService.getDeviceReadings()` supports paginated and array responses).
- Explicit network checks for critical operations (e.g., device attachment in `app/add-monitor/details.tsx` uses `@react-native-community/netinfo`).
- Loading, empty, and disabled states across flows (e.g., dashboard spinner, disabled buttons during submit, “no monitors” empty state).

## 5.7 Environment Configuration

The application reads runtime configuration via Expo public environment variables:

- `EXPO_PUBLIC_API_URL`: base URL for the REST API (defaults to local development).
- `EXPO_PUBLIC_WS_URL`: base URL for WebSockets (converted to `ws://`/`wss://`).
- `EXPO_PUBLIC_PROJECT_ID`: Expo project id used for push token retrieval.

This keeps environment-specific details out of the code paths and enables clean switching between local development, staging, and production deployments.

