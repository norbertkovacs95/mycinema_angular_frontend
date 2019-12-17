import { Routes } from '@angular/router';

import { MoviesComponent } from '../movies/movies.component';
import { HomeComponent } from '../home/home.component';
import { AboutComponent } from '../about/about.component';

export const routes: Routes = [
  { path: 'home',  component: HomeComponent },
  { path: 'movies',     component: MoviesComponent },
  { path: 'about', component: AboutComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];