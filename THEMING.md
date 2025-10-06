# Dynamic Theming System Documentation

## Overview

This LAMS Progressive Web App features a comprehensive dynamic theming system built with Angular 19 and PrimeNG. The system allows seamless switching between light and dark themes with automatic persistence and component integration.

## 🚀 Features

- ✅ **Dynamic Theme Switching**: Instant light/dark mode toggle
- ✅ **Automatic Persistence**: Theme preferences saved in localStorage
- ✅ **System Preference Detection**: Respects user's OS theme preference
- ✅ **Component Integration**: Easy-to-use base classes and directives
- ✅ **Reactive Signals**: Real-time theme updates across all components
- ✅ **PrimeNG Integration**: Seamless integration with PrimeNG components
- ✅ **Custom Color Palette**: Predefined theme-aware color schemes
- ✅ **CSS Variable Support**: Dynamic CSS custom properties

## 🏗️ Architecture

### 1. Theme Service (`theme.service.ts`)

The core service that manages theme state and provides utilities:

```typescript
import { ThemeService } from "./services/theme.service";

// Inject the service
themeService = inject(ThemeService);

// Access reactive theme state
currentTheme = this.themeService.currentTheme(); // 'light' | 'dark'
isDark = this.themeService.isDarkMode();
colors = this.themeService.themeColors();
```

### 2. Base Themed Component (`base-themed.component.ts`)

Extend this component for automatic theming capabilities:

```typescript
import { BaseThemedComponent } from './components/base/base-themed.component';

@Component({...})
export class MyComponent extends BaseThemedComponent {
  // Automatic access to theme properties:
  // - this.currentTheme()
  // - this.isDarkMode()
  // - this.themeColors()
  // - this.getThemeColor()
  // - this.getConditionalClass()
}
```

### 3. Themed Directive (`themed.directive.ts`)

Apply theming to any element:

```html
<!-- Basic theming -->
<div appThemed>Auto-themed content</div>

<!-- Custom options -->
<div appThemed [themedBackground]="true" [themedText]="true" [themedBorder]="true" [customLightClass]="'my-light-class'" [customDarkClass]="'my-dark-class'">Custom themed element</div>

<!-- Color-specific theming -->
<div appThemed [colorProperty]="'primary'">Primary color text</div>
```

## 🎨 Using Theme Colors

### Available Color Palette

```typescript
interface ThemeColors {
  primary: string; // Main brand color
  secondary: string; // Secondary brand color
  surface: string; // Card/surface background
  background: string; // Page background
  text: string; // Main text color
  accent: string; // Accent/highlight color
  warn: string; // Warning color
  success: string; // Success color
  info: string; // Information color
  error: string; // Error color
}
```

### Accessing Colors in Components

```typescript
export class MyComponent extends BaseThemedComponent {
  getButtonStyle() {
    return {
      backgroundColor: this.getThemeColor("primary"),
      color: this.getThemeColor("text"),
      border: `2px solid ${this.getThemeColor("accent")}`,
    };
  }

  getConditionalStyling() {
    return this.getConditionalClass("light-style", "dark-style");
  }
}
```

### Using in Templates

```html
<!-- Direct color access -->
<div [style.color]="themeColors().primary">Primary colored text</div>

<!-- Conditional classes -->
<div [class]="getConditionalClass('btn-light', 'btn-dark')">Conditional button</div>

<!-- Theme-aware styling -->
<p-card [styleClass]="cardClass()">
  <div [style]="componentStyles()">Auto-styled content</div>
</p-card>
```

## 🔧 Component Examples

### 1. Basic Themed Component

```typescript
import { Component } from "@angular/core";
import { BaseThemedComponent } from "../base/base-themed.component";

@Component({
  selector: "app-my-component",
  template: `
    <div [class]="containerClass()">
      <h2 [style.color]="themeColors().primary">Current theme: {{ currentTheme() }}</h2>
      <div appThemed class="content">This content adapts automatically!</div>
    </div>
  `,
  styles: [
    `
      .content {
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
      }
    `,
  ],
})
export class MyComponent extends BaseThemedComponent {
  // Automatic theming capabilities available
}
```

### 2. Manual Theme Integration

```typescript
import { Component, inject, computed } from "@angular/core";
import { ThemeService } from "../services/theme.service";

@Component({
  selector: "app-manual-themed",
  template: `
    <div [class]="containerClass()">
      <button [style]="buttonStyle()" (click)="toggleTheme()">Switch to {{ isDark() ? "Light" : "Dark" }} Mode</button>
    </div>
  `,
})
export class ManualThemedComponent {
  private themeService = inject(ThemeService);

  isDark = this.themeService.isDarkMode;
  colors = this.themeService.themeColors;

  containerClass = computed(() => `container theme-${this.themeService.currentTheme()}`);

  buttonStyle = computed(() => ({
    backgroundColor: this.colors().primary,
    color: this.colors().text,
    border: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    cursor: "pointer",
  }));

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
```

### 3. Theme-Aware PrimeNG Components

```html
<p-card [header]="'Theme: ' + currentTheme()" [styleClass]="cardClass()">
  <p-button label="Primary Action" severity="primary" [styleClass]="getConditionalClass('light-btn', 'dark-btn')"> </p-button>

  <p-button label="Success Action" severity="success" [outlined]="isDarkMode()"> </p-button>
</p-card>
```

## 🎯 Best Practices

### 1. Use Base Component When Possible

```typescript
// ✅ Recommended
export class MyComponent extends BaseThemedComponent {
  // Automatic theming capabilities
}

// ❌ Avoid manual injection unless necessary
export class MyComponent {
  themeService = inject(ThemeService);
}
```

### 2. Leverage Computed Signals

```typescript
// ✅ Reactive and efficient
buttonClass = computed(() =>
  this.getConditionalClass('btn-light', 'btn-dark')
);

// ❌ Manual updates required
get buttonClass() {
  return this.isDark() ? 'btn-dark' : 'btn-light';
}
```

### 3. Use Theme Directive for Simple Elements

```html
<!-- ✅ Simple and declarative -->
<div appThemed [themedBorder]="true">Content</div>

<!-- ❌ Manual styling -->
<div [style.background]="colors().surface" [style.color]="colors().text">Content</div>
```

### 4. Consistent Color Usage

```typescript
// ✅ Use theme colors
backgroundColor: this.getThemeColor("primary");

// ❌ Hard-coded colors
backgroundColor: "#3b82f6";
```

## 🔄 Theme Switching

### Programmatic Theme Changes

```typescript
// Toggle between themes
this.themeService.toggleTheme();

// Set specific theme
this.themeService.setTheme("dark");
this.themeService.setTheme("light");

// Check current theme
const current = this.themeService.currentTheme();
const isDark = this.themeService.isDarkMode();
```

### Theme Toggle Component

The built-in theme toggle component can be used anywhere:

```html
<app-theme-toggle></app-theme-toggle>
```

## 🎨 Customizing Themes

### Adding Custom Colors

Extend the theme service to add custom colors:

```typescript
// In theme.service.ts
themeColors = computed<ThemeColors>(() => {
  const isDark = this.isDarkMode();
  return {
    // ... existing colors
    custom: isDark ? "#your-dark-color" : "#your-light-color",
    brand: isDark ? "#dark-brand" : "#light-brand",
  };
});
```

### Custom CSS Variables

Add custom CSS variables in `styles.scss`:

```scss
// Light theme
body.light {
  --custom-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --custom-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

// Dark theme
body.dark {
  --custom-gradient: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  --custom-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}
```

## 📱 Testing Themes

1. **Manual Testing**: Use the theme toggle in the app header
2. **Browser DevTools**: Toggle system theme preference
3. **Component Demo**: Visit `/theme-example` route for comprehensive examples
4. **Responsive Testing**: Test theme switching on different screen sizes

## 🔍 Debugging

Enable theme debug logging in the service:

```typescript
// In theme.service.ts constructor
effect(() => {
  const theme = this.currentTheme();
  console.log(\`Theme changed to: \${theme}\`, this.themeColors());
});
```

## 🚀 Getting Started

1. **Extend BaseThemedComponent** for new components
2. **Use appThemed directive** for simple elements
3. **Access themeColors()** for dynamic styling
4. **Use getConditionalClass()** for theme-specific CSS classes
5. **Test with the theme toggle** in the app header

Visit `/theme-example` in the app to see all theming features in action!
