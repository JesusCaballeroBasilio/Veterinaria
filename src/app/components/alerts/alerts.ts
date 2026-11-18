import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-alerts',
  styleUrl: './alerts.css',
  templateUrl: './alerts.html',
})
export class Alerts {

  mensaje = input.required<string>();

  cerrar = output<void>();

  solicitarCierre(): void{
    this.cerrar.emit();
  }




}
