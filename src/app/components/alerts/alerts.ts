import { Component, input, output, OnInit, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-alerts',
  styleUrl: './alerts.css',
  templateUrl: './alerts.html',
})
export class Alerts implements OnInit, OnDestroy, OnChanges {

  mensaje = input.required<string>();

  cerrar = output<void>();

  /* Metodos dedicados al ejercicio de ciclo de vida */

  ngOnInit(): void {
    console.log('Alerts: ngOnInit');
  }

  ngOnDestroy(): void {
    console.log('Alerts: ngOnDestroy');
  }

  ngOnChanges(changes: SimpleChanges): void {
    const cambioMensaje = changes['mensaje'];

    if(cambioMensaje) { 
      console.log('Anterior:', cambioMensaje.previousValue);
      console.log('Actual:', cambioMensaje.currentValue);
      console.log('Primer cambio: ', cambioMensaje.firstChange);
    }

  }

  constructor() {
    console.log('Alerts: constructor');
  }

  /* componente dedicado a cerrar la alerta */
  solicitarCierre(): void{
    this.cerrar.emit();
  }




}
