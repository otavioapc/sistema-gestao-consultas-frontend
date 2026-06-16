import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './especialidades.component.html',
  styleUrl: './especialidades.component.scss'
})
export class EspecialidadesComponent {
  
  cadastroForm: FormGroup;
  edicaoForm: FormGroup;
  idEspecialidadeSel: number | null = null;
  exibirModal: boolean = false; 

  listaEspecialidades = [
    { id: 1, nome: 'Ortodontia' },
    { id: 2, nome: 'Endodontia' },
    { id: 3, nome: 'Odontopediatria' }
  ];

  constructor(private readonly fb: FormBuilder) {

    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.edicaoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onCadastrar(): void {
    if (this.cadastroForm.valid) {
      const novoId = this.listaEspecialidades.length + 1;
      this.listaEspecialidades.push({ id: novoId, nome: this.cadastroForm.value.nome });
      this.cadastroForm.reset();
    }
  }

  abrirModalEdicao(especialidade: any): void {
    this.idEspecialidadeSel = especialidade.id;
    this.edicaoForm.patchValue({
      nome: especialidade.nome
    });
    this.exibirModal = true;
  }

  fecharModal(): void {
    this.exibirModal = false;
    this.idEspecialidadeSel = null;
    this.edicaoForm.reset();
  }

  onAtualizar(): void {
    if (this.edicaoForm.valid && this.idEspecialidadeSel !== null) {
      const index = this.listaEspecialidades.findIndex(e => e.id === this.idEspecialidadeSel);
      if (index !== -1) {
        this.listaEspecialidades[index].nome = this.edicaoForm.value.nome;
      }
      this.fecharModal();
    }
  }
}