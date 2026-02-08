import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})
export class LoginComponent {
  email = signal('');
  senha = signal('');
  carregando = signal(false);
  mensagemErro = signal('');

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    if (!this.email() || !this.senha()) {
      this.mensagemErro.set('Email e senha são obrigatórios');
      return;
    }

    this.carregando.set(true);
    this.mensagemErro.set('');

    this.authService.login(this.email(), this.senha()).subscribe({
      next: (response) => {
        this.carregando.set(false);
        // Redirecionar para registrar endereço se for novo usuário
        const temEndereco = localStorage.getItem('endereco_casa');
        if (!temEndereco) {
          this.router.navigate(['/registrar-endereco']);
        } else {
          this.router.navigate(['/cardapio']);
        }
      },
      error: (error) => {
        this.carregando.set(false);
        this.mensagemErro.set(error.error?.message || 'Email ou senha inválidos');
      }
    });
  }
}
