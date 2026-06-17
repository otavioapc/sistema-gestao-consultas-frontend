import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConsultaService, Consulta, ConsultaDTO, ConsultaUpdateDTO } from '../../core/services/consulta.service';
import { PacienteService, Paciente } from '../../core/services/paciente.service';
import { DentistaService, Dentista } from '../../core/services/dentista.service';
import { TextoUtils } from '../../shared/utils/texto-utils';

@Component({
  selector: 'app-consultas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './consultas.component.html',
  styleUrl: './consultas.component.scss'
})
export class ConsultasComponent implements OnInit {

  agendamentoForm: FormGroup;
  cancelamentoForm: FormGroup;
  
  exibirModalAgendamento: boolean = false;
  exibirModalCancelamento: boolean = false;
  modoEdicao: boolean = false;
  idConsultaSel: number | null = null;
  statusEdicaoSel: 'AGENDADA' | 'CANCELADA' | 'FINALIZADA' = 'AGENDADA';

  listaConsultas: Consulta[] = [];
  listaPacientes: Paciente[] = [];
  listaDentistas: Dentista[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly consultaService: ConsultaService,
    private readonly pacienteService: PacienteService,
    private readonly dentistaService: DentistaService
  ) {
    this.agendamentoForm = this.fb.group({
      idPaciente: ['', [Validators.required]],
      idDentista: ['', [Validators.required]],
      idUsuario: [8, [Validators.required]], 
      descricao: ['', [Validators.required, Validators.minLength(5)]],
      dataInicio: ['', [Validators.required]],
      dataFim: ['', [Validators.required]]
    });

    this.cancelamentoForm = this.fb.group({
      motivo: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit(): void {
    this.carregarTodosOsDados();
  }

  carregarTodosOsDados(): void {
    this.consultaService.listar().subscribe({
      next: (dados) => this.listaConsultas = dados,
      error: (err) => console.error('Erro ao listar consultas:', err)
    });

    this.pacienteService.listar().subscribe({
      next: (dados) => this.listaPacientes = dados,
      error: (err) => console.error('Erro ao listar pacientes:', err)
    });

    this.dentistaService.listar().subscribe({
      next: (dados) => this.listaDentistas = dados,
      error: (err) => console.error('Erro ao listar dentistas:', err)
    });
  }

  abrirNovoAgendamento(): void {
    this.modoEdicao = false;
    this.idConsultaSel = null;
    this.agendamentoForm.reset({ idUsuario: 1 });
    this.exibirModalAgendamento = true;
  }

  abrirEdicao(consulta: Consulta): void {
    if (consulta.id !== undefined && consulta.status === 'AGENDADA') {
      this.modoEdicao = true;
      this.idConsultaSel = consulta.id;
      this.statusEdicaoSel = consulta.status;
      
      this.agendamentoForm.patchValue({
        idPaciente: consulta.paciente.id,
        idDentista: consulta.dentista.id,
        idUsuario: consulta.usuario.id,
        descricao: consulta.descricao,
        dataInicio: consulta.dataInicio,
        dataFim: consulta.dataFim
      });
      this.exibirModalAgendamento = true;
    }
  }

  abrirCancelamento(consulta: Consulta): void {
    if (consulta.id !== undefined) {
      this.idConsultaSel = consulta.id;
      this.cancelamentoForm.reset();
      this.exibirModalCancelamento = true;
    }
  }

  fecharModais(): void {
    this.exibirModalAgendamento = false;
    this.exibirModalCancelamento = false;
    this.idConsultaSel = null;
  }

  onSalvarAgendamento(): void {
    if (this.agendamentoForm.valid) {
      const formValue = this.agendamentoForm.value;

      if (this.modoEdicao && this.idConsultaSel !== null) {
        const payloadUpdate: { idPaciente: number; idDentista: number; idUsuario: number; descricao: string; dataInicio: string; dataFim: string; status: "AGENDADA" | "CANCELADA" | "FINALIZADA" } = {
          idPaciente: +formValue.idPaciente,
          idDentista: +formValue.idDentista,
          idUsuario: +formValue.idUsuario,
          descricao: formValue.descricao,
          dataInicio: formValue.dataInicio,
          dataFim: formValue.dataFim,
          status: this.statusEdicaoSel
        };

        this.consultaService.atualizar(this.idConsultaSel, payloadUpdate).subscribe({
          next: () => { this.fecharModais(); this.carregarTodosOsDados(); },
          error: (err) => alert(err.error?.message || 'Erro ao reagendar consulta.')
        });
      } else {
        const payloadCreate: ConsultaDTO = {
          idPaciente: +formValue.idPaciente,
          idDentista: +formValue.idDentista,
          idUsuario: +formValue.idUsuario,
          descricao: formValue.descricao,
          dataInicio: formValue.dataInicio,
          dataFim: formValue.dataFim
        };

        this.consultaService.cadastrar(payloadCreate).subscribe({
          next: () => { this.fecharModais(); this.carregarTodosOsDados(); },
          error: (err) => alert(err.error?.message || 'Erro ao agendar consulta.')
        });
      }
    }
  }

  onConfirmarCancelamento(): void {
    if (this.cancelamentoForm.valid && this.idConsultaSel !== null) {
      const payloadCancel = {
        motivoCancelamento: this.cancelamentoForm.value.motivo
      };

      this.consultaService.cancelar(this.idConsultaSel, payloadCancel).subscribe({
        next: () => { this.fecharModais(); this.carregarTodosOsDados(); },
        error: (err) => alert(err.error?.message || 'Erro ao cancelar consulta.')
      });
    }
  }

  extrairHora(localDateTimeStr: string): string {
    if (!localDateTimeStr) return '';
    const partes = localDateTimeStr.split('T');
    return partes.length < 2 ? localDateTimeStr : partes[1].substring(0, 5);
  }

  formatarData(localDateTimeStr: string): string {
    if (!localDateTimeStr) return '';
    const dataApenas = localDateTimeStr.split('T')[0];
    const partes = dataApenas.split('-');
    return partes.length !== 3 ? localDateTimeStr : `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  formatarCPF(cpf: string): string {
    return TextoUtils.formatarCPF(cpf);
  }
}