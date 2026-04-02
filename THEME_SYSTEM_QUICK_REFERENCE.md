# Theme System - Quick Reference

## File Structure

```
src/theme/
├── themes.ts          # Theme definitions & core functions
├── utils.ts           # Helper functions & utilities
└── theme.css          # Global CSS variables & styles

src/components/
└── ThemeSelector.tsx  # Theme selection UI component
```

## Quick Start

### 1. Apply Theme to Page

```typescript
import { THEMES, applyTheme } from "../theme/themes";

useEffect(() => {
  applyTheme(THEMES[theme]);
}, [theme]);
```

### 2. Use Theme Selector

```typescript
import { ThemeSelector } from "../components/ThemeSelector";

<ThemeSelector
  value={theme}
  onChange={(newTheme) => setTheme(newTheme)}
/>
```

### 3. Style with CSS Variables

```css
.component {
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-family);
  border-radius: var(--border-radius);
  padding: var(--spacing);
}
```

## Available CSS Variables

### Colors
- `--color-primary` - Main color
- `--color-secondary` - Secondary color
- `--color-accent` - Accent/highlight
- `--color-background` - Page background
- `--color-surface` - Card background
- `--color-text` - Primary text
- `--color-text-light` - Secondary text
- `--color-border` - Border color

### Typography
- `--font-family` - Font stack
- `--heading-size` - Heading size
- `--body-size` - Body text size
- `--font-weight` - Font weight

### UI
- `--border-radius` - Border radius
- `--spacing` - Base spacing unit
- `--button-style` - Button style (solid/outline/glow)

### Transitions
- `--transition-fast` - 150ms
- `--transition-base` - 250ms
- `--transition-slow` - 350ms

## Theme Names

```typescript
type ThemeName = 
  | "minimal"      // Clean & simple
  | "dark"         // Bold & futuristic
  | "pastel"       // Soft & friendly
  | "luxury"       // Elegant & premium
  | "retro"        // Vintage vibes
  | "brutal";      // Bold & raw
```

## Common Patterns

### Style Component with Theme

```typescript
<Box
  style={{
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
    borderRadius: theme.ui.borderRadius,
  }}
>
  Content
</Box>
```

### Get Theme with Fallback

```typescript
import { getTheme } from "../theme/utils";

const theme = getTheme(page.theme); // Falls back to minimal
```

### Validate Theme

```typescript
import { isValidTheme } from "../theme/utils";

if (isValidTheme(themeName)) {
  // Use theme
}
```

### Get All Themes for UI

```typescript
import { getAvailableThemes } from "../theme/utils";

const themes = getAvailableThemes();
// Returns: [{ id, name, description, preview }, ...]
```

## Button Styles

### Solid Button
```css
.btn-solid {
  background-color: var(--color-accent);
  color: var(--color-primary);
}

.btn-solid:hover {
  opacity: 0.85;
  transform: translateY(-2px);
}
```

### Outline Button
```css
.btn-outline {
  background-color: transparent;
  color: var(--color-accent);
  border: 2px solid var(--color-accent);
}

.btn-outline:hover {
  background-color: var(--color-accent);
  color: var(--color-primary);
}
```

### Glow Button
```css
.btn-glow {
  background-color: var(--color-accent);
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.5);
}

.btn-glow:hover {
  box-shadow: 0 0 30px rgba(0, 217, 255, 0.8);
}
```

## Animations

### Fade In Up
```css
.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}
```

### Fade In Down
```css
.fade-in-down {
  animation: fadeInDown 0.6s ease-out;
}
```

### Stagger Effect
```css
.fade-in-up:nth-child(1) { animation-delay: 0.1s; }
.fade-in-up:nth-child(2) { animation-delay: 0.2s; }
.fade-in-up:nth-child(3) { animation-delay: 0.3s; }
```

## Responsive Scaling

Themes automatically scale on smaller screens:

```css
@media (max-width: 768px) {
  /* Heading size reduced to 80% */
  /* Body size reduced to 95% */
  /* Spacing reduced to 12px */
}

@media (max-width: 480px) {
  /* Heading size reduced to 60% */
  /* Body size set to 0.9rem */
  /* Spacing reduced to 10px */
}
```

## Persistence

Themes are saved with pages:

```typescript
// Save
await pagesAPI.update(pageId, {
  theme: "dark",
  content: {...},
});

// Load
const page = await pagesAPI.get(pageId);
const theme = getTheme(page.theme);
applyTheme(theme);
```

## Debugging

### Check Applied Theme
```javascript
// In browser console
const root = document.documentElement;
console.log(root.style.getPropertyValue("--color-primary"));
```

### List All CSS Variables
```javascript
const root = document.documentElement;
const styles = getComputedStyle(root);
console.log(styles);
```

### Verify Theme Object
```typescript
import { THEMES } from "../theme/themes";
console.log(THEMES.dark);
```

## Performance Tips

1. **Use CSS variables** instead of inline styles when possible
2. **Batch theme changes** to avoid multiple re-renders
3. **Use `applyTheme()`** for instant updates without re-renders
4. **Leverage GPU acceleration** with `transform` and `opacity`
5. **Debounce theme changes** in editors

## Common Issues

| Issue | Solution |
|-------|----------|
| Theme not applying | Call `applyTheme()` after page load |
| Styles not updating | Use CSS variables in styles |
| Preview doesn't match | Both use same `THEMES` object |
| Invalid theme | Falls back to "minimal" automatically |
| Slow transitions | Check for expensive animations |

## Integration Checklist

- [ ] Import `theme.css` in App.tsx
- [ ] Use `applyTheme()` in page components
- [ ] Use `ThemeSelector` in editor
- [ ] Style components with CSS variables
- [ ] Test theme switching
- [ ] Verify preview matches public page
- [ ] Check responsive scaling
- [ ] Test fallback handling

## Resources

- Full Documentation: `THEME_SYSTEM_DOCUMENTATION.md`
- Theme Definitions: `src/theme/themes.ts`
- Theme Utilities: `src/theme/utils.ts`
- CSS Variables: `src/theme/theme.css`
- Selector Component: `src/components/ThemeSelector.tsx`
