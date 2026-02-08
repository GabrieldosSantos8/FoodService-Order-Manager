import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Pedido {
  id: number;
  dataPedido: string;
  total: number;
  status: string;
  itens: number;
}

@Component({
  selector: 'app-pedidos',
  imports: [CommonModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css',
  standalone: true
})
export class PedidosComponent implements OnInit {
  pedidos = signal<Pedido[]>([]);
  carregando = signal(false);

  constructor(
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.carregarPedidos();
  }

  carregarPedidos() {
    this.carregando.set(true);
    
    const usuario = this.authService.usuarioLogado();
    if (!usuario) {
      this.carregando.set(false);
      return;
    }
    
    // Carregar pedidos do localStorage com chave específica do usuário
    const chavePedidosUsuario = `pedidos_usuario_${usuario.id}`;
    const pedidosData = localStorage.getItem(chavePedidosUsuario);
    let pedidosList: any[] = [];
    
    if (pedidosData) {
      try {
        pedidosList = JSON.parse(pedidosData);
      } catch (e) {
        console.error('Erro ao carregar pedidos do localStorage', e);
      }
    }
    
    // Se não tiver pedidos salvos, usar mock data
    if (pedidosList.length === 0) {
      setTimeout(() => {
        this.pedidos.set([
          {
            id: 1,
            dataPedido: '2026-02-06',
            total: 75.50,
            status: 'Entregue',
            itens: 2
          },
          {
            id: 2,
            dataPedido: '2026-02-07',
            total: 42.00,
            status: 'Em Preparo',
            itens: 1
          }
        ]);
        this.carregando.set(false);
      }, 1000);
    } else {
      // Converter para o formato esperado pela UI
      const pedidosFormatados = pedidosList.map(p => ({
        id: p.id,
        dataPedido: p.dataPedido,
        total: p.total,
        status: p.status,
        itens: p.itens?.length || 0
      }));
      
      this.pedidos.set(pedidosFormatados);
      this.carregando.set(false);
    }
  }

  obterClasseStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'Pendente': 'status-pendente',
      'Confirmado': 'status-confirmado',
      'Em Preparo': 'status-preparo',
      'Saiu para Entrega': 'status-entrega',
      'Entregue': 'status-entregue',
      'Cancelado': 'status-cancelado'
    };
    return statusMap[status] || '';
  }

  verDetalhes(pedidoId: number) {
    this.router.navigate(['/pedidos', pedidoId]);
  }

  novoPedido() {
    // TODO: Redirecionar para cardápio
    this.router.navigate(['/cardapio']);
  }
}
