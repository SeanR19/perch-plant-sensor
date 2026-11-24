# Perch

Companion app for the Perch plant sensor. Expo (SDK 57) + Expo Router, with
Apple's Liquid Glass via `expo-glass-effect` (falls back to a blur below iOS 26).

No backend yet — screens read from `src/lib/mock-plants.ts` until the sensor
hardware is working.

## Running it

This uses a **development build** (not Expo Go). Builds happen in the cloud on
EAS, so no local Xcode is needed.

One-time setup:

```bash
npm install
npx eas-cli@latest init                 # links the project to the Expo account
npx eas-cli@latest device:create        # register your iPhone (scan the QR on the phone)
npm run build:ios                       # cloud build → install link/QR for your phone
```

`npm run build:ios:sim` makes a simulator build instead.

Day to day (only rebuild when you add a package with native code):

```bash
npx expo start      # open the Perch dev app on the phone, it connects to this
```

## Checks

```bash
npm run typecheck
npm run lint
npx expo-doctor
```

## Layout

- `src/app/` — screens (Expo Router; every file is a route)
- `src/components/` — `GlassCard` (Liquid Glass panel), `PlantCard`
- `src/constants/theme.ts` — colour tokens (placeholders until the Figma tokens land)
- `src/lib/mock-plants.ts` — fake sensor data
