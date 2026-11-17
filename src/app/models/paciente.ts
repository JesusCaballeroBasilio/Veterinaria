export interface Paciente { 
    id: number; 
    nombre: string; 
    especie: string; 
    edad: number; 
    vacunado: boolean | null;
}

export type NuevoPaciente = Omit<Paciente, 'id'>