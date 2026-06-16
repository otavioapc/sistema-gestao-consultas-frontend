import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = 'http://localhost:8080';

  constructor(private readonly http: HttpClient) { }

  login(credenciais: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, credenciais).pipe(
      tap(resposta => {
        // Se a API retornar o token com sucesso, guardamos no localStorage
        if (resposta && resposta.token) {
          localStorage.setItem('vestaplan_token', resposta.token);
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('vestaplan_token');
  }

  logout(): void {
    localStorage.removeItem('vestaplan_token');
  }
}