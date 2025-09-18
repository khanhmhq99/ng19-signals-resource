import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { PokeComponent } from './components/poke.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'poke', component: PokeComponent },
];
