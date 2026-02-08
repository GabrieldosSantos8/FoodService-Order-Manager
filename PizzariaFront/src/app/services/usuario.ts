import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // Use a porta exata da sua imagem (5064)
  private readonly API = 'http://localhost:5064/api/Usuario';

  constructor(private http: HttpClient) { }

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API);
  }

  salvar(record: Partial<Usuario>): Observable<Usuario> {
    return this.http.post<Usuario>(this.API, record);
  }
}