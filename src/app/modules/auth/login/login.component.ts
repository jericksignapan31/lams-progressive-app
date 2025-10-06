import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

// Theming
import { ThemeService } from '../../../services/theme.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    CheckboxModule,
    DividerModule,
    MessageModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  loginError = '';

  // Theme service for dynamic theming
  themeService = inject(ThemeService);
username: any;

  constructor(private fb: FormBuilder, private router: Router) {}

  // Theme helper methods
  get isDarkMode() {
    return this.themeService.isDarkMode();
  }

  get currentTheme() {
    return this.themeService.currentTheme();
  }

  get themeColors() {
    return this.themeService.themeColors();
  }

  ngOnInit() {
    this.createForm();
  }

  private createForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginError = '';

      // Simulate login API call
      setTimeout(() => {
        const { email, password } = this.loginForm.value;

        // Simple demo authentication
        if (email === 'admin@lams.com' && password === 'admin123') {
          // Successful login
          localStorage.setItem(
            'lams_user',
            JSON.stringify({ email, loggedIn: true })
          );
          this.router.navigate(['/home']);
        } else {
          // Failed login
          this.loginError =
            'Invalid email or password. Try admin@lams.com / admin123';
        }

        this.isLoading = false;
      }, 1500);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required'])
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength'])
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } must be at least 6 characters`;
    }
    return '';
  }

  onForgotPassword(): void {
    // Navigate to forgot password or show modal
    alert('Forgot password functionality would be implemented here');
  }

  onSignUp(): void {
    // Navigate to sign up page
    this.router.navigate(['/register']);
  }
}
