export interface Simulador {
  simular(
    cantEventos: number,
    eventoDesde: number,
    mediaLlegadaPasajero: number, 
    AFinFacturacion: number, 
    BFinFacturacion: number, 
    mediaVentaBillete: number, 
    mediaChequeoBilletes: number, 
    desEstChequeoBilletes: number, 
    mediaControlMetales: number, 
    mediaPasoEntreZonas: number): void;

  getMatrizEstado(): string[][];
  getCantMaxPasajerosEnSistema(): number;
}