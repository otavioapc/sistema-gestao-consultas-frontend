import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from './paciente.service';
import { Dentista } from './dentista.service';

export interface Consulta {
  id?: number;
  paciente: Paciente;
  dentista: Dentista;
  usuario: any;
  descricao: string;
  motivoCancelamento?: string;
  dataInicio: string;
  dataFim: string;
  status: 'AGENDADA' | 'CANCELADA' | 'FINALIZADA'; // Casado com o seu StatusConsulta.java
  dataRegistro?: string;
}

export interface ConsultaDTO {
  idPaciente: number;
  idDentista: number;
  idUsuario: number;
  descricao: string;
  dataInicio: string;
  dataFim: string;
}

export interface ConsultaUpdateDTO extends ConsultaDTO {
  status: 'AGENDADA' | 'CANCELADA' | 'FINALIZADA';
}

export interface ConsultaCancelamentoDTO {
  motivoCancelamento: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  private readonly API_URL = 'http://localhost:8080/consultas';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(this.API_URL);
  }

  buscarPorId(id: number): Observable<Consulta> {
    return this.http.get<Consulta>(`${this.API_URL}/${id}`);
  }

  cadastrar(dto: ConsultaDTO): Observable<Consulta> {
    return this.http.post<Consulta>(this.API_URL, dto);
  }

  atualizar(id: number, dto: ConsultaUpdateDTO): Observable<Consulta> {
    return this.http.put<Consulta>(`${this.API_URL}/${id}`, dto);
  }

  cancelar(id: number, dto: ConsultaCancelamentoDTO): Observable<Consulta> {
    return this.http.put<Consulta>(`${this.API_URL}/${id}/cancelar`, dto);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}