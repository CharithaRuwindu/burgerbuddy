import { Routes } from '@angular/router';
import { VisitorLayout } from './layouts/visitor-layout/visitor-layout';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

export const appRoutes: Routes = [
  {
    path: '',
    component: VisitorLayout,
    children: [
      { path: '', component: Home },
      { path: 'login', component: Login },
      { path: 'register', component: Register },
    ],
  },
];
