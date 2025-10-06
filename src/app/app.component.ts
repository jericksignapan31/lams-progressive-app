import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet , RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'LAMS Progressive Web App';
  themeService = inject(ThemeService);

  ngOnInit(): void {
    // Theme service will automatically initialize with saved preference
  }
}
