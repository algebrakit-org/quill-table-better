# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **quill-table-better**, a TypeScript module that enhances table functionality for Quill.js v2.0+. It provides advanced table features including multi-cell operations, table formatting, language support, and comprehensive table manipulation tools.

## Development Commands

### Build & Development
- `npm run dev` - Start webpack dev server for development
- `npm run build` - Build production bundle (outputs to `dist/`)

### Important Notes
- No test suite is currently configured (`npm test` returns an error)
- The build process uses webpack with TypeScript compilation
- Output includes both JS bundle and CSS styles

## Architecture Overview

### Core Structure
- **Main entry**: `src/quill-table-better.ts` - The main Table class that extends Quill modules
- **Formats**: `src/formats/` - Quill format definitions for table elements (TableCell, TableRow, etc.)
- **UI Components**: `src/ui/` - Interactive table components (menus, toolbars, selections)
- **Modules**: `src/modules/` - Quill module extensions (clipboard, toolbar)
- **Utilities**: `src/utils/` - Helper functions for table operations
- **Languages**: `src/language/` - Internationalization support

### Key Components

#### Table Class (`src/quill-table-better.ts`)
The main module class that provides:
- Table insertion and deletion
- Cell selection and manipulation
- Keyboard bindings and event handling
- Integration with Quill's module system

#### Formats (`src/formats/`)
- `table.ts` - Core table format definitions (TableContainer, TableRow, TableCell, etc.)
- `header.ts` - Table header formatting
- `list.ts` - List formatting within table cells

#### UI Components (`src/ui/`)
- `table-menus.ts` - Context menus for table operations
- `toolbar-table.ts` - Toolbar integration for table insertion
- `cell-selection.ts` - Multi-cell selection functionality
- `operate-line.ts` - Visual guides for table operations
- `table-properties-form.ts` - Table styling and properties UI

### Important Implementation Details

#### Quill Integration
- Extends Quill's Module system
- Registers custom formats and blots
- Provides keyboard bindings via `keyboardBindings` static property
- Integrates with Quill's clipboard system for table paste operations

#### Multi-language Support
- Language files in `src/language/` directory
- Supports 11 languages (en_US, zh_CN, fr_FR, etc.)
- Dynamic language switching capability

#### Table Operations
- Multi-cell selection and formatting
- Row/column insertion and deletion
- Cell merging and splitting
- Table-wide operations (delete, copy, properties)

## Configuration

### Module Registration
```javascript
Quill.register({
  'modules/table-better': QuillTableBetter
}, true);
```

### Key Configuration Options
- `language` - Language code or custom language object
- `menus` - Array of enabled menu items
- `toolbarTable` - Enable/disable toolbar table button
- `toolbarButtons` - Configure which buttons are available when table is focused

### Keyboard Bindings
Access via `QuillTableBetter.keyboardBindings` for integration with Quill's keyboard module.

## Development Workflow

1. **Code Organization**: Follow the existing module structure with clear separation between formats, UI, and utilities
2. **TypeScript**: All source files use TypeScript with ES6 module syntax
3. **Styling**: SCSS files are processed through webpack and extracted to separate CSS
4. **Bundle**: Webpack configuration supports both development and production builds
5. **Language Support**: When adding new features, consider internationalization from the start

## Important Notes

- **Quill Version**: Requires Quill.js >= v2.0.0
- **Bundle Output**: Main bundle is `dist/quill-table-better.js` with accompanying CSS
- **Table Formats**: Custom table formats replace Quill's default table module
- **Event Handling**: Extensive mouse and keyboard event handling for table interactions
- **Clipboard**: Custom clipboard matchers for proper table paste operations
- **Shadow DOM Support**: Compatible with Shadow DOM environments for use in Web Components and micro-frontends

## Shadow DOM Compatibility

This module includes comprehensive Shadow DOM support to work seamlessly within Shadow DOM boundaries:

### Features
- **Context-aware DOM operations**: All DOM manipulations respect Shadow DOM boundaries
- **Scoped event handling**: Event listeners are properly attached to Shadow DOM roots instead of global document
- **Element creation**: Uses appropriate document context for creating elements within Shadow DOM
- **Selection handling**: Works with Shadow DOM selection APIs
- **Viewport detection**: Correctly calculates dimensions within Shadow DOM containers

### Implementation Details
The Shadow DOM support is implemented through utilities in `src/utils/shadow-dom.ts` that provide:
- `createElement()` - Context-aware element creation
- `addEventListener()` - Shadow DOM-scoped event handling
- `getSelection()` - Shadow DOM-aware selection API
- `querySelector()` - Scoped DOM queries
- `getViewportDimensions()` - Context-aware viewport sizing

All UI components (table menus, cell selection, operate line, properties form) have been updated to use these utilities instead of global document references.