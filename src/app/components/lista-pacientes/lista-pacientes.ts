import { Component, input, output} from '@angular/core';
import { Pacientes } from '../../pages/pacientes/pacientes';
import { Paciente } from '../../models/paciente';

@Component({
  imports: [],
  selector: 'app-lista-pacientes',
  styleUrl: './lista-pacientes.css',
  templateUrl: './lista-pacientes.html',
})
export class ListaPacientes {
  
  pacientes = input.required<Paciente[]>();

  pacienteSeleccionado = output<Paciente>();

  seleccionarPaciente(paciente: Paciente){ 
    this.pacienteSeleccionado.emit(paciente);
  }
}
