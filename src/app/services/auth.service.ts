import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  avatar?: string;
  department: string;
  createdAt: string;
  lastLogin?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AuthSession {
  id: string;
  userId: number;
  token: string;
  isActive: boolean;
  createdAt: string;
  expiresAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://127.0.0.1:3000';

  // Reactive state management
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  // Public observables
  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();

  // Signals for reactive components
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    // Check if user is already logged in
    const token = this.getStoredToken();
    const user = this.getStoredUser();

    if (token && user) {
      this.setCurrentUser(user);
      this.setAuthenticated(true);
    }
  }

  /**
   * Authenticate user with email and password
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.setLoading(true);

    return this.http.get<User[]>(`${this.API_URL}/users`).pipe(
      map((users) => {
        // Find user by email and password
        const user = users.find(
          (u) => u.email === credentials.email && u.isActive === true
        );

        if (!user) {
          throw new Error('User not found or inactive');
        }

        // In a real app, you'd verify password hash
        // For demo, we'll simulate password check
        return this.simulatePasswordCheck(user, credentials.password);
      }),
      tap((response) => {
        // Update user's last login
        this.updateLastLogin(response.user.id).subscribe();

        // Store authentication data
        this.storeAuthData(response);

        // Update reactive state
        this.setCurrentUser(response.user);
        this.setAuthenticated(true);
        this.setLoading(false);
      }),
      catchError((error) => {
        this.setLoading(false);
        return throwError(() => new Error(this.getErrorMessage(error)));
      })
    );
  }

  /**
   * Simulate password verification (in real app, this would be done server-side)
   */
  private simulatePasswordCheck(user: User, password: string): LoginResponse {
    const validPasswords: { [key: string]: string } = {
      'admin@lams.com': 'admin123',
      'teacher@lams.com': 'teacher123',
      'student@lams.com': 'student123',
      'faculty@lams.com': 'faculty123',
      'labtech@lams.com': 'labtech123',
    };

    if (validPasswords[user.email] !== password) {
      throw new Error('Invalid password');
    }

    // Generate a simple token (in real app, use JWT from server)
    const token = this.generateToken(user);

    return {
      user,
      token,
    };
  }

  /**
   * Generate a simple token (demo purposes only)
   */
  private generateToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      timestamp: Date.now(),
    };
    return btoa(JSON.stringify(payload));
  }

  /**
   * Update user's last login timestamp
   */
  private updateLastLogin(userId: number): Observable<User> {
    const lastLogin = new Date().toISOString();
    return this.http.patch<User>(`${this.API_URL}/users/${userId}`, {
      lastLogin,
    });
  }

  /**
   * Logout current user
   */
  logout(): Observable<boolean> {
    return new Observable((observer) => {
      // Clear stored data
      this.clearAuthData();

      // Update reactive state
      this.setCurrentUser(null);
      this.setAuthenticated(false);

      observer.next(true);
      observer.complete();
    });
  }

  /**
   * Check if current user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.role === role;
  }

  /**
   * Check if current user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const user = this.currentUser();
    return user ? roles.includes(user.role) : false;
  }

  /**
   * Get current user's full name
   */
  getCurrentUserFullName(): string {
    const user = this.currentUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  /**
   * Get and clear attempted URL for redirect after login
   */
  getAndClearAttemptedUrl(): string | null {
    const url = localStorage.getItem('lams_attempted_url');
    if (url) {
      localStorage.removeItem('lams_attempted_url');
    }
    return url;
  }

  /**
   * Refresh user data from server
   */
  refreshUserData(): Observable<User> {
    const user = this.currentUser();
    if (!user) {
      return throwError(() => new Error('No authenticated user'));
    }

    return this.http.get<User>(`${this.API_URL}/users/${user.id}`).pipe(
      tap((updatedUser) => {
        this.setCurrentUser(updatedUser);
        this.storeUser(updatedUser);
      })
    );
  }

  // Private helper methods

  private setCurrentUser(user: User | null): void {
    this.currentUser.set(user);
    this.currentUserSubject.next(user);
  }

  private setAuthenticated(authenticated: boolean): void {
    this.isAuthenticated.set(authenticated);
    this.isAuthenticatedSubject.next(authenticated);
  }

  private setLoading(loading: boolean): void {
    this.isLoading.set(loading);
    this.isLoadingSubject.next(loading);
  }

  private storeAuthData(response: LoginResponse): void {
    localStorage.setItem('lams_token', response.token);
    localStorage.setItem('lams_user', JSON.stringify(response.user));
  }

  private storeUser(user: User): void {
    localStorage.setItem('lams_user', JSON.stringify(user));
  }

  private clearAuthData(): void {
    localStorage.removeItem('lams_token');
    localStorage.removeItem('lams_user');
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('lams_token');
  }

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem('lams_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  private getErrorMessage(error: any): string {
    if (error.message) {
      return error.message;
    }
    if (error.error?.message) {
      return error.error.message;
    }
    return 'Authentication failed. Please try again.';
  }
}
