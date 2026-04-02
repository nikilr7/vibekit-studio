# VibeKit Studio - Complete Theme System Documentation

## Overview

The Theme System is a dynamic, scalable solution that controls the entire UI using CSS variables (design tokens). It ensures preview and public pages match exactly while providing a seamless theme selection experience.

## Architecture

### Core Files

1. **`src/theme/themes.ts`** - Theme definitions and core functions
   - `THEMES` object with 6 pre-built themes
   - `Theme` interface defining theme structure
   - `applyTheme()` - applies theme to document
   - `getThemeCSS()` - generates CSS string
   - `getThemePreviewCSS()` - generates inline styles

2. **`src/theme/utils.ts`** - Theme utilities and helpers
   - `getTheme()` - get theme with fallback
   - `isValidTheme()` - validate theme name
   - `getAvailableThemes()` - get all themes for UI
   - `useTheme()` - React hook for theme management
   - `getThemePreviewStyles()` - get inline styles

3. **`src/theme/theme.css`** - Global CSS variables and animations
   - Design tokens (colors, typography, UI)
   - Component styles using CSS variables
   - Micro-interactions and animations
   - Responsive design

4. **`src/components/ThemeSelector.tsx`** - Theme selection UI
   - Card-based theme selector
   - Visual previews
   - Compact dropdown option

5. **`src/components/LivePreview.tsx`** - Updated preview component
   - Uses CSS variables for styling
   - Consistent with public page

## Theme Structure

Each theme defines:

```typescript
{
  name: ThemeName;           // unique identifier
  label: string;             // display name
  description: string;       // short description
  colors: {
    primary: string;         // main color
    secondary: string;       // secondary color
    accent: string;          // accent/highlight color
    background: string;      // page background
    surface: string;         // card/surface background
    text: string;            // primary text color
    textLight: string;       // secondary text color
    border: string;          // border color
  };
  typography: {
    fontFamily: string;      // font stack
    headingSize: string;     // h1 size
    bodySize: string;        // body text size
    fontWeight: string;      // default weight
  };
  ui: {
    borderRadius: string;    // border radius
    spacing: string;         // base spacing unit
    buttonStyle: "solid" | "outline" | "glow";
  };
}
```

## Available Themes

### 1. Minimal
- **Description**: Clean and simple
- **Colors**: Black text on white background
- **Typography**: Inter sans-serif, 500 weight
- **UI**: 8px radius, solid buttons

### 2. Dark Neon
- **Description**: Bold and futuristic
- **Colors**: Neon cyan accent on dark background
- **Typography**: Courier New monospace, 600 weight
- **UI**: 4px radius, glow buttons

### 3. Pastel
- **Description**: Soft and friendly
- **Colors**: Soft pink tones
- **Typography**: Poppins sans-serif, 400 weight
- **UI**: 20px radius, solid buttons

### 4. Luxury
- **Description**: Elegant and premium
- **Colors**: Gold accents on cream background
- **Typography**: Cormorant Garamond serif, 400 weight
- **UI**: 2px radius, outline buttons

### 5. Retro
- **Description**: Vintage vibes
- **Colors**: Bright orange and yellow
- **Typography**: Courier Prime monospace, 700 weight
- **UI**: 0px radius, solid buttons

### 6. Brutal
- **Description**: Bold and raw
- **Colors**: High contrast black and red
- **Typography**: IBM Plex Mono monospace, 700 weight
- **UI**: 0px radius, solid buttons

## CSS Variables (Design Tokens)

All themes use CSS variables for dynamic styling:

```css
:root {
  /* Colors */
  --color-primary: #000000;
  --color-secondary: #ffffff;
  --color-accent: #aa3bff;
  --color-background: #ffffff;
  --color-surface: #f9f9f9;
  --color-text: #000000;
  --color-text-light: #666666;
  --color-border: #e0e0e0;

  /* Typography */
  --font-family: 'Inter', sans-serif;
  --heading-size: 2.5rem;
  --body-size: 1rem;
  --font-weight: 500;

  /* UI */
  --border-radius: 8px;
  --spacing: 16px;
  --button-style: solid;

  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;
}
```

## Usage

### In Page Editor

```tsx
import { ThemeSelector } from "../components/ThemeSelector";
import type { ThemeName } from "../theme/themes";

function PageEditor() {
  const [theme, setTheme] = useState<ThemeName>("minimal");

  return (
    <ThemeSelector
      value={theme}
      onChange={(newTheme) => setTheme(newTheme)}
    />
  );
}
```

### In Components

```tsx
import { THEMES, applyTheme } from "../theme/themes";

// Apply theme to document
useEffect(() => {
  applyTheme(THEMES[theme]);
}, [theme]);

// Use in styles
<Box
  style={{
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
  }}
>
  Content
</Box>
```

### Using CSS Variables

```css
.hero {
  background-color: var(--color-primary);
  color: var(--color-secondary);
  font-family: var(--font-family);
  border-radius: var(--border-radius);
  padding: calc(var(--spacing) * 4);
}

.btn {
  background-color: var(--color-accent);
  border-radius: var(--border-radius);
  transition: all var(--transition-base);
}
```

## Micro-Interactions

### Button Hover Effects

```css
.btn-solid:hover {
  opacity: 0.85;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.btn-glow:hover {
  box-shadow: 0 0 30px rgba(0, 217, 255, 0.8);
  transform: translateY(-2px);
}
```

### Section Animations

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}
```

### Smooth Transitions

All elements transition smoothly when theme changes:

```css
* {
  transition: background-color var(--transition-base),
    color var(--transition-base),
    border-color var(--transition-base);
}
```

## Persistence

Themes are saved in the database with each page:

```typescript
// Save theme
await pagesAPI.update(pageId, {
  theme: "dark",
  content: {...},
});

// Load theme
const page = await pagesAPI.get(pageId);
applyTheme(THEMES[page.theme]);
```

## Fallback Handling

Invalid or missing themes automatically fallback to "minimal":

```typescript
export function getTheme(themeName?: string | null): Theme {
  if (!themeName || typeof themeName !== "string") {
    return THEMES.minimal;
  }
  const theme = THEMES[themeName as ThemeName];
  return theme || THEMES.minimal;
}
```

## Consistency Guarantee

### Preview and Public Page Match

Both use the same:
- `applyTheme()` function
- `THEMES` object
- CSS variables
- `LivePreview` component

### No Duplicate Logic

- Single source of truth: `src/theme/themes.ts`
- Shared utilities: `src/theme/utils.ts`
- Shared CSS: `src/theme/theme.css`

## Responsive Design

Themes scale responsively:

```css
@media (max-width: 768px) {
  :root {
    --heading-size: calc(var(--heading-size) * 0.8);
    --body-size: calc(var(--body-size) * 0.95);
    --spacing: 12px;
  }
}

@media (max-width: 480px) {
  :root {
    --heading-size: calc(var(--heading-size) * 0.6);
    --body-size: 0.9rem;
    --spacing: 10px;
  }
}
```

## Adding Custom Themes

To add a new theme:

1. Add to `ThemeName` type:
```typescript
export type ThemeName = "minimal" | "dark" | "pastel" | "luxury" | "retro" | "brutal" | "custom";
```

2. Add theme definition to `THEMES`:
```typescript
export const THEMES: Record<ThemeName, Theme> = {
  // ... existing themes
  custom: {
    name: "custom",
    label: "Custom",
    description: "Your custom theme",
    colors: { /* ... */ },
    typography: { /* ... */ },
    ui: { /* ... */ },
  },
};
```

3. Theme automatically appears in selector

## Performance Optimization

- CSS variables update instantly (no re-renders)
- Smooth transitions use GPU acceleration
- Animations use `transform` and `opacity` for performance
- Debounced theme changes prevent excessive updates

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS variables supported in all modern browsers
- Fallback colors for older browsers (optional)

## Testing

### Test Theme Application

```typescript
import { applyTheme, THEMES } from "../theme/themes";

test("applies theme correctly", () => {
  applyTheme(THEMES.dark);
  const root = document.documentElement;
  expect(root.style.getPropertyValue("--color-primary")).toBe("#0a0e27");
});
```

### Test Theme Selector

```typescript
import { render, screen } from "@testing-library/react";
import { ThemeSelector } from "../components/ThemeSelector";

test("renders all themes", () => {
  render(<ThemeSelector value="minimal" onChange={() => {}} />);
  expect(screen.getByText("Minimal")).toBeInTheDocument();
  expect(screen.getByText("Dark Neon")).toBeInTheDocument();
});
```

## Troubleshooting

### Theme not applying
- Check if `applyTheme()` is called after page load
- Verify theme name is valid
- Check browser console for errors

### Styles not updating
- Ensure CSS variables are used in styles
- Check if `theme.css` is imported
- Verify no inline styles override variables

### Preview doesn't match public page
- Both should use same `THEMES` object
- Both should call `applyTheme()` with same theme
- Check for CSS specificity issues

## Future Enhancements

- Theme customization UI
- Custom color picker
- Font selection
- Export/import themes
- Theme versioning
- A/B testing themes
