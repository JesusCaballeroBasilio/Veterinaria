import { Component, input } from '@angular/core';
import { Paciente } from '../../models/paciente';

@Component({
  imports: [],
  selector: 'app-ficha-paciente',
  styleUrl: './ficha-paciente.css',
  templateUrl: './ficha-paciente.html',
})
export class FichaPaciente {
  paciente = input.required<Paciente | null>();
}
