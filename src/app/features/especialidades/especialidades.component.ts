import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EspecialidadeService, Especialidade } from '../../core/services/especialidade.service'; 

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './especialidades.component.html',
  styleUrl: './especialidades.component.scss'
})
export class EspecialidadesComponent implements OnInit {
  
  cadastroForm: FormGroup;
  edicaoForm: FormGroup;
  idEspecialidadeSel: number | null = null;
  exibirModal: boolean = false;
  
  // Lista que agora será preenchida pelos dados vindos do Java
  listaEspecialidades: Especialidade[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly especialidadeService: EspecialidadeService // Injeção do serviço HTTP
  ) {
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.edicaoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.carregarEspecialidades(); // Carrega os dados assim que a tela abre
  }

  // Consome o GET /especialidades da sua API
  carregarEspecialidades(): void {
    this.especialidadeService.listar().subscribe({
      next: (dados) => this.listaEspecialidades = dados,
      error: (err) => console.error('Erro ao carregar especialidades do banco:', err)
    });
  }

  // Consome o POST /especialidades
  onCadastrar(): void {
    if (this.cadastroForm.valid) {
      const payload = { nome: this.cadastroForm.value.nome };
      
      this.especialidadeService.cadastrar(payload).subscribe({
        next: () => {
          this.cadastroForm.reset();
          this.carregarEspecialidades(); // Recarrega a tabela com o dado novo do banco
        },
        error: (err) => console.error('Erro ao cadastrar:', err)
      });
    }
  }

  prepararEdicao(especialidade: Especialidade): void {
    if (especialidade.id !== undefined) {
      this.idEspecialidadeSel = especialidade.id;
      this.edicaoForm.patchValue({ nome: especialidade.nome });
      this.exibirModal = true;
    }
  }

  fecharModal(): void {
    this.exibirModal = false;
    this.idEspecialidadeSel = null;
    this.edicaoForm.reset();
  }

  // Consome o PUT /especialidades/{id}
  onAtualizar(): void {
    if (this.edicaoForm.valid && this.idEspecialidadeSel !== null) {
      const payload = { nome: this.edicaoForm.value.nome };

      this.especialidadeService.atualizar(this.idEspecialidadeSel, payload).subscribe({
        next: () => {
          this.fecharModal();
          this.carregarEspecialidades(); // Recarrega com os dados atualizados
        },
        error: (err) => console.error('Erro ao atualizar:', err)
      });
    }
  }

  // Consome o DELETE /especialidades/{id}
  onDeletar(id: number | undefined): void {
    if (id !== undefined && confirm('Deseja realmente excluir esta especialidade?')) {
      this.especialidadeService.deletar(id).subscribe({
        next: () => this.carregarEspecialidades(),
        error: (err) => console.error('Erro ao deletar:', err)
      });
    }
  }
}