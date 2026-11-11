import { Injectable, inject } from '@angular/core';
import { Paciente } from '../models/paciente';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UsuarioApi } from '../models/usuarioapi';
import { NgModel } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})

export class PacienteService{

    private http = inject(HttpClient);

    listaPacientes : Paciente[] = [
        { id: 1, nombre: 'Compi', especie: 'Perro', edad: 4, vacunado: true },
        { id: 2, nombre: 'AntiCompi', especie: 'Gato', edad: 3, vacunado: false },
        {id: 3, nombre: 'Juan', especie: 'Juan', edad: 26, vacunado: null }
    ]

    obtenerPacientes(): Observable<Paciente[]> {
        return this.http.get<UsuarioApi[]>(
            'https://jsonplaceholder.typicode.com/users'
        ).pipe(
            map(usuarios => {
                const pacientes = usuarios.map( usuario => (
                    this.convertirUsuarioAPaciente(usuario)
                ));
                return pacientes;
            })
        );
    }

    private convertirUsuarioAPaciente(usuario: UsuarioApi): Paciente {
        return {
            id: usuario.id,
            nombre: usuario.name,
            especie: 'Perro',
            edad: 4,
            vacunado: true
        }
    }

    obtenerPacientesPorId(id: number): Observable<Paciente>{
        return this.http.get<UsuarioApi>(`https://jsonplaceholder.typicode.com/users/${id}`
        ).pipe(
            map(usuario => {
                return this.convertirUsuarioAPaciente(usuario)
            })
        )
    }

    


}
