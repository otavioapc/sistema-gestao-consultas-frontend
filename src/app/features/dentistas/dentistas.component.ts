import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dentistas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule], 
  templateUrl: './dentistas.component.html',
  styleUrl: './dentistas.component.scss'
})
export class DentistasComponent {

  dentistaForm: FormGroup;
  exibirModal: boolean = false;
  modoEdicao: boolean = false;
  idDentistaSel: number | null = null;

  listaDentistas = [
    { id: 1, nome: 'Dr. Carlos Pedroso', cro: 'PR-12345', telefone: '(41) 91111-2222', email: 'carlos.pedroso@vestaplan.com', especialidade: 'Ortodontia / Implantodontia', ativo: true },
    { id: 2, nome: 'Dra. Ana Silva', cro: 'PR-67890', telefone: '(41) 93333-4444', email: 'ana.silva@vestaplan.com', especialidade: 'Clínica Geral / Endodontia', ativo: true },
    { id: 3, nome: 'Dr. Marcelo Ramos', cro: 'PR-54321', telefone: '(41) 95555-6666', email: 'marcelo.ramos@vestaplan.com', especialidade: 'Odontopediatria', ativo: false }
  ];

  constructor(private readonly fb: FormBuilder) {
    this.dentistaForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cro: ['', [Validators.required]],
      telefone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      especialidade: ['', [Validators.required]]
    });
  }

  abrirModalNovo(): void {
    this.modoEdicao = false;
    this.dentistaForm.reset();
    this.exibirModal = true;
  }

  abrirModalEditar(dentista: any): void {
    if (!dentista.ativo) return;

    this.modoEdicao = true;
    this.idDentistaSel = dentista.id;
    this.dentistaForm.patchValue({
      nome: dentista.nome,
      cro: dentista.cro,
      telefone: dentista.telefone,
      email: dentista.email,
      especialidade: dentista.especialidade
    });
    this.exibirModal = true;
  }

  fecharModal(): void {
    this.exibirModal = false;
    this.idDentistaSel = null;
    this.dentistaForm.reset();
  }

  alternarStatus(dentista: any): void {
    dentista.ativo = !dentista.ativo;
    console.log(`${dentista.nome} agora está ${dentista.ativo ? 'Ativo' : 'Inativo'}`);
  }

  onSalvar(): void {
    if (this.dentistaForm.valid) {
      const dadosForm = this.dentistaForm.value;

      if (this.modoEdicao && this.idDentistaSel !== null) {
        const index = this.listaDentistas.findIndex(d => d.id === this.idDentistaSel);
        if (index !== -1) {
          this.listaDentistas[index] = {
            ...this.listaDentistas[index],
            nome: dadosForm.nome,
            cro: dadosForm.cro,
            telefone: dadosForm.telefone,
            email: dadosForm.email,
            especialidade: dadosForm.especialidade
          };
        }
      } else {
        const novoId = this.listaDentistas.length + 1;
        this.listaDentistas.push({
          id: novoId,
          nome: dadosForm.nome,
          cro: dadosForm.cro,
          telefone: dadosForm.telefone,
          email: dadosForm.email,
          especialidade: dadosForm.especialidade,
          ativo: true 
        });
      }

      this.fecharModal();
    }
  }

  getIniciais(nome: string): string {
    const limpo = nome.replace('Dr. ', '').replace('Dra. ', '');
    return limpo.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }
}