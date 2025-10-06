import {
  Injectable,
  Renderer2,
  RendererFactory2,
  signal,
  computed,
  effect,
} from '@angular/core';
import { PrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  secondary: string;
  surface: string;
  background: string;
  text: string;
  accent: string;
  warn: string;
  success: string;
  info: string;
  error: string;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;

  // Signal for reactive theme state
  currentTheme = signal<ThemeMode>('light');

  // Computed signals for easy component access
  isDarkMode = computed(() => this.currentTheme() === 'dark');
  isLightMode = computed(() => this.currentTheme() === 'light');

  // Theme-specific colors
  themeColors = computed<ThemeColors>(() => {
    const isDark = this.isDarkMode();
    return {
      primary: isDark ? '#60a5fa' : '#3b82f6',
      secondary: isDark ? '#a78bfa' : '#8b5cf6',
      surface: isDark ? '#1e293b' : '#ffffff',
      background: isDark ? '#0f172a' : '#f8fafc',
      text: isDark ? '#f8fafc' : '#1f2937',
      accent: isDark ? '#34d399' : '#10b981',
      warn: isDark ? '#fbbf24' : '#f59e0b',
      success: isDark ? '#4ade80' : '#22c55e',
      info: isDark ? '#38bdf8' : '#0ea5e9',
      error: isDark ? '#f87171' : '#ef4444',
    };
  });

  // CSS class helpers
  themeClass = computed(() => this.currentTheme());
  containerClass = computed(() => `theme-${this.currentTheme()}`);
  cardClass = computed(() => (this.isDarkMode() ? 'dark-card' : 'light-card'));
  textClass = computed(() => (this.isDarkMode() ? 'dark-text' : 'light-text'));

  constructor(
    private rendererFactory: RendererFactory2,
    private primeng: PrimeNG
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.initializeTheme();
    this.watchSystemTheme();

    // Effect to handle theme changes
    effect(() => {
      const theme = this.currentTheme();
      // Any additional side effects when theme changes can go here
      console.log(`Theme changed to: ${theme}`);
    });
  }

  private initializeTheme(): void {
    // Check for saved theme preference or default to light
    const savedTheme = this.getStoredTheme();
    this.setTheme(savedTheme);
  }

  private getStoredTheme(): ThemeMode {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lams-theme') as ThemeMode;
      if (stored && (stored === 'light' || stored === 'dark')) {
        return stored;
      }

      // Check system preference
      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        return 'dark';
      }
    }
    return 'light';
  }

  setTheme(theme: ThemeMode): void {
    this.currentTheme.set(theme);

    // Update PrimeNG theme
    this.primeng.theme.set({
      preset: Aura,
      options: {
        darkModeSelector: theme === 'dark' ? '.dark' : false,
      },
    });

    // Update body class for global theming
    if (typeof document !== 'undefined') {
      const body = document.body;

      if (theme === 'dark') {
        this.renderer.addClass(body, 'dark');
        this.renderer.removeClass(body, 'light');
      } else {
        this.renderer.addClass(body, 'light');
        this.renderer.removeClass(body, 'dark');
      }
    }

    // Store preference
    this.storeTheme(theme);
  }

  private storeTheme(theme: ThemeMode): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lams-theme', theme);
    }
  }

  toggleTheme(): void {
    const newTheme: ThemeMode =
      this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  isDark(): boolean {
    return this.currentTheme() === 'dark';
  }

  isLight(): boolean {
    return this.currentTheme() === 'light';
  }

  // Utility methods for components
  getThemeColor(colorKey: keyof ThemeColors): string {
    return this.themeColors()[colorKey];
  }

  // Get theme-specific CSS variables
  getCSSVariable(variable: string): string {
    if (typeof document !== 'undefined') {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(`--p-${variable}`)
        .trim();
    }
    return '';
  }

  // Apply theme-specific styles to an element
  applyThemeToElement(
    element: HTMLElement,
    styles: Partial<CSSStyleDeclaration>
  ): void {
    Object.entries(styles).forEach(([property, value]) => {
      if (value) {
        this.renderer.setStyle(element, property, value);
      }
    });
  }

  // Get conditional classes based on theme
  getConditionalClass(lightClass: string, darkClass: string): string {
    return this.isDarkMode() ? darkClass : lightClass;
  }

  // Get PrimeNG severity based on theme
  getThemeSeverity(
    type: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger'
  ): string {
    const severityMap = {
      primary: 'primary',
      secondary: 'secondary',
      success: 'success',
      info: 'info',
      warn: 'warn',
      danger: 'danger',
    };
    return severityMap[type];
  }

  // Watch for system theme changes
  private watchSystemTheme(): void {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        const storedTheme = localStorage.getItem('lams-theme');
        if (!storedTheme) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }
}
