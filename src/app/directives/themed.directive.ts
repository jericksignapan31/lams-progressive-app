import {
  Directive,
  ElementRef,
  inject,
  Input,
  OnInit,
  OnDestroy,
  Renderer2,
  effect,
  EffectRef,
} from '@angular/core';
import { ThemeService, ThemeColors } from '../services/theme.service';

@Directive({
  selector: '[appThemed]',
  standalone: true,
})
export class ThemedDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly themeService = inject(ThemeService);

  @Input() themedBackground = true;
  @Input() themedText = true;
  @Input() themedBorder = false;
  @Input() customLightClass = '';
  @Input() customDarkClass = '';
  @Input() colorProperty: keyof ThemeColors | '' = '';

  private effectRef?: EffectRef;

  ngOnInit(): void {
    this.effectRef = effect(() => {
      this.applyThemeStyles();
    });
  }

  ngOnDestroy(): void {
    this.effectRef?.destroy();
  }

  private applyThemeStyles(): void {
    const element = this.el.nativeElement;
    const isDark = this.themeService.isDarkMode();
    const colors = this.themeService.themeColors();

    // Remove existing theme classes
    this.renderer.removeClass(element, 'light-themed');
    this.renderer.removeClass(element, 'dark-themed');
    this.renderer.removeClass(element, this.customLightClass);
    this.renderer.removeClass(element, this.customDarkClass);

    // Add current theme class
    if (isDark) {
      this.renderer.addClass(element, 'dark-themed');
      if (this.customDarkClass) {
        this.renderer.addClass(element, this.customDarkClass);
      }
    } else {
      this.renderer.addClass(element, 'light-themed');
      if (this.customLightClass) {
        this.renderer.addClass(element, this.customLightClass);
      }
    }

    // Apply background color
    if (this.themedBackground) {
      this.renderer.setStyle(element, 'background-color', colors.surface);
    }

    // Apply text color
    if (this.themedText) {
      this.renderer.setStyle(element, 'color', colors.text);
    }

    // Apply border color
    if (this.themedBorder) {
      const borderColor = isDark ? '#475569' : '#e5e7eb';
      this.renderer.setStyle(element, 'border-color', borderColor);
    }

    // Apply custom color property
    if (this.colorProperty && colors[this.colorProperty]) {
      this.renderer.setStyle(element, 'color', colors[this.colorProperty]);
    }

    // Add smooth transition
    this.renderer.setStyle(element, 'transition', 'all 0.3s ease');
  }
}
