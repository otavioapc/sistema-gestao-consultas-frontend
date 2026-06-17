import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService, Paciente } from '../../core/services/paciente.service'; 
import { TextoUtils } from '../../shared/utils/texto-utils';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.scss'
})
export class PacientesComponent implements OnInit {

  pacienteForm: FormGroup;
  exibirModal: boolean = false;
  modoEdicao: boolean = false;
  idPacienteSel: number | null = null;
  
  listaPacientes: Paciente[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly pacienteService: PacienteService
  ) {
    this.pacienteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
      telefone: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.carregarPacientes();
  }

  carregarPacientes(): void {
    this.pacienteService.listar().subscribe({
      next: (dados) => this.listaPacientes = dados,
      error: (err) => console.error('Erro ao buscar pacientes do banco:', err)
    });
  }

  abrirModalNovo(): void {
    this.modoEdicao = false;
    this.idPacienteSel = null;
    this.pacienteForm.reset();
    this.exibirModal = true;
  }

  abrirModalEditar(paciente: Paciente): void {
    if (paciente.id !== undefined) {
      this.modoEdicao = true;
      this.idPacienteSel = paciente.id;
      
      this.pacienteForm.patchValue({
        nome: paciente.nome,
        email: paciente.email,
        cpf: paciente.cpf,
        telefone: paciente.telefone
      });
      this.exibirModal = true;
    }
  }

  fecharModal(): void {
    this.exibirModal = false;
    this.idPacienteSel = null;
    this.pacienteForm.reset();
  }

  onSalvar(): void {
    if (this.pacienteForm.valid) {
      const payload = this.pacienteForm.value;

      if (this.modoEdicao && this.idPacienteSel !== null) {
        this.pacienteService.atualizar(this.idPacienteSel, payload).subscribe({
          next: () => {
            this.fecharModal();
            this.carregarPacientes();
          },
          error: (err) => console.error('Erro ao atualizar paciente:', err)
        });
      } else {
        this.pacienteService.cadastrar(payload).subscribe({
          next: () => {
            this.fecharModal();
            this.carregarPacientes();
          },
          error: (err) => console.error('Erro ao cadastrar paciente:', err)
        });
      }
    }
  }

  onDeletar(id: number | undefined): void {
    if (id !== undefined && confirm('Deseja realmente remover permanentemente este paciente do banco de dados?')) {
      this.pacienteService.deletar(id).subscribe({
        next: () => this.carregarPacientes(),
        error: (err) => console.error('Erro ao deletar paciente:', err)
      });
    }
  }

  getIniciais(nome: string): string {
    if (!nome) return 'PA';
    return nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }

  formatarCPF(cpf: string): string {
    return TextoUtils.formatarCPF(cpf);
  }

  formatarTelefone(tel: string): string {
    return TextoUtils.formatarTelefone(tel);
  }

}