import { Routes } from '@angular/router';
import { LandingComponent } from './components/pages/landing/landing.component';
import { notAuthGuard } from './guards/not-auth-guard';
import { RegisterComponent } from './components/pages/register/register.component';
import { LoginComponent } from './components/pages/login/login.component';
import { AdminContentComponent } from './components/pages/admin-pages/admin-content/admin-content.component';
import { authGuard } from './guards/auth-guard';
import { isAdminGuard } from './guards/admin-guard';
import { DetailsMovieComponent } from './components/pages/details-movie/details-movie.component';
import { ProfileComponent } from './components/pages/profile/profile.component';

export const routes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: LandingComponent, canActivate: [notAuthGuard]},
    { path: 'movie/:id', component: DetailsMovieComponent},
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
    { path: 'register', component: RegisterComponent, canActivate: [notAuthGuard]},
    { path: 'login', component: LoginComponent, canActivate: [notAuthGuard]},
    {
        path: 'admin', component: AdminContentComponent, canActivate: [authGuard, isAdminGuard],
        loadChildren: () => import('./modules/admin-router.module').then(m => m.routes)
    },
    { path: '**', component: LandingComponent }
];
