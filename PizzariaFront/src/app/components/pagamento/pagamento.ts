import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface CartItem {
  id: number;
  pizzaNome: string;
  quantidade: number;
  precoUnitario: number;
}

interface Endereco {
  id?: number;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

interface CartData {
  itens: CartItem[];
  total: number;
}

@Component({
  selector: 'app-pagamento',
  imports: [CommonModule, FormsModule],
  templateUrl: './pagamento.html',
  styleUrl: './pagamento.css',
  standalone: true
})
export class PagamentoComponent {
  cartData: CartData = JSON.parse(sessionStorage.getItem('cartData') || '{"itens":[],"total":0}');
  
  metodo = signal<'cartao' | 'dinheiro'>('cartao');
  processando = signal(false);
  mensagem = signal('');
  temEnderecosSalvos = signal(false);
  enderecosSalvos = signal<Endereco[]>([]);
  enderecoSelecionadoId = signal(0);
  mostraSelectorEndereco = signal(false);
  
  endereco = signal<Endereco>({
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: ''
  });

  titular = signal('');
  numeroCartao = signal('');
  validade = signal('');
  cvv = signal('');
  
  troco = signal(0);

  constructor(
    private router: Router,
    public authService: AuthService
  ) {
    if (this.cartData.itens.length === 0) {
      this.router.navigate(['/cardapio']);
    }
    
    // Carregar endereços salvos do usuário
    this.carregarEnderecosUsuario();
  }

  carregarEnderecosUsuario() {
    const usuario = this.authService.usuarioLogado();
    if (!usuario) return;

    const chaveEnderecosUsuario = `enderecos_usuario_${usuario.id}`;
    const enderecosData = localStorage.getItem(chaveEnderecosUsuario);
    
    if (enderecosData) {
      try {
        const enderecos = JSON.parse(enderecosData);
        if (enderecos && enderecos.length > 0) {
          this.enderecosSalvos.set(enderecos);
          this.temEnderecosSalvos.set(true);
          
          // Carregar o primeiro endereço por padrão
          this.endereco.set(enderecos[0]);
          this.enderecoSelecionadoId.set(enderecos[0].id || 0);
        }
      } catch (e) {
        console.error('Erro ao carregar endereços do usuário', e);
      }
    }
  }

  selecionarEndereco(endereco: Endereco) {
    this.endereco.set(endereco);
    this.enderecoSelecionadoId.set(endereco.id || 0);
    this.mostraSelectorEndereco.set(false);
  }

  adicionarEnderecoCustomizado() {
    this.mostraSelectorEndereco.set(false);
    // Permitir que o usuário digite um endereço customizado
  }

  finalizarPedido() {
    if (!this.validarFormulario()) {
      return;
    }

    this.processando.set(true);

    // Simular processamento de pagamento
    setTimeout(() => {
      // Salvar pedido com status de pago
      this.salvarPedidoPago();
      
      this.mensagem.set('✅ Pedido realizado com sucesso!');
      this.processando.set(false);

      // Limpar dados do carrinho
      sessionStorage.removeItem('cartData');

      // Redirecionar para pedidos após 2 segundos
      setTimeout(() => {
        this.router.navigate(['/pedidos']);
      }, 2000);
    }, 2000);
  }

  salvarPedidoPago() {
    const usuario = this.authService.usuarioLogado();
    if (!usuario) return;

    // Criar novo pedido com status de Confirmado/Pago
    const novoPedido = {
      id: Date.now(), // Usar timestamp como ID único
      dataPedido: new Date().toISOString().split('T')[0],
      dataEntrega: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      total: this.cartData.total,
      status: 'Confirmado', // Status após pagamento
      endereco: `${this.endereco().rua}, ${this.endereco().numero} - ${this.endereco().bairro}, ${this.endereco().cidade} - ${this.endereco().estado}`,
      itens: this.cartData.itens.map(item => ({
        id: item.id,
        pizzaNome: item.pizzaNome,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
        total: item.quantidade * item.precoUnitario
      })),
      metodo: this.metodo(),
      observacoes: ''
    };

    // Salvar no localStorage com chave específica do usuário
    const chavePedidosUsuario = `pedidos_usuario_${usuario.id}`;
    const pedidosExistentes = JSON.parse(localStorage.getItem(chavePedidosUsuario) || '[]');
    pedidosExistentes.push(novoPedido);
    localStorage.setItem(chavePedidosUsuario, JSON.stringify(pedidosExistentes));
  }

  validarFormulario(): boolean {
    if (!this.endereco().rua.trim()) {
      this.mensagem.set('❌ Rua é obrigatória');
      return false;
    }
    if (!this.endereco().numero.trim()) {
      this.mensagem.set('❌ Número é obrigatório');
      return false;
    }
    if (!this.endereco().bairro.trim()) {
      this.mensagem.set('❌ Bairro é obrigatório');
      return false;
    }
    if (!this.endereco().cidade.trim()) {
      this.mensagem.set('❌ Cidade é obrigatória');
      return false;
    }
    if (!this.endereco().cep.trim()) {
      this.mensagem.set('❌ CEP é obrigatório');
      return false;
    }

    if (this.metodo() === 'cartao') {
      if (!this.titular().trim()) {
        this.mensagem.set('❌ Nome do titular é obrigatório');
        return false;
      }
      if (!this.numeroCartao().trim() || this.numeroCartao().length < 13) {
        this.mensagem.set('❌ Número do cartão inválido');
        return false;
      }
      if (!this.validade().trim()) {
        this.mensagem.set('❌ Validade é obrigatória (MM/AA)');
        return false;
      }
      if (!this.cvv().trim() || this.cvv().length < 3) {
        this.mensagem.set('❌ CVV inválido');
        return false;
      }
    } else {
      if (this.troco() < this.cartData.total) {
        this.mensagem.set(`❌ Valor insuficiente! Mínimo: R$ ${this.cartData.total.toFixed(2)}`);
        return false;
      }
    }

    return true;
  }

  voltar() {
    // Restaurar carrinho de volta para sessionStorage
    const cartData = JSON.parse(sessionStorage.getItem('cartData') || '{}');
    if (cartData.itens && cartData.itens.length > 0) {
      sessionStorage.setItem('carrinho', JSON.stringify(cartData.itens));
    }
    // Não remove cartData aqui - usuário pode voltar de novo
    this.router.navigate(['/cardapio']);
  }
}
