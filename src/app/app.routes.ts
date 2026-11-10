import { Routes } from '@angular/router';
import { Pacientes } from './pages/pacientes/pacientes';
import { Registro } from './pages/registro/registro';

export const routes: Routes = [
    { path: 'pacientes', component: Pacientes},
    { path: 'registro', component: Registro}
];
