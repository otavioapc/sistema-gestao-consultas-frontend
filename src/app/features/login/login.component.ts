import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
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
    private readonly router: Router
  ) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  // Método que o botão "Entrar" vai disparar
  onSubmit(): void {
    if (this.loginForm.valid) {
      const dadosLogin = this.loginForm.value;
      console.log('Dados preenchidos no formulário:', dadosLogin);
      
      // TODO: Conectar com o back-end nos próximos passos
      this.router.navigate(['/dashboard']);
    } else {
      this.mensagemErro = 'Por favor, preencha todos os campos corretamente.';
    }
  }
}
