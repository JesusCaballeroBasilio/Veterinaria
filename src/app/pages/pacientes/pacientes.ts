import { Component, inject } from '@angular/core';
import { ListaPacientes } from '../../components/lista-pacientes/lista-pacientes';
import { Paciente } from '../../models/paciente';
import { FichaPaciente } from '../../components/ficha-paciente/ficha-paciente';
import { PacienteService } from '../../services/paciente';

@Component({
  imports: [ListaPacientes, FichaPaciente],
  selector: 'app-pacientes',
  styleUrl: './pacientes.css',
  templateUrl: './pacientes.html',
})
export class Pacientes {

  private pacienteService = inject(PacienteService)

  listaPacientes : Paciente[] = this.pacienteService.listaPacientes;
  

  pacienteRecibido: Paciente | null = null;

  recibirPaciente(paciente: Paciente){
    this.pacienteRecibido = paciente;
    console.log(paciente)
  }
}
