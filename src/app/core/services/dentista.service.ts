import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Especialidade } from './especialidade.service';

export interface Dentista {
  id?: number;
  nome: string;
  cpf: string;
  email: string;
  cro: string;
  ativo: boolean;
  especialidades: Especialidade[]; // O que o Java DEVOLVE no GET
  dataCriacao?: string;
}

export interface DentistaDTO {
  nome: string;
  email: string;
  cpf: string;
  cro: string;
  especialidadesId: number[]; // O que o Java ESPERA no POST/PUT
}

@Injectable({
  providedIn: 'root'
})
export class DentistaService {

  private readonly API_URL = 'http://localhost:8080/dentistas';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Dentista[]> {
    return this.http.get<Dentista[]>(this.API_URL);
  }

  buscarPorId(id: number): Observable<Dentista> {
    return this.http.get<Dentista>(`${this.API_URL}/${id}`);
  }

  cadastrar(dto: DentistaDTO): Observable<Dentista> {
    return this.http.post<Dentista>(this.API_URL, dto);
  }

  atualizar(id: number, dto: DentistaDTO): Observable<Dentista> {
    return this.http.put<Dentista>(`${this.API_URL}/${id}`, dto);
  }

  // Aciona o seu método service do Java que manipula a exclusão lógica/desativação
  alternarStatus(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}