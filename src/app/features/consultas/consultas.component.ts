import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-consultas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './consultas.component.html',
  styleUrl: './consultas.component.scss'
})
export class ConsultasComponent {

  agendamentoForm: FormGroup;
  cancelamentoForm: FormGroup;
  
  exibirModalAgendamento: boolean = false;
  exibirModalCancelamento: boolean = false;
  modoEdicao: boolean = false;
  idConsultaSel: number | null = null;

  // Listas de apoio para alimentar os seletores (Selects) do formulário
  pacientesMock = [{ id: 124, nome: 'Marcela Tadeu Vieira' }, { id: 125, nome: 'Carlos Henrique Dias' }, { id: 126, nome: 'Amanda Souza' }];
  dentistasMock = [{ id: 1, nome: 'Dr. Carlos Pedroso' }, { id: 2, nome: 'Dra. Ana Silva' }];

  // Lista de Consultas simulando o retorno do seu @Get Mappings
  listaConsultas = [
    { id: 10, dataInicio: '2026-06-16T09:00:00', dataFim: '2026-06-16T10:00:00', idPaciente: 124, pacienteNome: 'Marcela Tadeu Vieira', cpf: '123.***.***-00', idDentista: 1, dentistaNome: 'Dr. Carlos Pedroso', idUsuario: 1, descricao: 'Manutenção de Aparelho Ortodôntico', status: 'Confirmado', motivoCancelamento: '' },
    { id: 11, dataInicio: '2026-06-17T14:30:00', dataFim: '2026-06-17T15:30:00', idPaciente: 125, pacienteNome: 'Carlos Henrique Dias', cpf: '456.***.***-11', idDentista: 2, dentistaNome: 'Dra. Ana Silva', idUsuario: 1, descricao: 'Clínica Geral - Limpeza', status: 'Pendente', motivoCancelamento: '' },
    { id: 12, dataInicio: '2026-06-15T11:00:00', dataFim: '2026-06-15T12:00:00', idPaciente: 126, pacienteNome: 'Amanda Souza', cpf: '789.***.***-22', idDentista: 1, dentistaNome: 'Dr. Carlos Pedroso', idUsuario: 1, descricao: 'Odontopediatria - Avaliação', status: 'Cancelado', motivoCancelamento: 'Imprevisto pessoal' }
  ];

  constructor(private readonly fb: FormBuilder) {
    // Espelho exato do seu ConsultaDTO / ConsultaUpdateDTO
    this.agendamentoForm = this.fb.group({
      idPaciente: ['', [Validators.required]],
      idDentista: ['', [Validators.required]],
      idUsuario: [1, [Validators.required]], // Simula o ID do admin logado
      descricao: ['', [Validators.required, Validators.minLength(5)]],
      dataInicio: ['', [Validators.required]],
      dataFim: ['', [Validators.required]]
    });

    this.cancelamentoForm = this.fb.group({
      motivo: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  abrirNovoAgendamento(): void {
    this.modoEdicao = false;
    this.agendamentoForm.reset({ idUsuario: 1 }); // Mantém o usuário logado padrão
    this.exibirModalAgendamento = true;
  }

  abrirEdicao(consulta: any): void {
    if (consulta.status === 'Cancelado') return;
    this.modoEdicao = true;
    this.idConsultaSel = consulta.id;
    
    this.agendamentoForm.patchValue({
      idPaciente: consulta.idPaciente,
      idDentista: consulta.idDentista,
      idUsuario: consulta.idUsuario,
      descricao: consulta.descricao,
      dataInicio: consulta.dataInicio,
      dataFim: consulta.dataFim
    });
    this.exibirModalAgendamento = true;
  }

  abrirCancelamento(consulta: any): void {
    this.idConsultaSel = consulta.id;
    this.cancelamentoForm.reset();
    this.exibirModalCancelamento = true;
  }

  fecharModais(): void {
    this.exibirModalAgendamento = false;
    this.exibirModalCancelamento = false;
    this.idConsultaSel = null;
  }

  onSalvarAgendamento(): void {
    if (this.agendamentoForm.valid) {
      const valores = this.agendamentoForm.value;
      const paciente = this.pacientesMock.find(p => p.id === +valores.idPaciente);
      const dentista = this.dentistasMock.find(d => d.id === +valores.idDentista);

      if (this.modoEdicao && this.idConsultaSel !== null) {
        const index = this.listaConsultas.findIndex(c => c.id === this.idConsultaSel);
        if (index !== -1) {
          this.listaConsultas[index] = {
            ...this.listaConsultas[index],
            idPaciente: +valores.idPaciente,
            pacienteNome: paciente ? paciente.nome : '',
            idDentista: +valores.idDentista,
            dentistaNome: dentista ? dentista.nome : '',
            descricao: valores.descricao,
            dataInicio: valores.dataInicio,
            dataFim: valores.dataFim
          };
        }
      } else {
        // Simulação perfeita do Payload enviado no POST
        this.listaConsultas.push({
          id: Math.floor(Math.random() * 90) + 20,
          dataInicio: valores.dataInicio,
          dataFim: valores.dataFim,
          idPaciente: +valores.idPaciente,
          pacienteNome: paciente ? paciente.nome : '',
          cpf: '000.***.***-00',
          idDentista: +valores.idDentista,
          dentistaNome: dentista ? dentista.nome : '',
          idUsuario: valores.idUsuario,
          descricao: valores.descricao,
          status: 'Pendente',
          motivoCancelamento: ''
        });
      }
      this.fecharModais();
    }
  }

  onConfirmarCancelamento(): void {
    if (this.cancelamentoForm.valid && this.idConsultaSel !== null) {
      const motivoDigitado = this.cancelamentoForm.value.motivo;
      const index = this.listaConsultas.findIndex(c => c.id === this.idConsultaSel);
      
      if (index !== -1) {
        this.listaConsultas[index].status = 'Cancelado';
        this.listaConsultas[index].motivoCancelamento = motivoDigitado;
      }
      this.fecharModais();
    }
  }

  // Extrai e formata o horário inicial a partir do LocalDateTime iso string
  extrairHora(localDateTimeStr: string): string {
    if (!localDateTimeStr) return '';
    const partes = localDateTimeStr.split('T');
    if (partes.length < 2) return localDateTimeStr;
    return partes[1].substring(0, 5); // Retorna "HH:mm"
  }

  // Formata o LocalDateTime para exibição na tabela como "dd/MM/yyyy"
  formatarData(localDateTimeStr: string): string {
    if (!localDateTimeStr) return '';
    const dataApenas = localDateTimeStr.split('T')[0];
    const partes = dataApenas.split('-');
    if (partes.length !== 3) return localDateTimeStr;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
}