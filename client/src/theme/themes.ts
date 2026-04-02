export type ThemeName = "minimal" | "dark" | "pastel" | "luxury" | "retro" | "brutal";

export interface Theme {
  name: ThemeName;
  label: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textLight: string;
    border: string;
  };
  typography: {
    fontFamily: string;
    headingSize: string;
    bodySize: string;
    fontWeight: string;
  };
  ui: {
    borderRadius: string;
    spacing: string;
    buttonStyle: "solid" | "outline" | "glow";
  };
}

export const THEMES: Record<ThemeName, Theme> = {
  minimal: {
    name: "minimal",
    label: "Minimal",
    description: "Clean and simple",
    colors: {
      primary: "#000000",
      secondary: "#ffffff",
      accent: "#aa3bff",
      background: "#ffffff",
      surface: "#f9f9f9",
      text: "#000000",
      textLight: "#666666",
      border: "#e0e0e0",
    },
    typography: {
      fontFamily: "'Inter', sans-serif",
      headingSize: "2.5rem",
      bodySize: "1rem",
      fontWeight: "500",
    },
    ui: {
      borderRadius: "8px",
      spacing: "16px",
      buttonStyle: "solid",
    },
  },
  dark: {
    name: "dark",
    label: "Dark Neon",
    description: "Bold and futuristic",
    colors: {
      primary: "#0a0e27",
      secondary: "#1a1f3a",
      accent: "#00d9ff",
      background: "#0f0f0f",
      surface: "#1a1a2e",
      text: "#ffffff",
      textLight: "#b0b0b0",
      border: "#333333",
    },
    typography: {
      fontFamily: "'Courier New', monospace",
      headingSize: "2.8rem",
      bodySize: "1rem",
      fontWeight: "600",
    },
    ui: {
      borderRadius: "4px",
      spacing: "12px",
      buttonStyle: "glow",
    },
  },
  pastel: {
    name: "pastel",
    label: "Pastel",
    description: "Soft and friendly",
    colors: {
      primary: "#ffc0cb",
      secondary: "#ffe4e1",
      accent: "#ffb6c1",
      background: "#fff5f7",
      surface: "#fffbfc",
      text: "#5a4a4a",
      textLight: "#8a7a7a",
      border: "#ffd4d8",
    },
    typography: {
      fontFamily: "'Poppins', sans-serif",
      headingSize: "2.2rem",
      bodySize: "0.95rem",
      fontWeight: "400",
    },
    ui: {
      borderRadius: "20px",
      spacing: "14px",
      buttonStyle: "solid",
    },
  },
  luxury: {
    name: "luxury",
    label: "Luxury",
    description: "Elegant and premium",
    colors: {
      primary: "#1a1a1a",
      secondary: "#d4af37",
      accent: "#c9a84c",
      background: "#f5f5f0",
      surface: "#fafaf8",
      text: "#1a1a1a",
      textLight: "#666666",
      border: "#e0d5c7",
    },
    typography: {
      fontFamily: "'Cormorant Garamond', serif",
      headingSize: "3rem",
      bodySize: "1.1rem",
      fontWeight: "400",
    },
    ui: {
      borderRadius: "2px",
      spacing: "20px",
      buttonStyle: "outline",
    },
  },
  retro: {
    name: "retro",
    label: "Retro",
    description: "Vintage vibes",
    colors: {
      primary: "#ff6b35",
      secondary: "#f7931e",
      accent: "#fdb833",
      background: "#fff8e7",
      surface: "#fffef0",
      text: "#2c3e50",
      textLight: "#7f8c8d",
      border: "#f4a460",
    },
    typography: {
      fontFamily: "'Courier Prime', monospace",
      headingSize: "2.4rem",
      bodySize: "1rem",
      fontWeight: "700",
    },
    ui: {
      borderRadius: "0px",
      spacing: "18px",
      buttonStyle: "solid",
    },
  },
  brutal: {
    name: "brutal",
    label: "Brutal",
    description: "Bold and raw",
    colors: {
      primary: "#000000",
      secondary: "#ffffff",
      accent: "#ff0000",
      background: "#ffffff",
      surface: "#f0f0f0",
      text: "#000000",
      textLight: "#333333",
      border: "#000000",
    },
    typography: {
      fontFamily: "'IBM Plex Mono', monospace",
      headingSize: "3.5rem",
      bodySize: "1.2rem",
      fontWeight: "700",
    },
    ui: {
      borderRadius: "0px",
      spacing: "24px",
      buttonStyle: "solid",
    },
  },
};

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
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
}

export function getThemeCSS(theme: Theme): string {
  return `
    :root {
      --color-primary: ${theme.colors.primary};
      --color-secondary: ${theme.colors.secondary};
      --color-accent: ${theme.colors.accent};
      --color-background: ${theme.colors.background};
      --color-surface: ${theme.colors.surface};
      --color-text: ${theme.colors.text};
      --color-text-light: ${theme.colors.textLight};
      --color-border: ${theme.colors.border};
      --font-family: ${theme.typography.fontFamily};
      --heading-size: ${theme.typography.headingSize};
      --body-size: ${theme.typography.bodySize};
      --font-weight: ${theme.typography.fontWeight};
      --border-radius: ${theme.ui.borderRadius};
      --spacing: ${theme.ui.spacing};
      --button-style: ${theme.ui.buttonStyle};
    }
  `;
}

export function getThemePreviewCSS(theme: Theme): string {
  return `
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    font-family: ${theme.typography.fontFamily};
  `;
}
