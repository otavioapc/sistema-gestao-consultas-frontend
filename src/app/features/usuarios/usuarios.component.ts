import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService, Usuario, UsuarioDTO } from '../../core/services/usuario.service';
import { TextoUtils } from '../../shared/utils/texto-utils';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {

  usuarioForm: FormGroup;
  exibirModal: boolean = false;
  modoEdicao: boolean = false;
  idUsuarioSel: number | null = null;
  
  listaUsuarios: Usuario[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly usuarioService: UsuarioService
  ) {
    this.usuarioForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(6)]],
      cpf: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      perfil: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (dados) => this.listaUsuarios = dados,
      error: (err) => console.error('Erro ao buscar usuários:', err)
    });
  }

  abrirModalNovo(): void {
    this.modoEdicao = false;
    this.idUsuarioSel = null;
    this.usuarioForm.reset({ perfil: '' });
    this.usuarioForm.get('senha')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.usuarioForm.get('senha')?.updateValueAndValidity();
    this.exibirModal = true;
  }

  abrirModalEditar(user: Usuario): void {
    if (user.id !== undefined) {
      this.modoEdicao = true;
      this.idUsuarioSel = user.id;
      
      this.usuarioForm.patchValue({
        nome: user.nome,
        cpf: user.cpf,
        email: user.email,
        perfil: user.perfilUsuario,
        senha: ''
      });

      this.usuarioForm.get('senha')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.usuarioForm.get('senha')?.updateValueAndValidity();
      
      this.exibirModal = true;
    }
  }

  fecharModal(): void {
    this.exibirModal = false;
    this.idUsuarioSel = null;
    this.usuarioForm.reset();
  }

  onSalvar(): void {
    if (this.usuarioForm.valid) {
      const payload: UsuarioDTO = this.usuarioForm.value;

      if (this.modoEdicao && this.idUsuarioSel !== null) {
        this.usuarioService.atualizar(this.idUsuarioSel, payload).subscribe({
          next: () => { this.fecharModal(); this.carregarUsuarios(); },
          error: (err) => alert(err.error?.message || 'Erro ao atualizar usuário.')
        });
      } else {
        this.usuarioService.cadastrar(payload).subscribe({
          next: () => { this.fecharModal(); this.carregarUsuarios(); },
          error: (err) => alert(err.error?.message || 'Erro ao cadastrar usuário.')
        });
      }
    }
  }

  onDeletar(id: number | undefined): void {
    if (id !== undefined && confirm('Tem certeza de que deseja remover permanentemente este usuário da aplicação?')) {
      this.usuarioService.deletar(id).subscribe({
        next: () => this.carregarUsuarios(),
        error: (err) => console.error('Erro ao deletar usuário:', err)
      });
    }
  }

  formatarCPF(cpf: string): string {
    return TextoUtils.formatarCPF(cpf);
  }

  getIniciais(nome: string): string {
    if (!nome) return 'US';
    return nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }
}