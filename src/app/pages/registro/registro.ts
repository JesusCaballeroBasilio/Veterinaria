import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from '../../services/paciente';
import { AbstractControl, ValidationErrors } from '@angular/forms';

/*Creando un validator personalizado para evitar que existan espacios en los campos del formulario*/
  function validarEspacios(control: AbstractControl): ValidationErrors | null {
    const texto = control.value;

    if(texto.trim().length === 0){
      return { soloEspacios: true };
    }
    return null;
  }


@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-registro',
  styleUrl: './registro.css',
  templateUrl: './registro.html',
})
export class Registro {

  private pacienteService = inject(PacienteService)

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

  registrarPaciente(): void {
    if(this.formularioPaciente.invalid){
      return;
    }

    const datosFormulario = this.formularioPaciente.getRawValue();
    console.log(datosFormulario);
    const pacienteRegistrado = this.pacienteService.registrarPaciente(datosFormulario);

    this.formularioPaciente.reset();
  }

  


}

