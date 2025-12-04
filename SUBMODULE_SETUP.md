# Strapi Page Builder React - Submodule Setup

## Summary

Successfully converted the `strapi-page-builder-react` package into a git submodule and configured the project to use the local development version.

## What Was Accomplished

### 1. Git Submodule Setup ✅

- **Created standalone repository**: Initialized `packages/strapi-page-builder-react` as an independent git repository
- **Remote repository**: Pushed to `git@github.com-personal:Hungmaix94/strapi-page-builder-react.git`
- **Added as submodule**: Linked to basecms project at `packages/strapi-page-builder-react`
- **Configuration**: Created `.gitmodules` with proper submodule configuration

### 2. Build Configuration ✅

Created the following configuration files:

- **`tsconfig.json`**: TypeScript compiler configuration
- **`tsup.config.ts`**: Build tool configuration for bundling
- **`.gitignore`**: Excludes `node_modules`, `dist`, and other generated files
- **`src/rsc.tsx`**: Server component entry point for React Server Components support

### 3. TypeScript Fixes ✅

Fixed all TypeScript compilation errors:

- Added proper type annotations for state variables
- Prefixed unused parameters with underscore (`_params`)
- Removed unused imports (React)
- Fixed duplicate object properties
- Added explicit type annotation for `DropZone` export

### 4. Package Build ✅

Successfully built the package with:
- CommonJS (`dist/*.js`)
- ESM (`dist/*.mjs`)
- TypeScript declarations (`dist/*.d.ts`, `dist/*.d.mts`)
- Source maps for debugging

### 5. Integration with Landingpage ✅

- Package reference already configured: `"@wecre8websites/strapi-page-builder-react": "file:../packages/strapi-page-builder-react"`
- Dependencies installed successfully
- Dev server runs without errors

## Current State

### Submodule Information
- **Path**: `packages/strapi-page-builder-react`
- **URL**: `git@github.com-personal:Hungmaix94/strapi-page-builder-react.git`
- **Latest commit**: `b74a815` - "Build package with TypeScript configuration and fix compilation errors"

### Basecms Repository
- **Latest commit**: `976010f` - "Update strapi-page-builder-react submodule to latest commit"

## Usage

### For Development

1. **Make changes** in `packages/strapi-page-builder-react/src/`
2. **Rebuild the package**:
   ```bash
   cd packages/strapi-page-builder-react
   pnpm build
   ```
3. **Test in landingpage**:
   ```bash
   cd landingpage
   npm run dev
   ```

### For Team Members

When cloning the basecms repository:

```bash
git clone git@github.com-personal:Hungmaix94/basecms.git
cd basecms
git submodule update --init --recursive
cd packages/strapi-page-builder-react
pnpm install
pnpm build
```

### Updating the Submodule

After making changes in the submodule:

```bash
# In packages/strapi-page-builder-react
git add .
git commit -m "Your changes"
git push origin master

# In basecms root
git add packages/strapi-page-builder-react
git commit -m "Update submodule reference"
git push origin master
```

## Build Scripts

- **`pnpm dev`**: Watch mode for development
- **`pnpm build`**: Production build
- **`pnpm check-types`**: Type checking without emitting files

## Package Exports

The package exports the following:

- **Main entry** (`@wecre8websites/strapi-page-builder-react`):
  - `Editor` - Page builder editor component
  - `Render` - Render component for displaying pages
  - `DropZone` - Drop zone component for nested components
  - `FieldLabel` - Field label component
  - `walkTree` - Utility for walking component tree
  - `processProps` - Utility for processing component props

- **RSC entry** (`@wecre8websites/strapi-page-builder-react/rsc`):
  - `Render` - Server-safe render component
  - `cn` - Utility for class names

- **Styles** (`@wecre8websites/strapi-page-builder-react/editor.css`):
  - Editor styles

## Next Steps

1. Continue developing features in the submodule
2. Keep the submodule reference updated in basecms
3. Consider setting up automated builds/tests
4. Document component APIs and usage examples
