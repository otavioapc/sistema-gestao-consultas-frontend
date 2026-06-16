import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {

  usuarioForm: FormGroup;
  exibirModal: boolean = false;
  modoEdicao: boolean = false;
  idUsuarioSel: number | null = null;

  listaUsuarios = [
    { id: 1, nome: 'Otávio Augusto', cpf: '111.222.333-44', email: 'otavio.augusto@vestaplan.com', perfil: 'ADMINISTRADOR', ativo: true },
    { id: 2, nome: 'Marcela Tadeu', cpf: '222.333.444-55', email: 'marcela.tadeu@vestaplan.com', perfil: 'RECEPCIONISTA', ativo: true },
    { id: 3, nome: 'Carlos Pedroso', cpf: '333.444.554-66', email: 'carlos.pedroso@vestaplan.com', perfil: 'PROFISSIONAL', ativo: true }
  ];

  constructor(private readonly fb: FormBuilder) {
    this.usuarioForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
      cpf: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      perfil: ['', [Validators.required]]
    });
  }

  abrirModalNovo(): void {
    this.modoEdicao = false;
    this.usuarioForm.reset();
    
    this.usuarioForm.get('senha')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.usuarioForm.get('senha')?.updateValueAndValidity();
    
    this.exibirModal = true;
  }

  abrirModalEditar(usuario: any): void {
    this.modoEdicao = true;
    this.idUsuarioSel = usuario.id;
    this.usuarioForm.get('senha')?.clearValidators();
    this.usuarioForm.get('senha')?.updateValueAndValidity();

    this.usuarioForm.patchValue({
      nome: usuario.nome,
      cpf: usuario.cpf,
      email: usuario.email,
      senha: '',
      perfil: usuario.perfil
    });
    this.exibirModal = true;
  }

  fecharModal(): void {
    this.exibirModal = false;
    this.idUsuarioSel = null;
    this.usuarioForm.reset();
  }

  alternarBloqueio(usuario: any): void {
    if (usuario.id === 1) {
      alert("Ação de segurança: Você não pode bloquear o seu próprio usuário Administrador principal!");
      return;
    }
    usuario.ativo = !usuario.ativo;
  }

  onSalvar(): void {
    if (this.usuarioForm.valid) {
      const dadosForm = this.usuarioForm.value;

      if (this.modoEdicao && this.idUsuarioSel !== null) {
        const index = this.listaUsuarios.findIndex(u => u.id === this.idUsuarioSel);
        if (index !== -1) {
          this.listaUsuarios[index] = {
            ...this.listaUsuarios[index],
            nome: dadosForm.nome,
            cpf: dadosForm.cpf,
            email: dadosForm.email,
            perfil: dadosForm.perfil
          };
        }
      } else {
        const novoId = this.listaUsuarios.length + 1;
        this.listaUsuarios.push({
          id: novoId,
          nome: dadosForm.nome,
          cpf: dadosForm.cpf,
          email: dadosForm.email,
          perfil: dadosForm.perfil,
          ativo: true
        });
      }

      this.fecharModal();
    }
  }

  getIniciais(nome: string): string {
    return nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }
}