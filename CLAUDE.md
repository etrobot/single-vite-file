# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a single-file static blog built with React and Vite. The entire application, including all blog content, compiles into a single standalone HTML file that can be deployed anywhere without dependencies.

## Key Commands

- `npm run dev` - Start development server
- `npm run build` - Build single-file production version (outputs to `dist/index.html`)
- `npm run build:print` - Build print-optimized version for PDF/printer output (uses `vite.print.config.js`; outputs to `dist-print/print.html` from `print.html` input; inlines all assets like the main build but targets printable layout)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Architecture

### Content Management System
Blog posts are stored as Markdown files in the `content/` directory with YAML frontmatter:
```yaml
---
title: "Post Title"
date: "2025-01-21"
id: 1
category: "Category Name"
subcategory: "Optional Subcategory"
---
```

### Build System Architecture
The project uses a custom Vite plugin system to achieve single-file output:

1. **`vite-plugin-posts.js`** - Custom plugin that creates a virtual module `virtual:posts`
2. **`src/loadPosts.js`** - Node.js utility that reads Markdown files at build time using `gray-matter`
3. **`vite-plugin-singlefile`** - Third-party plugin that inlines all assets into a single HTML file

The virtual module approach ensures all content is embedded during build without generating separate files that would break the single-file constraint.

### Dual Build Configurations
- **Main Build** (`vite.config.js`): Standard single-file output for web deployment.
- **Print Build** (`vite.print.config.js`): Separate config inheriting the same plugins but with custom input (`print.html`) for print-friendly rendering (e.g., full-page article views without navigation). Outputs to `dist-print/` while maintaining single-file inlining.

### Component Structure
- **`App.jsx`** - Main application with blog list/detail view state management and layout
- **`Navigation.jsx`** - Collapsible navigation sidebar with hierarchical category structure and theme toggle
- **`ThemeContext.jsx`** - React Context for dark/light theme state management with localStorage persistence
- **`ThemeToggle.jsx`** - Theme switching button component
- Content is imported via `import { blogPosts } from 'virtual:posts'`

### Theme System
The application supports dark/light theme switching with:
- **React Context** for theme state management across components
- **localStorage persistence** - saves user theme preference and detects system preference on first visit
- **Tailwind CSS dark mode** - uses `class` strategy with `dark:` variants throughout
- **Theme toggle button** - located in sidebar footer, shows sun/moon icons

### Styling Architecture
- **Tailwind CSS** - Primary styling framework with dark mode support enabled
- **Custom CSS components** - Markdown content styling in `App.css` using `@layer components`
- **Teal color scheme** - Primary brand color changed from indigo to teal
- **Responsive design** - Sidebar collapses on mobile, maintains fixed layout on desktop

### Plugin Interaction
Critical: The custom `generatePostsPlugin()` must run BEFORE `viteSingleFile()` in the plugins array. The custom plugin only implements virtual module resolution - it does NOT use `generateBundle()` or `emitFile()` as this would create separate files that conflict with single-file output.

## Content Workflow

1. Add new `.md` files to `content/` directory
2. Include required frontmatter (title, date, id, category)
3. Run `npm run build` - the build system automatically discovers and includes all Markdown files
4. Deploy the single `dist/index.html` file

## Navigation System
The navigation automatically organizes posts by:
- **Category** (first-level folders)
- **Subcategory** (second-level folders, optional)
- Posts without subcategory appear directly under category
- Navigation state (collapsed/expanded) is maintained in React state
- **Collapsible sidebar** - toggle button collapses sidebar to icon-only view
- **Selected post highlighting** - active post shown with teal background

## Development Notes
- **Tailwind config** - `darkMode: 'class'` enables class-based dark mode
- **Theme Context** - wrap App in `ThemeProvider` in `main.jsx`
- **CSS organization** - Keep Tailwind imports in `App.css`, minimal reset styles in `index.css`
- **Virtual modules** - Posts are loaded at build time, not runtime, via custom Vite plugin