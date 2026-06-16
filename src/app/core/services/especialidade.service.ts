import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface espelhando a sua Entity Java
export interface Especialidade {
  id?: number;
  nome: string;
}

// Interface espelhando o seu EspecialidadeDTO
export interface EspecialidadeDTO {
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class EspecialidadeService {
  
  // Altere a porta se o seu Spring Boot não estiver rodando na 8080
  private readonly API_URL = 'http://localhost:8080/especialidades';

  constructor(private readonly http: HttpClient) {}

  // GET /especialidades
  listar(): Observable<Especialidade[]> {
    return this.http.get<Especialidade[]>(this.API_URL);
  }

  // GET /especialidades/{id}
  buscarPorId(id: number): Observable<Especialidade> {
    return this.http.get<Especialidade>(`${this.API_URL}/${id}`);
  }

  // POST /especialidades
  cadastrar(dto: EspecialidadeDTO): Observable<Especialidade> {
    return this.http.post<Especialidade>(this.API_URL, dto);
  }

  // PUT /especialidades/{id}
  atualizar(id: number, dto: EspecialidadeDTO): Observable<Especialidade> {
    return this.http.put<Especialidade>(`${`${this.API_URL}/${id}`}`, dto);
  }

  // DELETE /especialidades/{id}
  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${`${this.API_URL}/${id}`}`);
  }
}