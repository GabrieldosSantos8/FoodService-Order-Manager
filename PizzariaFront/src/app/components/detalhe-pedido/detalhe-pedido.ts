import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface ItemPedido {
  id: number;
  pizzaNome: string;
  quantidade: number;
  precoUnitario: number;
  total: number;
}

interface DetalhePedido {
  id: number;
  dataPedido: string;
  dataEntrega: string;
  total: number;
  status: string;
  observacoes: string;
  endereco: string;
  itens: ItemPedido[];
  metodo?: 'cartao' | 'dinheiro';
}

@Component({
  selector: 'app-detalhe-pedido',
  imports: [CommonModule],
  templateUrl: './detalhe-pedido.html',
  styleUrl: './detalhe-pedido.css',
  standalone: true
})
export class DetalhePedidoComponent implements OnInit {
  pedido = signal<DetalhePedido | null>(null);
  carregando = signal(false);
  pedidoId = signal(0);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.pedidoId.set(Number(params['id']));
      this.carregarDetalhes();
    });
  }

  carregarDetalhes() {
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
    
    // Encontrar o pedido com o ID da rota
    const pedidoEncontrado = pedidosList.find(p => p.id === this.pedidoId());
    
    if (pedidoEncontrado) {
      // Usar dados reais salvos
      this.pedido.set(pedidoEncontrado);
      this.carregando.set(false);
    } else {
      // Fallback para mock data
      setTimeout(() => {
        this.pedido.set({
          id: this.pedidoId(),
          dataPedido: '2026-02-07',
          dataEntrega: '2026-02-08',
          total: 42.00,
          status: 'Em Preparo',
          observacoes: 'Sem cebola na pizza de pepperoni',
          endereco: 'Rua das Flores, 123 - Centro, São Paulo - SP',
          itens: [
            {
              id: 1,
              pizzaNome: 'Pepperoni',
              quantidade: 1,
              precoUnitario: 42.00,
              total: 42.00
            }
          ]
        });
        this.carregando.set(false);
      }, 500);
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

  voltarPedidos() {
    this.router.navigate(['/pedidos']);
  }

  cancelarPedido() {
    if (this.pedido()?.status === 'Pendente') {
      if (confirm('Tem certeza que deseja cancelar este pedido?')) {
        // TODO: Integrar com API DELETE /api/pedido/{id}
        alert('Pedido cancelado com sucesso!');
        this.voltarPedidos();
      }
    }
  }

  irParaPagamento() {
    if (this.pedido()) {
      const cartData = {
        itens: this.pedido()!.itens,
        total: this.pedido()!.total
      };
      sessionStorage.setItem('cartData', JSON.stringify(cartData));
      this.router.navigate(['/pagamento']);
    }
  }
}
