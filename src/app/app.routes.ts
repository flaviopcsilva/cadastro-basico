import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PrincipalComponent } from './pages/principal/principal.component';
import { AuthGuard } from './auth.guard';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { CadastroClienteComponent } from './pages/cadastro-cliente/cadastro-cliente.component';
import { ListarClientesComponent } from './pages/listar-clientes/listar-clientes.component';


export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'cadastro',
        component: CadastroComponent
    },
    {
        path: 'cadastro2',
        component: CadastroClienteComponent
    },
    {
        path: 'listar-clientes',
        component: ListarClientesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'principal',
        component: PrincipalComponent,
        canActivate: [AuthGuard]
    },
    { path: '', redirectTo: '', pathMatch: 'full' },
    { path: '**', redirectTo: '' } // Redirecionar para login se a rota não for encontrada
];
