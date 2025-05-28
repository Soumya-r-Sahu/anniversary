# Flutter Anniversary App - Deployment Guide

## Overview
This guide covers deploying the Flutter Anniversary App to both web (GitHub Pages) and Android platforms.

## Prerequisites
- Flutter SDK 3.19.6 or later
- Chrome browser (for web development)
- Android SDK (for Android builds)
- Git and GitHub account

## Web Deployment (GitHub Pages)

### Manual Deployment
1. Navigate to the Flutter project directory:
   ```bash
   cd anniversary_flutter
   ```

2. Build the web app:
   ```bash
   flutter build web --release --web-renderer html --base-href "/anniversary-website/"
   ```

3. Copy the build output to the root directory:
   ```bash
   cp -r build/web/* ../docs/
   ```

4. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Deploy Flutter web app"
   git push origin Test
   ```

### Automated Deployment
The GitHub Actions workflow (`.github/workflows/flutter-deploy.yml`) automatically:
- Builds the Flutter web app on every push to main
- Deploys to GitHub Pages
- Sets up proper base href for subdirectory hosting

## Android Deployment

### Debug Build
```bash
cd anniversary_flutter
flutter build apk --debug
```

### Release Build
```bash
cd anniversary_flutter
flutter build apk --release
```

### App Bundle (for Play Store)
```bash
cd anniversary_flutter
flutter build appbundle --release
```

### Installation
```bash
adb install build/app/outputs/flutter-apk/app-release.apk
```

## Build Outputs

### Web
- `build/web/` - Contains all web assets
- Deploy contents to any static web server
- Compatible with GitHub Pages, Netlify, Vercel

### Android
- `build/app/outputs/flutter-apk/app-release.apk` - Direct install APK
- `build/app/outputs/bundle/release/app-release.aab` - Play Store bundle

## Environment Setup

### Flutter Dependencies
All required dependencies are listed in `pubspec.yaml`:
- UI: flutter_animate, lottie, flutter_staggered_grid_view
- Audio: audioplayers, just_audio
- Storage: hive, shared_preferences
- State: riverpod
- Effects: confetti

### Asset Management
Assets are organized in:
- `assets/images/` - Photos and images
- `assets/music/` - Audio files
- `assets/animations/` - Lottie animations
- `assets/fonts/` - Custom fonts

## Performance Optimization

### Web
- Uses HTML renderer for better compatibility
- Optimized asset loading
- Service worker for caching
- Responsive design for all screen sizes

### Android
- Optimized APK size
- Efficient memory usage
- Smooth animations
- Background audio support

## Features Implemented

### Pages
1. **Home Page** - Welcome screen with animated hearts
2. **Countdown Page** - Real-time countdown to anniversary
3. **Love Story Page** - Timeline of relationship milestones
4. **Photo Gallery Page** - Interactive photo browser with categories
5. **Anniversary Page** - Special anniversary celebration
6. **Celebration Page** - Interactive celebration with effects

### Components
1. **Floating Bubbles** - Animated background effects
2. **Music Player** - Cross-platform audio playback
3. **Bubble Animation** - Reusable animation wrapper
4. **Theme System** - Consistent pink/romantic theme

### Services
1. **Audio Service** - Platform-aware audio management
2. **Animation Service** - Performance-optimized animations
3. **Storage Service** - Dual storage (Hive + SharedPreferences)

## Troubleshooting

### Common Issues
1. **Build fails**: Run `flutter clean && flutter pub get`
2. **Web assets not loading**: Check base href configuration
3. **Android permissions**: Update android/app/src/main/AndroidManifest.xml
4. **Audio not playing**: Verify audio file formats and permissions

### Debug Commands
```bash
flutter doctor -v          # Check Flutter installation
flutter analyze           # Static code analysis
flutter test              # Run unit tests
flutter build web --verbose # Verbose web build
```

## Next Steps

1. **Testing**: Test on various devices and browsers
2. **Assets**: Replace placeholder images with actual photos
3. **Audio**: Add real music files
4. **Customization**: Update dates, names, and personal content
5. **Deployment**: Set up automated CI/CD pipeline

## Repository Structure
```
anniversary_flutter/
├── lib/
│   ├── main.dart                 # App entry point
│   ├── app.dart                  # Main app widget
│   ├── core/services/            # Core services
│   ├── shared/                   # Shared components
│   └── features/                 # Feature pages
├── assets/                       # App assets
├── web/                         # Web configuration
├── android/                     # Android configuration
└── pubspec.yaml                 # Dependencies
```

This Flutter app provides a complete anniversary celebration experience with beautiful animations, music, photo galleries, and interactive features that work seamlessly on both web and mobile platforms.
