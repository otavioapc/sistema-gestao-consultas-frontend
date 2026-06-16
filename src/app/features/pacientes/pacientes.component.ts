import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule], // 🌟 Módulos essenciais ativados!
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.scss'
})
export class PacientesComponent {

  pacienteForm: FormGroup;
  exibirModal: boolean = false;
  modoEdicao: boolean = false;
  idPacienteSel: number | null = null;

  // Nossa lista dinâmica de Mocks baseada no seu HTML
  listaPacientes = [
    { id: 124, nome: 'Marcela Tadeu Vieira', cpf: '123.456.789-00', telefone: '(11) 98765-4321', email: 'marcela.vieira@email.com', ultimaConsulta: '16/06/2026' },
    { id: 125, nome: 'Carlos Henrique Dias', cpf: '456.789.123-11', telefone: '(11) 99988-7766', email: 'carlos.dias@email.com', ultimaConsulta: '17/06/2026' },
    { id: 126, nome: 'Amanda Souza', cpf: '789.123.456-22', telefone: '(11) 91234-5678', email: 'amanda.souza@email.com', ultimaConsulta: '15/06/2026' }
  ];

  constructor(private readonly fb: FormBuilder) {
    // Validações básicas alinhadas com o edital
    this.pacienteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]], // Valida formato 000.000.000-00
      telefone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Abre o modal limpo para cadastrar novo
  abrirModalNovo(): void {
    this.modoEdicao = false;
    this.pacienteForm.reset();
    this.exibirModal = true;
  }

  // Abre o modal preenchido para editar
  abrirModalEditar(paciente: any): void {
    this.modoEdicao = true;
    this.idPacienteSel = paciente.id;
    this.pacienteForm.patchValue({
      nome: paciente.nome,
      cpf: paciente.cpf,
      telefone: paciente.telefone,
      email: paciente.email
    });
    this.exibirModal = true;
  }

  fecharModal(): void {
    this.exibirModal = false;
    this.idPacienteSel = null;
    this.pacienteForm.reset();
  }

  // Centraliza a ação de salvar (Novo ou Editar)
  onSalvar(): void {
    if (this.pacienteForm.valid) {
      const dadosForm = this.pacienteForm.value;

      if (this.modoEdicao && this.idPacienteSel !== null) {
        // Lógica de Edição no Mock
        const index = this.listaPacientes.findIndex(p => p.id === this.idPacienteSel);
        if (index !== -1) {
          this.listaPacientes[index] = {
            ...this.listaPacientes[index],
            nome: dadosForm.nome,
            cpf: dadosForm.cpf,
            telefone: dadosForm.telefone,
            email: dadosForm.email
          };
        }
      } else {
        // Lógica de Cadastro no Mock
        const novoId = Math.floor(Math.random() * 90000) + 10000; // Gera ID fictício de 5 dígitos
        this.listaPacientes.push({
          id: novoId,
          nome: dadosForm.nome,
          cpf: dadosForm.cpf,
          telefone: dadosForm.telefone,
          email: dadosForm.email,
          ultimaConsulta: 'Sem consultas'
        });
      }

      this.fecharModal();
    }
  }

  // Remove o paciente da lista simulada
  onExcluir(id: number): void {
    this.listaPacientes = this.listaPacientes.filter(p => p.id !== id);
  }

  // Função auxiliar para pegar as iniciais do avatar dinamicamente
  getIniciais(nome: string): string {
    return nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }
}