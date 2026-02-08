import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Pizza {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagem: string;
}

interface CartItem {
  id: number;
  pizzaNome: string;
  quantidade: number;
  precoUnitario: number;
}

@Component({
  selector: 'app-cardapio',
  imports: [CommonModule],
  templateUrl: './cardapio.html',
  styleUrl: './cardapio.css',
  standalone: true
})
export class CardapioComponent implements OnInit {
  pizzas = signal<Pizza[]>([]);
  carrinho = signal<CartItem[]>([]);
  carrinhoQuantidade = signal(0);
  carrinhoTotal = signal(0);
  carregando = signal(false);
  mostrarCarrinho = signal(false);

  constructor(private router: Router) {}

  ngOnInit() {
    this.carregarPizzas();
    this.carregarCarrinho();
  }

  carregarPizzas() {
    this.carregando.set(true);
    // TODO: Integrar com API backend
    setTimeout(() => {
      this.pizzas.set([
        {
          id: 1,
          nome: 'Margherita',
          descricao: 'Tomate, mozzarela, manjericão',
          preco: 35.00,
          categoria: 'Salgada',
          imagem: 'assets/pizzas/margherita.jpg'
        },
        {
          id: 2,
          nome: 'Pepperoni',
          descricao: 'Tomate, mozzarela, pepperoni',
          preco: 42.00,
          categoria: 'Salgada',
          imagem: 'assets/pizzas/pepperoni.jpg'
        },
        {
          id: 3,
          nome: 'Chocolate com Morango',
          descricao: 'Chocolate derretido, morango fresco',
          preco: 38.00,
          categoria: 'Doce',
          imagem: 'assets/pizzas/chocolate.jpg'
        },
        {
          id: 4,
          nome: 'Quatro Queijos',
          descricao: 'Mozzarela, gorgonzola, parmesão e provolone',
          preco: 45.00,
          categoria: 'Salgada',
          imagem: 'assets/pizzas/quatro-queijos.jpg'
        },
        {
          id: 5,
          nome: 'Calabresa',
          descricao: 'Tomate, mozzarela, calabresa e cebola',
          preco: 40.00,
          categoria: 'Salgada',
          imagem: 'assets/pizzas/calabresa.jpg'
        },
        {
          id: 6,
          nome: 'Banana com Canela',
          descricao: 'Banana madura, canela e açúcar',
          preco: 36.00,
          categoria: 'Doce',
          imagem: 'assets/pizzas/banana-canela.jpg'
        }
      ]);
      this.carregando.set(false);
    }, 1000);
  }

  carregarCarrinho() {
    const carrinhoData = sessionStorage.getItem('carrinho');
    if (carrinhoData) {
      const items = JSON.parse(carrinhoData);
      this.carrinho.set(items);
      this.atualizarTotaisCarrinho();
    }
  }

  adicionarAoCarrinho(pizza: Pizza) {
    const carrinhoAtual = this.carrinho();
    const itemExistente = carrinhoAtual.find(item => item.id === pizza.id);

    if (itemExistente) {
      itemExistente.quantidade++;
    } else {
      carrinhoAtual.push({
        id: pizza.id,
        pizzaNome: pizza.nome,
        quantidade: 1,
        precoUnitario: pizza.preco
      });
    }

    this.carrinho.set([...carrinhoAtual]);
    this.atualizarTotaisCarrinho();
    sessionStorage.setItem('carrinho', JSON.stringify(carrinhoAtual));
  }

  removerDoCarrinho(id: number) {
    const carrinhoAtual = this.carrinho();
    const novoCarrinho = carrinhoAtual.filter(item => item.id !== id);
    this.carrinho.set(novoCarrinho);
    this.atualizarTotaisCarrinho();
    sessionStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
  }

  diminuirQuantidade(id: number) {
    const carrinhoAtual = this.carrinho();
    const item = carrinhoAtual.find(i => i.id === id);
    if (item) {
      if (item.quantidade > 1) {
        item.quantidade--;
        this.carrinho.set([...carrinhoAtual]);
        this.atualizarTotaisCarrinho();
        sessionStorage.setItem('carrinho', JSON.stringify(carrinhoAtual));
      }
    }
  }

  aumentarQuantidade(id: number) {
    const carrinhoAtual = this.carrinho();
    const item = carrinhoAtual.find(i => i.id === id);
    if (item) {
      item.quantidade++;
      this.carrinho.set([...carrinhoAtual]);
      this.atualizarTotaisCarrinho();
      sessionStorage.setItem('carrinho', JSON.stringify(carrinhoAtual));
    }
  }

  atualizarTotaisCarrinho() {
    const items = this.carrinho();
    this.carrinhoQuantidade.set(items.length);
    const total = items.reduce((sum, item) => sum + (item.quantidade * item.precoUnitario), 0);
    this.carrinhoTotal.set(total);
  }

  irParaPagamento() {
    if (this.carrinho().length === 0) {
      alert('❌ Adicione itens ao carrinho!');
      return;
    }

    const cartData = {
      itens: this.carrinho(),
      total: this.carrinhoTotal()
    };
    sessionStorage.setItem('cartData', JSON.stringify(cartData));
    sessionStorage.removeItem('carrinho');
    this.router.navigate(['/pagamento']);
  }

  limparCarrinho() {
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
      this.carrinho.set([]);
      this.atualizarTotaisCarrinho();
      sessionStorage.removeItem('carrinho');
    }
  }
}

