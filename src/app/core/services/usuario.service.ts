import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id?: number;
  nome: string;
  cpf: string;
  email: string;
  perfil: 'ADMIN' | 'DENTISTA'; 
  ativo: boolean;
  dataCriacao?: string;
  ultimoAcesso?: string;
}

export interface UsuarioDTO {
  nome: string;
  cpf: string;
  email: string;
  senha?: string;
  perfil: 'ADMIN' | 'DENTISTA';
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly API_URL = 'http://localhost:8080/usuarios';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API_URL);
  }

  buscarPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/${id}`);
  }

  cadastrar(dto: UsuarioDTO): Observable<Usuario> {
    return this.http.post<Usuario>(this.API_URL, dto);
  }

  atualizar(id: number, dto: UsuarioDTO): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API_URL}/${id}`, dto);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}