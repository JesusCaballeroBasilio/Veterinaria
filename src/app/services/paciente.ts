import { Injectable } from '@angular/core';
import { Paciente } from '../models/paciente';

@Injectable({
    providedIn: 'root'
})

export class PacienteService{

    listaPacientes : Paciente[] = [
    { id: 1, nombre: 'Compi', especie: 'Perro', edad: 4, vacunado: true },
    { id: 2, nombre: 'AntiCompi', especie: 'Gato', edad: 3, vacunado: false },
    {id: 3, nombre: 'Juan', especie: 'Juan', edad: 26, vacunado: null }
]


}
