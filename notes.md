development build to generate apk with expo server support. (not a standalone app)

```
eas build --platform android --profile development
```

Expo Modules (like expo-notifications, expo-modules-core, etc.) must use compatible versions. Always use:

```
npx expo install <package>
```

Production build (builds an aab file for play store)

```
eas build --platform android --profile production
```

build only takes the committed changes, not the local uncommited changes.
So always commit before building.

Build preview (builds an apk)
```
eas build --platform android --profile preview
```

Expo doctor
```
npx expo-doctor
```
