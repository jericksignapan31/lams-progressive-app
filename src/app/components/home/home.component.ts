import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardModule, ButtonModule, PanelModule, RouterModule],
  template: `
    <div class="home-container">
      <p-card
        header="Welcome to LAMS"
        subheader="Learning Activity Management System"
      >
        <div class="card-content">
          <p>
            This is a Progressive Web App built with Angular and PrimeNG. The
            application features dynamic theming with light and dark modes.
          </p>

          <div class="feature-grid">
            <p-panel header="🌓 Dynamic Theming">
              <p>
                Switch between light and dark themes seamlessly. Your preference
                is automatically saved.
              </p>
            </p-panel>

            <p-panel header="📱 Progressive Web App">
              <p>
                Install this app on your device for a native-like experience
                with offline capabilities.
              </p>
            </p-panel>

            <p-panel header="🎨 PrimeNG Components">
              <p>
                Beautiful, accessible UI components that automatically adapt to
                your chosen theme.
              </p>
            </p-panel>
          </div>

          <div class="action-buttons">
            <p-button
              label="View Theme Example"
              severity="primary"
              [raised]="true"
              routerLink="/theme-example"
            ></p-button>
            <p-button
              label="Learn More"
              severity="secondary"
              [outlined]="true"
            ></p-button>
          </div>
        </div>
      </p-card>
    </div>
  `,
  styles: [
    `
      .home-container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .card-content {
        padding: 1rem 0;
      }

      .feature-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
        margin: 2rem 0;
      }

      .action-buttons {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        margin-top: 2rem;
      }

      p {
        margin-bottom: 1rem;
        line-height: 1.6;
      }

      @media (max-width: 768px) {
        .feature-grid {
          grid-template-columns: 1fr;
        }

        .action-buttons {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class HomeComponent {}
