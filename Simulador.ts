export interface Simulador {
  simular(cantEventos: number, eventoDesde: number): void;
  getMatrizEstado(): string[][];
  getCantMaxPasajerosEnSistema(): number;
}