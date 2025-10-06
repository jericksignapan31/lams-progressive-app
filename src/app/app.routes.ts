import { Routes } from '@angular/router';

export const routes: Routes = [
 
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
    title: 'Login',
    // canActivate: [
    //   () => import('./core/guards/hastoken.guard').then((m) => m.hastokenGuard),
    // ],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  //   {
  //     path: 'home',
  //     loadComponent: () =>
  //       import('./modules/home/home.component').then((m) => m.HomeComponent),
  //     canActivate: [
  //       () =>
  //         import('./core/guards/is-authenticated.guard').then(
  //           (m) => m.isAuthenticatedGuard
  //         ),
  //     ],
  //     children: homeRoute,
  //   },
];
