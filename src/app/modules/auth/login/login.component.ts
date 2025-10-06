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

// Services
import { ThemeService } from '../../../services/theme.service';
import { AuthService } from '../../../services/auth.service';
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
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError = '';

  // Services
  themeService = inject(ThemeService);
  authService = inject(AuthService);

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

  // Auth helper methods
  get isLoading() {
    return this.authService.isLoading();
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  get currentUser() {
    return this.authService.currentUser();
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
      this.loginError = '';
      const { email, password } = this.loginForm.value;

      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          // Successful login
          console.log('Login successful:', response.user);

          // Check if there's a redirect URL
          const redirectUrl = this.authService.getAndClearAttemptedUrl();

          if (redirectUrl) {
            this.router.navigateByUrl(redirectUrl);
          } else {
            // Default redirect based on user role
            switch (response.user.role) {
              case 'admin':
                this.router.navigate(['/admin/dashboard']);
                break;
              case 'teacher':
              case 'faculty':
                this.router.navigate(['/teacher/dashboard']);
                break;
              case 'lab_technician':
                this.router.navigate(['/lab/dashboard']);
                break;
              default:
                this.router.navigate(['/student/dashboard']);
            }
          }
        },
        error: (error) => {
          // Failed login
          this.loginError = error.message;
          console.error('Login failed:', error);
        },
      });
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
