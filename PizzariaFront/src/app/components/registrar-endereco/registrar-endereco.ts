import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

@Component({
  selector: 'app-registrar-endereco',
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-endereco.html',
  styleUrl: './registrar-endereco.css',
  standalone: true
})
export class RegistrarEnderecoComponent {
  endereco = signal<Endereco>({
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: 'SP',
    cep: ''
  });

  carregando = signal(false);
  mensagem = signal('');
  tipoMensagem = signal<'sucesso' | 'erro'>('erro');

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Se usuário não está logado, redirecionar para login
    if (!this.authService.estaAutenticado()) {
      this.router.navigate(['/login']);
    }
  }

  salvarEndereco() {
    if (!this.validarFormulario()) {
      return;
    }

    this.carregando.set(true);
    this.mensagem.set('');

    // Obter usuário logado
    const usuario = this.authService.usuarioLogado();
    if (!usuario) {
      this.carregando.set(false);
      this.tipoMensagem.set('erro');
      this.mensagem.set('❌ Erro: usuário não identificado');
      return;
    }

    // Salvar endereço associado ao usuário
    const enderecoComId = {
      id: Date.now(), // ID único
      ...this.endereco(),
      usuarioId: usuario.id,
      dataCadastro: new Date().toISOString()
    };

    // Carregar endereços existentes do usuário
    const chaveEnderecosUsuario = `enderecos_usuario_${usuario.id}`;
    const enderecosExistentes = JSON.parse(localStorage.getItem(chaveEnderecosUsuario) || '[]');
    enderecosExistentes.push(enderecoComId);
    localStorage.setItem(chaveEnderecosUsuario, JSON.stringify(enderecosExistentes));

    // Marca que o usuário tem pelo menos um endereço
    localStorage.setItem('primeira_entrega_registrada', 'true');

    // Simular delay
    setTimeout(() => {
      this.carregando.set(false);
      this.tipoMensagem.set('sucesso');
      this.mensagem.set('✅ Endereço registrado com sucesso!');

      setTimeout(() => {
        this.router.navigate(['/cardapio']);
      }, 2000);
    }, 1000);
  }

  validarFormulario(): boolean {
    if (!this.endereco().rua.trim()) {
      this.mensagem.set('❌ Rua é obrigatória');
      this.tipoMensagem.set('erro');
      return false;
    }
    if (!this.endereco().numero.trim()) {
      this.mensagem.set('❌ Número é obrigatório');
      this.tipoMensagem.set('erro');
      return false;
    }
    if (!this.endereco().bairro.trim()) {
      this.mensagem.set('❌ Bairro é obrigatório');
      this.tipoMensagem.set('erro');
      return false;
    }
    if (!this.endereco().cidade.trim()) {
      this.mensagem.set('❌ Cidade é obrigatória');
      this.tipoMensagem.set('erro');
      return false;
    }
    if (!this.endereco().cep.trim()) {
      this.mensagem.set('❌ CEP é obrigatório');
      this.tipoMensagem.set('erro');
      return false;
    }
    return true;
  }

  irParaCardapio() {
    this.router.navigate(['/cardapio']);
  }
}
