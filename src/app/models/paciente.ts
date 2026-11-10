export interface Paciente { 
    id: number; 
    nombre: string; 
    especie: string; 
    edad: number; 
    vacunado: boolean | null;
}