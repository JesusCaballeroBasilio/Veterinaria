import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from '../../services/paciente';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { MENSAJES_PACIENTE } from '../../constants/mensaje.constants';
import { Alerts } from '../../components/alerts/alerts';

/*Creando un validator personalizado para evitar que existan espacios en los campos del formulario*/
  function validarEspacios(control: AbstractControl): ValidationErrors | null {
    const texto = control.value;

    if(texto.trim().length === 0){
      return { soloEspacios: true };
    }
    return null;
  }


@Component({
  imports: [ReactiveFormsModule, Alerts],
  selector: 'app-registro',
  styleUrl: './registro.css',
  templateUrl: './registro.html',
})
export class Registro {

  private pacienteService = inject(PacienteService)

  private mensajeRegistro = signal<string | null>(null);

  formularioPaciente = new FormGroup({
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, validarEspacios]
    }),
    especie: new FormControl('', {
      nonNullable: true, 
      validators: [Validators.required, validarEspacios]
    }),
    edad: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)]}),
    vacunado: new FormControl<boolean | null>(null)
  });

  /* Añadimos un metodo para registrar un paciente y este mismo se comunica con las tarjetas de pacientes para alimentarlas
  Limpiamos el formulario quitandole espacios si es que los tiene antes del primer caracter y despues del ultimo */
  registrarPaciente(): void {
    if(this.formularioPaciente.invalid){
      return;
    }

    const datosFormulario = this.formularioPaciente.getRawValue();
    datosFormulario.nombre = datosFormulario.nombre.trim();
    datosFormulario.especie = datosFormulario.especie.trim();

    const pacienteRegistrado = this.pacienteService.registrarPaciente(datosFormulario);
    this.mensajeRegistro.set(`${MENSAJES_PACIENTE.REGISTRO_EXITOSO}: ${pacienteRegistrado.nombre} (ID: ${pacienteRegistrado.id})`)

    this.formularioPaciente.reset();
  }

  ocultarAlerta(): void {
    this.mensajeRegistro.set(null);
  }


}

