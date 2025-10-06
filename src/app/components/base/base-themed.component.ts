import { Component, inject, computed, OnInit, OnDestroy } from '@angular/core';
import {
  ThemeService,
  ThemeMode,
  ThemeColors,
} from '../../services/theme.service';

/**
 * Base component that provides theming capabilities to extending components
 */
@Component({
  template: '',
  standalone: true,
})
export abstract class BaseThemedComponent implements OnInit, OnDestroy {
  protected readonly themeService = inject(ThemeService);

  // Reactive theme properties for templates
  protected readonly currentTheme = this.themeService.currentTheme;
  protected readonly isDarkMode = this.themeService.isDarkMode;
  protected readonly isLightMode = this.themeService.isLightMode;
  protected readonly themeColors = this.themeService.themeColors;

  // CSS class helpers
  protected themeClass = computed(() => `theme-${this.currentTheme()}`);
  protected containerClass = computed(() => `container ${this.themeClass()}`);
  protected cardClass = computed(() => `card ${this.themeClass()}`);
  protected textClass = computed(() => `text ${this.themeClass()}`);

  // Component-specific theme styles
  protected componentStyles = computed(() => ({
    backgroundColor: this.themeColors().surface,
    color: this.themeColors().text,
    borderColor: this.isDarkMode() ? '#475569' : '#e5e7eb',
  }));

  ngOnInit(): void {
    this.onThemeInit();
  }

  ngOnDestroy(): void {
    this.onThemeDestroy();
  }

  // Hooks for extending components
  protected onThemeInit(): void {
    // Override in extending components
  }

  protected onThemeDestroy(): void {
    // Override in extending components
  }

  // Utility methods for extending components
  protected getThemeColor(colorKey: keyof ThemeColors): string {
    return this.themeService.getThemeColor(colorKey);
  }

  protected getConditionalClass(lightClass: string, darkClass: string): string {
    return this.themeService.getConditionalClass(lightClass, darkClass);
  }

  protected getThemeSeverity(
    type: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger'
  ): string {
    return this.themeService.getThemeSeverity(type);
  }

  // Get theme-aware button configuration
  protected getThemedButton(
    type:
      | 'primary'
      | 'secondary'
      | 'success'
      | 'info'
      | 'warn'
      | 'danger' = 'primary'
  ) {
    return {
      severity: this.getThemeSeverity(type),
      styleClass: this.getConditionalClass('light-button', 'dark-button'),
    };
  }

  // Get theme-aware card configuration
  protected getThemedCard() {
    return {
      styleClass: this.cardClass(),
      style: this.componentStyles(),
    };
  }
}
