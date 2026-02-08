import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { UsuarioService } from '../../services/usuario'; // Certifique-se que o caminho está correto
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  listaUsuarios = signal<Usuario[]>([]);
  mostarUsuarios = signal(false);

  constructor(private service: UsuarioService) {}

  ngOnInit(): void {
    // Busca os pizzaiolos assim que a tela abre
    this.service.listar().subscribe({
      next: (dados) => this.listaUsuarios.set(dados),
      error: (err) => console.error('Erro na API:', err)
    });
  }
}
