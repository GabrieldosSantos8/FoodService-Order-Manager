import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario';
import { AuthService } from '../../services/auth.service';

interface UsuarioData {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  senha: string;
}

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css'
})
export class UsuarioFormComponent {
  usuario = signal<UsuarioData>({ 
    nome: '', 
    email: '', 
    telefone: '', 
    senha: '' 
  });

  usuarioCadastrado = signal<UsuarioData | null>(null);
  carregando = signal(false);
  erroMensagem = signal('');
  sucessoMensagem = signal('');

  constructor(private service: UsuarioService, private router: Router, private authService: AuthService) {}

  onSubmit() {
    if (!this.validarFormulario()) {
      return;
    }

    this.carregando.set(true);
    this.erroMensagem.set('');

    this.authService.cadastro(this.usuario() as any).subscribe({
      next: (response) => {
        this.usuarioCadastrado.set(this.usuario());
        this.sucessoMensagem.set('Cadastro realizado com sucesso!');
        this.carregando.set(false);

        // Limpar formulário
        this.usuario.set({ 
          nome: '', 
          email: '', 
          telefone: '', 
          senha: '' 
        });

        // Redirecionar para registrar-endereco após 2 segundos
        // (usuário está logado automaticamente pelo backend)
        setTimeout(() => {
          this.router.navigate(['/registrar-endereco']);
        }, 2000);
      },
      error: (error) => {
        this.carregando.set(false);
        this.erroMensagem.set(error.error?.message || 'Erro ao realizar cadastro');
      }
    });
  }

  validarFormulario(): boolean {
    if (!this.usuario().nome.trim()) {
      this.erroMensagem.set('Nome é obrigatório');
      return false;
    }

    if (!this.usuario().email.trim()) {
      this.erroMensagem.set('Email é obrigatório');
      return false;
    }

    if (!this.validarEmail(this.usuario().email)) {
      this.erroMensagem.set('Email inválido');
      return false;
    }

    if (!this.usuario().telefone.trim()) {
      this.erroMensagem.set('Telefone é obrigatório');
      return false;
    }

    if (!this.usuario().senha.trim()) {
      this.erroMensagem.set('Senha é obrigatória');
      return false;
    }

    if (this.usuario().senha.length < 6) {
      this.erroMensagem.set('Senha deve ter no mínimo 6 caracteres');
      return false;
    }

    return true;
  }

  validarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  novosCadastro() {
    this.usuarioCadastrado.set(null);
    this.sucessoMensagem.set('');
    this.erroMensagem.set('');
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }
}
