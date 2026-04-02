import { THEMES, type ThemeName, type Theme } from "./themes";

/**
 * Get theme by name with fallback to minimal
 */
export function getTheme(themeName?: string | null): Theme {
  if (!themeName || typeof themeName !== "string") {
    return THEMES.minimal;
  }

  const theme = THEMES[themeName as ThemeName];
  return theme || THEMES.minimal;
}

/**
 * Validate if theme name exists
 */
export function isValidTheme(themeName: string): themeName is ThemeName {
  return themeName in THEMES;
}

/**
 * Get all available themes for UI selection
 */
export function getAvailableThemes() {
  return Object.entries(THEMES).map(([key, theme]) => ({
    id: key,
    name: theme.label,
    description: theme.description,
    preview: {
      bg: theme.colors.background,
      text: theme.colors.text,
      accent: theme.colors.accent,
      font: theme.typography.fontFamily,
    },
  }));
}

/**
 * Apply theme to document and return cleanup function
 */
export function useTheme(themeName?: string | null) {
  const theme = getTheme(themeName);
  const root = document.documentElement;

  // Store original values for cleanup
  const originalValues = new Map<string, string | null>();

  const cssVars = [
    "--color-primary",
    "--color-secondary",
    "--color-accent",
    "--color-background",
    "--color-surface",
    "--color-text",
    "--color-text-light",
    "--color-border",
    "--font-family",
    "--heading-size",
    "--body-size",
    "--font-weight",
    "--border-radius",
    "--spacing",
    "--button-style",
  ];

  // Store original values
  cssVars.forEach((varName) => {
    originalValues.set(varName, root.style.getPropertyValue(varName));
  });

  // Apply theme
  root.style.setProperty("--color-primary", theme.colors.primary);
  root.style.setProperty("--color-secondary", theme.colors.secondary);
  root.style.setProperty("--color-accent", theme.colors.accent);
  root.style.setProperty("--color-background", theme.colors.background);
  root.style.setProperty("--color-surface", theme.colors.surface);
  root.style.setProperty("--color-text", theme.colors.text);
  root.style.setProperty("--color-text-light", theme.colors.textLight);
  root.style.setProperty("--color-border", theme.colors.border);
  root.style.setProperty("--font-family", theme.typography.fontFamily);
  root.style.setProperty("--heading-size", theme.typography.headingSize);
  root.style.setProperty("--body-size", theme.typography.bodySize);
  root.style.setProperty("--font-weight", theme.typography.fontWeight);
  root.style.setProperty("--border-radius", theme.ui.borderRadius);
  root.style.setProperty("--spacing", theme.ui.spacing);
  root.style.setProperty("--button-style", theme.ui.buttonStyle);

  // Return cleanup function
  return () => {
    originalValues.forEach((value, varName) => {
      if (value) {
        root.style.setProperty(varName, value);
      } else {
        root.style.removeProperty(varName);
      }
    });
  };
}

/**
 * Get inline styles for theme preview
 */
export function getThemePreviewStyles(theme: Theme) {
  return {
    "--color-primary": theme.colors.primary,
    "--color-secondary": theme.colors.secondary,
    "--color-accent": theme.colors.accent,
    "--color-background": theme.colors.background,
    "--color-surface": theme.colors.surface,
    "--color-text": theme.colors.text,
    "--color-text-light": theme.colors.textLight,
    "--color-border": theme.colors.border,
    "--font-family": theme.typography.fontFamily,
    "--heading-size": theme.typography.headingSize,
    "--body-size": theme.typography.bodySize,
    "--font-weight": theme.typography.fontWeight,
    "--border-radius": theme.ui.borderRadius,
    "--spacing": theme.ui.spacing,
    "--button-style": theme.ui.buttonStyle,
  } as React.CSSProperties;
}
