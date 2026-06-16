import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ConsultasComponent } from './features/consultas/consultas.component';
import { PacientesComponent } from './features/pacientes/pacientes.component';
import { DentistasComponent } from './features/dentistas/dentistas.component';
import { EspecialidadesComponent } from './features/especialidades/especialidades.component';
import { RelatoriosComponent } from './features/relatorios/relatorios.component';
import { UsuariosComponent } from './features/usuarios/usuarios.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'consultas', component: ConsultasComponent },
  { path: 'pacientes', component: PacientesComponent },
  { path: 'dentistas', component: DentistasComponent },
  { path: 'especialidades', component: EspecialidadesComponent },
  { path: 'relatorios', component: RelatoriosComponent },
  { path: '**', redirectTo: 'login' }
];