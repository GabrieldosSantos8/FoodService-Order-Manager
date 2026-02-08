import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { UsuarioFormComponent } from './components/usuario-form/usuario-form';
import { CardapioComponent } from './components/cardapio/cardapio';
import { SobreComponent } from './components/sobre/sobre';
import { PedidosComponent } from './components/pedidos/pedidos';
import { DetalhePedidoComponent } from './components/detalhe-pedido/detalhe-pedido';
import { PerfilComponent } from './components/perfil/perfil';
import { PagamentoComponent } from './components/pagamento/pagamento';
import { RegistrarEnderecoComponent } from './components/registrar-endereco/registrar-endereco';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: UsuarioFormComponent },
  { path: 'registrar-endereco', component: RegistrarEnderecoComponent, canActivate: [AuthGuard] },
  { path: 'cardapio', component: CardapioComponent, canActivate: [AuthGuard] },
  { path: 'sobre', component: SobreComponent },
  { path: 'pedidos', component: PedidosComponent, canActivate: [AuthGuard] },
  { path: 'pedidos/:id', component: DetalhePedidoComponent, canActivate: [AuthGuard] },
  { path: 'pagamento', component: PagamentoComponent, canActivate: [AuthGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' } // Rota 404
];