import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Paciente {
  id?: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  dataCriacao?: string;
}

export interface PacienteDTO {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
}

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private readonly API_URL = 'http://localhost:8080/pacientes';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.API_URL);
  }

  buscarPorId(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.API_URL}/${id}`);
  }

  cadastrar(dto: PacienteDTO): Observable<Paciente> {
    return this.http.post<Paciente>(this.API_URL, dto);
  }

  atualizar(id: number, dto: PacienteDTO): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.API_URL}/${id}`, dto);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}