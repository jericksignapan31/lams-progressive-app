import { Component } from '@angular/core';
import { BaseThemedComponent } from '../base/base-themed.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { ThemedDirective } from '../../directives/themed.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-themed-example',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    PanelModule,
    ThemedDirective,
    CommonModule,
  ],
  template: `
    <div class="example-container" [ngClass]="containerClass()">
      <h2>Dynamic Theme Example</h2>

      <!-- Using the themed directive -->
      <div appThemed [themedBorder]="true" class="themed-box">
        <h3>Auto-Themed Box</h3>
        <p>
          This box automatically adapts to the current theme using the themed
          directive.
        </p>
      </div>

      <!-- Using computed theme colors -->
      <div class="color-palette">
        <h3>Current Theme Colors</h3>
        <div class="color-grid">
          <div
            class="color-item"
            [style.background-color]="themeColors().primary"
          >
            <span>Primary: {{ themeColors().primary }}</span>
          </div>
          <div
            class="color-item"
            [style.background-color]="themeColors().secondary"
          >
            <span>Secondary: {{ themeColors().secondary }}</span>
          </div>
          <div
            class="color-item"
            [style.background-color]="themeColors().accent"
          >
            <span>Accent: {{ themeColors().accent }}</span>
          </div>
          <div
            class="color-item"
            [style.background-color]="themeColors().success"
          >
            <span>Success: {{ themeColors().success }}</span>
          </div>
          <div class="color-item" [style.background-color]="themeColors().warn">
            <span>Warning: {{ themeColors().warn }}</span>
          </div>
          <div
            class="color-item"
            [style.background-color]="themeColors().error"
          >
            <span>Error: {{ themeColors().error }}</span>
          </div>
        </div>
      </div>

      <!-- Theme-aware PrimeNG components -->
      <div class="component-examples">
        <h3>Theme-Aware Components</h3>

        <p-card
          [header]="'Current Theme: ' + currentTheme()"
          [styleClass]="cardClass()"
        >
          <p>
            This card adapts to the current theme:
            <strong>{{ currentTheme() }}</strong>
          </p>
          <p>Dark mode: {{ isDarkMode() ? 'Yes' : 'No' }}</p>

          <div class="button-group">
            <p-button
              [label]="'Primary (' + currentTheme() + ')'"
              severity="primary"
              [styleClass]="getConditionalClass('light-btn', 'dark-btn')"
            >
            </p-button>

            <p-button [label]="'Success'" severity="success" [outlined]="true">
            </p-button>

            <p-button [label]="'Warning'" severity="warn" [text]="true">
            </p-button>
          </div>
        </p-card>

        <!-- Custom styled panel -->
        <p-panel header="Custom Themed Panel" [styleClass]="themeClass()">
          <div
            appThemed
            [customLightClass]="'custom-light'"
            [customDarkClass]="'custom-dark'"
            class="custom-content"
          >
            <p>This content uses custom theme classes:</p>
            <ul>
              <li>Light theme: custom-light class applied</li>
              <li>Dark theme: custom-dark class applied</li>
              <li>Background and text colors adapt automatically</li>
            </ul>
          </div>
        </p-panel>
      </div>

      <!-- Theme state information -->
      <div appThemed class="theme-info">
        <h4>Theme State Debug Info</h4>
        <pre>{{ getThemeDebugInfo() }}</pre>
      </div>
    </div>
  `,
  styles: [
    `
      .example-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        gap: 2rem;
        display: flex;
        flex-direction: column;
      }

      .themed-box {
        padding: 1.5rem;
        border-radius: 8px;
        border: 2px solid;
        margin: 1rem 0;
      }

      .color-palette {
        margin: 2rem 0;
      }

      .color-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }

      .color-item {
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
        color: white;
        font-weight: 600;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
      }

      .component-examples {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .button-group {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        margin-top: 1rem;
      }

      .custom-content {
        padding: 1rem;
        border-radius: 6px;
        margin: 1rem 0;
      }

      .theme-info {
        padding: 1rem;
        border-radius: 8px;
        font-family: monospace;
        font-size: 0.9rem;
        border: 1px solid;
      }

      // Custom theme classes for demonstration
      .custom-light {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
        border: 1px solid #c7d2fe;
      }

      .custom-dark {
        background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
        border: 1px solid #4338ca;
      }

      pre {
        background: transparent;
        margin: 0;
        white-space: pre-wrap;
      }

      @media (max-width: 768px) {
        .example-container {
          padding: 1rem;
        }

        .color-grid {
          grid-template-columns: 1fr;
        }

        .button-group {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class ThemedExampleComponent extends BaseThemedComponent {
  getThemeDebugInfo(): string {
    return JSON.stringify(
      {
        currentTheme: this.currentTheme(),
        isDarkMode: this.isDarkMode(),
        isLightMode: this.isLightMode(),
        colors: this.themeColors(),
        classes: {
          container: this.containerClass(),
          card: this.cardClass(),
          text: this.textClass(),
          theme: this.themeClass(),
        },
      },
      null,
      2
    );
  }
}
