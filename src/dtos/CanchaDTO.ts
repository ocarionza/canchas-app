export interface CanchaDTO {
  id: number;
  nombre: string;
  descripcion: string;
  capacidad: number;
  imagenUrl: string;
  sede: string;
  sedeId: number;
  tipoCancha: string;
  tipoCanchaId: number;
}

export interface SedeDTO {
  id: number;
  nombre: string;
  direccion: string;
}

export interface TipoCanchaDTO {
  id: number;
  nombre: string;
}
