import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
}

interface Endereco {
  id: number;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
  standalone: true
})
export class PerfilComponent implements OnInit {
  usuario = signal<Usuario | null>(null);
  usuarioEditado = signal<Usuario | null>(null);
  enderecos = signal<Endereco[]>([]);
  enderecoAdicionando = signal<Endereco>({
    id: 0,
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: 'SP',
    cep: ''
  });
  editandoPerfil = signal(false);
  adicionandoEndereco = signal(false);
  alterandoSenha = signal(false);
  carregando = signal(false);
  mensagem = signal('');
  tipoMensagem = signal<'sucesso' | 'erro' | ''>('');

  senhaAtual = signal('');
  novaSenha = signal('');
  confirmarSenha = signal('');

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.carregarPerfil();
  }

  carregarPerfil() {
    const usuarioLogado = this.authService.usuarioLogado();
    if (usuarioLogado) {
      this.usuario.set(usuarioLogado);
      this.usuarioEditado.set({ ...usuarioLogado });
      
      // Carregar endereços salvos para este usuário
      const chaveEnderecosUsuario = `enderecos_usuario_${usuarioLogado.id}`;
      const enderecosData = localStorage.getItem(chaveEnderecosUsuario);
      if (enderecosData) {
        try {
          this.enderecos.set(JSON.parse(enderecosData));
        } catch (e) {
          console.error('Erro ao carregar endereços', e);
        }
      }
    }
  }

  iniciarEdicao() {
    if (this.usuario()) {
      this.usuarioEditado.set({ ...this.usuario()! });
    }
    this.editandoPerfil.set(true);
  }

  cancelarEdicao() {
    this.editandoPerfil.set(false);
    this.usuarioEditado.set(null);
  }

  salvarPerfil() {
    if (!this.usuarioEditado() || !this.validarDados()) {
      return;
    }

    this.carregando.set(true);
    
    // TODO: Integrar com API backend PUT /api/usuario/{id}
    setTimeout(() => {
      this.usuario.set(this.usuarioEditado());
      this.authService.usuarioLogado.set(this.usuarioEditado());
      this.editandoPerfil.set(false);
      this.carregando.set(false);
      
      this.tipoMensagem.set('sucesso');
      this.mensagem.set('✅ Perfil atualizado com sucesso!');
      setTimeout(() => this.mensagem.set(''), 3000);
    }, 1000);
  }

  validarDados(): boolean {
    if (!this.usuarioEditado()?.nome?.trim()) {
      this.tipoMensagem.set('erro');
      this.mensagem.set('❌ Nome é obrigatório');
      return false;
    }

    if (!this.usuarioEditado()?.email?.trim()) {
      this.tipoMensagem.set('erro');
      this.mensagem.set('❌ Email é obrigatório');
      return false;
    }

    if (!this.usuarioEditado()?.telefone?.trim()) {
      this.tipoMensagem.set('erro');
      this.mensagem.set('❌ Telefone é obrigatório');
      return false;
    }

    return true;
  }

  salvarEndereco() {
    if (!this.validarEndereco()) {
      return;
    }

    this.carregando.set(true);

    // Obter usuário logado
    const usuarioLogado = this.usuario();
    if (!usuarioLogado) {
      this.carregando.set(false);
      this.tipoMensagem.set('erro');
      this.mensagem.set('❌ Erro: usuário não identificado');
      return;
    }

    // Criar novo endereço com ID
    const enderecoTemp = this.enderecoAdicionando();
    const novoEndereco: Endereco = {
      id: Date.now(),
      rua: enderecoTemp.rua,
      numero: enderecoTemp.numero,
      bairro: enderecoTemp.bairro,
      cidade: enderecoTemp.cidade,
      estado: enderecoTemp.estado,
      cep: enderecoTemp.cep
    };

    // Adicionar à lista atual
    this.enderecos.update(enderecos => [...enderecos, novoEndereco]);

    // Salvar no localStorage
    const chaveEnderecosUsuario = `enderecos_usuario_${usuarioLogado.id}`;
    const enderecosAtualizados = this.enderecos();
    localStorage.setItem(chaveEnderecosUsuario, JSON.stringify(enderecosAtualizados));

    // Limpar formulário
    this.enderecoAdicionando.set({
      id: 0,
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: 'SP',
      cep: ''
    });

    this.carregando.set(false);
    this.adicionandoEndereco.set(false);
    this.tipoMensagem.set('sucesso');
    this.mensagem.set('✅ Endereço adicionado com sucesso!');
    setTimeout(() => this.mensagem.set(''), 3000);
  }

  validarEndereco(): boolean {
    const endereco = this.enderecoAdicionando();
    
    if (!endereco.rua.trim()) {
      this.tipoMensagem.set('erro');
      this.mensagem.set('❌ Rua é obrigatória');
      return false;
    }
    if (!endereco.numero.trim()) {
      this.tipoMensagem.set('erro');
      this.mensagem.set('❌ Número é obrigatório');
      return false;
    }
    if (!endereco.bairro.trim()) {
      this.tipoMensagem.set('erro');
      this.mensagem.set('❌ Bairro é obrigatório');
      return false;
    }
    if (!endereco.cidade.trim()) {
      this.tipoMensagem.set('erro');
      this.mensagem.set('❌ Cidade é obrigatória');
      return false;
    }
    if (!endereco.cep.trim()) {
      this.tipoMensagem.set('erro');
      this.mensagem.set('❌ CEP é obrigatório');
      return false;
    }

    return true;
  }

  deletarEndereco(id: number) {
    if (confirm('Tem certeza que deseja deletar este endereço?')) {
      this.enderecos.update(enderecos => 
        enderecos.filter(e => e.id !== id)
      );

      // Salvar alteração no localStorage
      const usuarioLogado = this.usuario();
      if (usuarioLogado) {
        const chaveEnderecosUsuario = `enderecos_usuario_${usuarioLogado.id}`;
        const enderecosAtualizados = this.enderecos();
        localStorage.setItem(chaveEnderecosUsuario, JSON.stringify(enderecosAtualizados));
      }

      this.tipoMensagem.set('sucesso');
      this.mensagem.set('✅ Endereço deletado!');
      setTimeout(() => this.mensagem.set(''), 3000);
    }
  }

  alterarSenha() {
    if (!this.senhaAtual() || !this.novaSenha() || !this.confirmarSenha()) {
      this.tipoMensagem.set('erro');
      this.mensagem.set('❌ Todos os campos são obrigatórios!');
      return;
    }

    if (this.novaSenha() !== this.confirmarSenha()) {
      this.tipoMensagem.set('erro');
      this.mensagem.set('❌ As senhas não conferem!');
      return;
    }

    if (this.novaSenha().length < 6) {
      this.tipoMensagem.set('erro');
      this.mensagem.set('❌ A senha deve ter no mínimo 6 caracteres!');
      return;
    }

    this.carregando.set(true);
    
    // TODO: Integrar com API backend PUT /api/usuario/{id}/senha
    setTimeout(() => {
      this.carregando.set(false);
      this.tipoMensagem.set('sucesso');
      this.mensagem.set('✅ Senha alterada com sucesso!');
      this.alterandoSenha.set(false);
      this.senhaAtual.set('');
      this.novaSenha.set('');
      this.confirmarSenha.set('');
      setTimeout(() => this.mensagem.set(''), 3000);
    }, 1000);
  }

  cancelarAlteracaoSenha() {
    this.alterandoSenha.set(false);
    this.senhaAtual.set('');
    this.novaSenha.set('');
    this.confirmarSenha.set('');
  }
}
