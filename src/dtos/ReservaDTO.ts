export interface ReservaDTO {
  id: number;
  cancha: string;
  sede: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: string;
}

export interface CrearReservaDTO {
  canchaId: number;
  horarioId: number;
  fecha: string;
}
