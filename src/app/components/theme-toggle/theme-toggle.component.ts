import { Component, inject, computed } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [ButtonModule, TooltipModule],
  template: `
    <p-button
      [icon]="iconClass()"
      [label]="buttonLabel()"
      severity="contrast"
      [text]="true"
      [rounded]="true"
      (onClick)="toggleTheme()"
      [pTooltip]="tooltipText()"
      tooltipPosition="bottom"
    >
    </p-button>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);

  iconClass = computed(() =>
    this.themeService.isDark() ? 'pi pi-sun' : 'pi pi-moon'
  );

  buttonLabel = computed(() =>
    this.themeService.isDark() ? 'Light Mode' : 'Dark Mode'
  );

  tooltipText = computed(() =>
    this.themeService.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'
  );

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
