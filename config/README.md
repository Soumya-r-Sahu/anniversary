# Configuration Files Directory 📁

This directory contains all JSON configuration files for the Anniversary Website project.

## Files Overview:

### 🔧 **eslint.json**
- **Purpose**: Code quality and error checking rules
- **Usage**: Automatically used by VS Code and npm scripts
- **Commands**: `npm run lint`, `npm run lint:fix`

### 💅 **prettier.json** 
- **Purpose**: Code formatting and style rules
- **Usage**: Automatically formats code in VS Code
- **Commands**: `npm run format`

## Benefits of This Organization:

✅ **Clean Root Directory**: Less clutter in main project folder
✅ **Easy to Find**: All config files in one place
✅ **Professional Structure**: Industry standard organization
✅ **Version Control**: Easy to manage configuration changes

## Integration:

- **package.json**: Updated scripts point to these config files
- **VS Code**: Automatically detects configuration files
- **Build Process**: Vite and other tools reference these configurations

## Usage Notes:

- **package.json** and **package-lock.json** remain in root (required by npm)
- **manifest.json** remains in root (required by browsers for PWA)
- **vite.config.js** remains in root (required by Vite)

Your anniversary website now has a professional, organized configuration structure! 💕
