import { RungeKutta } from "./RungeKutta";

export abstract class Simulador {
  protected mediaTiempoEntreLlegadas: number;
  
  protected aTiempoFacturacion: number;
  protected bTiempoFacturacion: number;

  protected mediaTiempoVentaBilletes: number;

  protected mediaTiempoChequeoBilletes: number;
  protected desviacionTiempoChequeoBilletes: number;
  
  protected mediaTiempoControlMetales: number;

  protected mediaTiempoPasoEntreZonas: number;

  protected matrizEstado: string[][];

  protected cantMaxPasajeros: number;

  protected probObjetivosBloqueo: number[] = [0.7, 1];

  protected relojEnOchentaLlegadas: number = 294.5717;

  protected rungeKutta: RungeKutta = new RungeKutta();

  public abstract simular(
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

  public getMatrizEstado(): string[][] {
      return this.matrizEstado;
  }

  public getCantMaxPasajerosEnSistema(): number {
    return this.cantMaxPasajeros;
  }

  public getDistribucionExponencial(rnd: number, media: number): number {
    if (1 - rnd !== 0) return -media * Math.log(1 - rnd);
    return -media * Math.log(1 - rnd + 9e-16);
  }

  // Cálculo del tiempo entre llegadas, que tiene distribución exponencial.
  public getTiempoEntreLlegadas(rndLlegada: number): number {
    let tiempo: number = this.getDistribucionExponencial(rndLlegada, this.mediaTiempoEntreLlegadas);
    return tiempo;
  }

  // Obtención del tipo de pasajero según la probabilidad asociada.
  public getTipoPasajero(probTipoPasajero: number, tiposPasajeros: string[]): string {
    for (let i: number = 0; i < this.probTiposPasajeros.length; i++) {
      if (probTipoPasajero < this.probTiposPasajeros[i])
        return tiposPasajeros[i];
    }
  }

  // Obtención del objetivo del bloqueo según la probabilidad asociada.
  public getObjetivoBloqueo(probObjetivo: number): string {
    const tipos: string[] = ["Cliente", "Empleado Chequeo"];
    for (let i: number = 0; i < this.probObjetivosBloqueo.length; i++) {
      if (probObjetivo < this.probObjetivosBloqueo[i])
        return tipos[i];
    }
  }

  // Cálculo del tiempo de facturación, que tiene distribución uniforme.
  public getTiempoFacturacion(rndTiempoFacturacion: number): number {
    let tiempo: number = this.aTiempoFacturacion + rndTiempoFacturacion * (this.bTiempoFacturacion - this.aTiempoFacturacion);
    return tiempo;
  }

  // Cálculo del tiempo de venta de billete, que tiene distribución exponencial.
  public getTiempoVentaBillete(rndTiempoVenta: number): number {
    let tiempo: number = this.getDistribucionExponencial(rndTiempoVenta, this.mediaTiempoVentaBilletes);
    return tiempo;
  }

  // Cálculo del tiempo de chequeo de billete, que tiene distribución normal.
  public getTiempoChequeoBillete(rndTiempoChequeo1: number, rndTiempoChequeo2: number): number {
    if (rndTiempoChequeo1 === 0) rndTiempoChequeo1 += 1e-16;
    if (rndTiempoChequeo2 === 0) rndTiempoChequeo2 += 1e-16;
    let tiempo: number = (Math.sqrt(-2 * Math.log(rndTiempoChequeo1)) * Math.cos(2 * Math.PI * rndTiempoChequeo2)) * this.desviacionTiempoChequeoBilletes + this.mediaTiempoChequeoBilletes;
    return Math.abs(tiempo);
  }

  // Cálculo del tiempo de chequeo de billete, que tiene distribución exponencial.
  public getTiempoControlMetales(rndTiempoControl: number): number {
    let tiempo: number = this.getDistribucionExponencial(rndTiempoControl, this.mediaTiempoControlMetales);
    return tiempo;
  }

  // Cálculo del tiempo de paso entre zonas, que tiene distribución exponencial.
  public getTiempoPasoEntreZonas(rndPasoZonas: number): number {
    let tiempo: number = this.getDistribucionExponencial(rndPasoZonas, this.mediaTiempoPasoEntreZonas);
    return tiempo;
  }
}