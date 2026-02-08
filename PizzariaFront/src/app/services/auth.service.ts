import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api'; // Ajuste conforme necessário

  usuarioLogado = signal<Usuario | null>(null);
  estaLogado = signal(false);

  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {
    this.carregarUsuarioDoLocalStorage();
  }

  login(email: string, senha: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/usuario/login`, { email, senha })
      .pipe(
        tap(response => {
          // Guardar token no localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('usuario', JSON.stringify(response.usuario));
          
          // Atualizar signals
          this.usuarioLogado.set(response.usuario);
          this.estaLogado.set(true);
          this.usuarioSubject.next(response.usuario);
        })
      );
  }

  cadastro(usuario: any): Observable<LoginResponse> {
    const { senha, ...usuarioData } = usuario;
    return this.http.post<LoginResponse>(`${this.apiUrl}/usuario/cadastro`, 
      { ...usuarioData, senha }
    ).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('usuario', JSON.stringify(response.usuario));
        
        this.usuarioLogado.set(response.usuario);
        this.estaLogado.set(true);
        this.usuarioSubject.next(response.usuario);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuarioLogado.set(null);
    this.estaLogado.set(false);
    this.usuarioSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  carregarUsuarioDoLocalStorage(): void {
    const usuarioData = localStorage.getItem('usuario');
    if (usuarioData) {
      try {
        const usuario = JSON.parse(usuarioData);
        this.usuarioLogado.set(usuario);
        this.estaLogado.set(true);
        this.usuarioSubject.next(usuario);
      } catch (e) {
        console.error('Erro ao carregar usuário do localStorage', e);
      }
    }
  }

  estaAutenticado(): boolean {
    return !!this.getToken() && this.estaLogado();
  }
}
