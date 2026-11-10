import { Component } from '@angular/core';
import { ListaPacientes } from '../../components/lista-pacientes/lista-pacientes';
import { Paciente } from '../../models/paciente';
import { FichaPaciente } from '../../components/ficha-paciente/ficha-paciente';

@Component({
  imports: [ListaPacientes, FichaPaciente],
  selector: 'app-pacientes',
  styleUrl: './pacientes.css',
  templateUrl: './pacientes.html',
})
export class Pacientes {

  listaPacientes : Paciente[] = [
    { id: 1, nombre: 'Compi', especie: 'Perro', edad: 4, vacunado: true },
    { id: 2, nombre: 'AntiCompi', especie: 'Gato', edad: 3, vacunado: false }
  ]

  pacienteRecibido: Paciente | null = null;

  recibirPaciente(paciente: Paciente){
    this.pacienteRecibido = paciente;
    console.log(paciente)
  }
}
