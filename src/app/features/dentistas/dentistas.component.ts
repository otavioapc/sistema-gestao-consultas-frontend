import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DentistaService, Dentista, DentistaDTO } from '../../core/services/dentista.service';
import { EspecialidadeService, Especialidade } from '../../core/services/especialidade.service';
import { TextoUtils } from '../../shared/utils/texto-utils'; 

@Component({
  selector: 'app-dentistas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dentistas.component.html',
  styleUrl: './dentistas.component.scss'
})
export class DentistasComponent implements OnInit {

  dentistaForm: FormGroup;
  exibirModal: boolean = false;
  modoEdicao: boolean = false;
  idDentistaSel: number | null = null;

  listaDentistas: Dentista[] = [];
  listaEspecialidades: Especialidade[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly dentistaService: DentistaService,
    private readonly especialidadeService: EspecialidadeService
  ) {
    this.dentistaForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
      cro: ['', [Validators.required]],
      especialidadesId: [[], [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.dentistaService.listar().subscribe({
      next: (dados) => this.listaDentistas = dados,
      error: (err) => console.error('Erro ao buscar dentistas:', err)
    });

    this.especialidadeService.listar().subscribe({
      next: (dados) => this.listaEspecialidades = dados,
      error: (err) => console.error('Erro ao buscar especialidades:', err)
    });
  }

  abrirModalNovo(): void {
    this.modoEdicao = false;
    this.idDentistaSel = null;
    this.dentistaForm.reset({ especialidadesId: [] });
    this.exibirModal = true;
  }

  abrirModalEditar(dentista: Dentista): void {
    if (dentista.id !== undefined && dentista.ativo) {
      this.modoEdicao = true;
      this.idDentistaSel = dentista.id;

      const idsEspecialidades = dentista.especialidades.map(e => e.id as number);

      this.dentistaForm.patchValue({
        nome: dentista.nome,
        email: dentista.email,
        cpf: dentista.cpf,
        cro: dentista.cro,
        especialidadesId: idsEspecialidades
      });
      this.exibirModal = true;
    }
  }

  fecharModal(): void {
    this.exibirModal = false;
    this.idDentistaSel = null;
    this.dentistaForm.reset();
  }

  onSalvar(): void {
    if (this.dentistaForm.valid) {
      const formValue = this.dentistaForm.value;

      const payload: DentistaDTO = {
        nome: formValue.nome,
        email: formValue.email,
        cpf: formValue.cpf,
        cro: formValue.cro,
        especialidadesId: formValue.especialidadesId.map((id: any) => +id)
      };

      if (this.modoEdicao && this.idDentistaSel !== null) {
        this.dentistaService.atualizar(this.idDentistaSel, payload).subscribe({
          next: () => { this.fecharModal(); this.carregarDados(); },
          error: (err) => console.error('Erro ao atualizar dentista:', err)
        });
      } else {
        this.dentistaService.cadastrar(payload).subscribe({
          next: () => { this.fecharModal(); this.carregarDados(); },
          error: (err) => console.error('Erro ao cadastrar dentista:', err)
        });
      }
    }
  }

  alternarStatus(id: number | undefined): void {
    if (id !== undefined) {
      this.dentistaService.alternarStatus(id).subscribe({
        next: () => this.carregarDados(), 
        error: (err) => console.error('Erro ao alterar status do profissional:', err)
      });
    }
  }

  formatarCPF(cpf: string): string {
    return TextoUtils.formatarCPF(cpf);
  }
}