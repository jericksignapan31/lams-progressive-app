import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.checkAuth(state.url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.checkAuth(state.url);
  }

  private checkAuth(url: string): Observable<boolean> | boolean {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return true;
        }

        // Store the attempted URL for redirecting after login
        localStorage.setItem('lams_attempted_url', url);

        // Navigate to login page
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}

/**
 * Role-based guard that checks if user has required role(s)
 */
@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    const requiredRoles = route.data['roles'] as string[];

    return this.authService.isAuthenticated$.pipe(
      take(1),
      map((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
          return false;
        }

        if (!requiredRoles || requiredRoles.length === 0) {
          return true;
        }

        const hasRequiredRole = this.authService.hasAnyRole(requiredRoles);

        if (!hasRequiredRole) {
          // Redirect to unauthorized page or dashboard
          this.router.navigate(['/unauthorized']);
          return false;
        }

        return true;
      })
    );
  }
}

/**
 * Guest guard that redirects authenticated users away from auth pages
 */
@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map((isAuthenticated) => {
        if (isAuthenticated) {
          // Redirect authenticated users to dashboard
          this.router.navigate(['/dashboard']);
          return false;
        }
        return true;
      })
    );
  }
}
