import { Routes } from '@angular/router';
import { isAdminGuard } from '../guards/admin-guard';
import { NewDirectorComponent } from '../components/pages/admin-pages/director/new-director/new-director.component';
import { ListDirectorComponent } from '../components/pages/admin-pages/director/list-director/list-director.component';
import { DashboardComponent } from '../components/pages/admin-pages/dashboard/dashboard.component';
import { NewActorComponent } from '../components/pages/admin-pages/actor/new-actor/new-actor.component';
import { ListActorComponent } from '../components/pages/admin-pages/actor/list-actor/list-actor.component';
import { NewMovieComponent } from '../components/pages/admin-pages/movie/new-movie/new-movie.component';
import { ListMovieComponent } from '../components/pages/admin-pages/movie/list-movie/list-movie.component';
import { NewGenreComponent } from '../components/pages/admin-pages/genre/new-genre/new-genre.component';
import { ListGenreComponent } from '../components/pages/admin-pages/genre/list-genre/list-genre.component';
export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [isAdminGuard],
            },
            {
                path: 'newMovie',
                component: NewMovieComponent,
                canActivate: [isAdminGuard],
            },
            {
                path: 'listMovie',
                component: ListMovieComponent,
                canActivate: [isAdminGuard],
            },
            {
                path: 'newDirector',
                component: NewDirectorComponent,
                canActivate: [isAdminGuard],
            },
            {
                path: 'listDirector',
                component: ListDirectorComponent,
                canActivate: [isAdminGuard],
            },
            {
                path: 'newActor',
                component: NewActorComponent,
                canActivate: [isAdminGuard],
            },
            {
                path: 'listActor',
                component: ListActorComponent,
                canActivate: [isAdminGuard],
            },
            {
                path: 'newGenre',
                component: NewGenreComponent,
                canActivate: [isAdminGuard],
            },
            {
                path: 'listGenre',
                component: ListGenreComponent,
                canActivate: [isAdminGuard],
            },
            { path: '', redirectTo: 'admin', pathMatch: 'full' },
            { path: '**', redirectTo: 'admin' },
        ],
    },
];