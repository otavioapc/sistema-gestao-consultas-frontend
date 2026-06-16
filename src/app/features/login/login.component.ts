import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
  loginForm: FormGroup;
  mensagemErro: string = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

onSubmit(): void {
    if (this.loginForm.valid) {
      this.mensagemErro = ''; 
      
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (resposta) => {
          console.log('Login efetuado com sucesso! Token salvo.');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error(err);
          this.mensagemErro = 'Credenciais inválidas. Verifique seu e-mail e senha.';
        }
      });
    }
  }
}