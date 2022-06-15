import { EstadoPasajeroAlt } from "./EstadoPasajeroAlt";

export class PasajeroAlt {
  private id: number;
  private tipoPasajero: string;
  private minutoLlegada: number;
  private estado: EstadoPasajeroAlt;
  private _minutoLlegadaDeVentaFacturacionAControl: number;
  private _minutoLlegadaDeChequeoBilleteAControl: number;
  private _minutoLlegadaDeControlAEmbarque: number;

  public get minutoLlegadaDeVentaFacturacionAControl() {
    return this._minutoLlegadaDeVentaFacturacionAControl;
  }

  public get minutoLlegadaDeChequeoBilleteAControl() {
    return this._minutoLlegadaDeChequeoBilleteAControl;
  }

  public get minutoLlegadaDeControlAEmbarque() {
    return this._minutoLlegadaDeControlAEmbarque;
  }

  public set minutoLlegadaDeVentaFacturacionAControl(minuto: number) {
    this._minutoLlegadaDeVentaFacturacionAControl = minuto;
  }

  public set minutoLlegadaDeChequeoBilleteAControl(minuto: number) {
    this._minutoLlegadaDeChequeoBilleteAControl = minuto;
  }

  public set minutoLlegadaDeControlAEmbarque(minuto: number) {
    this._minutoLlegadaDeControlAEmbarque = minuto;
  }

  public constructor(id: number, tipoPasajero: string, minutoLlegada: number) {
    this.id = id;
    this.tipoPasajero = tipoPasajero;
    this.minutoLlegada = minutoLlegada;
    this._minutoLlegadaDeVentaFacturacionAControl = -1;
    this._minutoLlegadaDeChequeoBilleteAControl = -1;
    this._minutoLlegadaDeControlAEmbarque = -1;
  }

  public enVentaFacturacionEquipajeEmp1(): void {
    this.estado = EstadoPasajeroAlt.EN_VENTA_FACTURACION_EMP_1;
  }

  public enVentaFacturacionEquipajeEmp2(): void {
    this.estado = EstadoPasajeroAlt.EN_VENTA_FACTURACION_EMP_2;
  }

  public enEsperaVentaFacturacion(): void {
    this.estado = EstadoPasajeroAlt.ESPERANDO_VENTA_FACTURACION;
  }

  public enControlMetales(): void {
    this.estado = EstadoPasajeroAlt.EN_CONTROL_METALES;
  }

  public enEsperaControlMetales(): void {
    this.estado = EstadoPasajeroAlt.ESPERANDO_CONTROL;
  }

  public comprandoBillete(): void {
    this.estado = EstadoPasajeroAlt.COMPRANDO_BILLETE;
  }

  public enEsperaCompraBillete(): void {
    this.estado = EstadoPasajeroAlt.ESPERANDO_COMPRA_BILLETE;
  }

  public chequeandoBillete(): void {
    this.estado = EstadoPasajeroAlt.CHEQUEANDO_BILLETE;
  }

  public enEsperaChequeoBilletes(): void {
    this.estado = EstadoPasajeroAlt.ESPERANDO_CHEQUEO_BILLETE;
  }

  public pasandoDeVentaFacturacionAControl(): void {
    this.estado = EstadoPasajeroAlt.PASANDO_DE_VENTA_FACTURACION_A_CONTROL;
  }

  public pasandoDeChequeoAControl(): void {
    this.estado = EstadoPasajeroAlt.PASANDO_DE_CHEQUEO_BILLETE_A_CONTROL;
  }

  public pasandoDeControlAEmbarque(): void {
    this.estado = EstadoPasajeroAlt.PASANDO_DE_CONTROL_A_EMBARQUE;
  }

  //public bloqueado(): void {
  //  this.estado = EstadoPasajero.BLOQUEADO
  //}

  public getEstado(): EstadoPasajeroAlt {
    return this.estado;
  }

  public getId(): number {
    return this.id;
  }

  public getTipoPasajero(): string {
    return this.tipoPasajero;
  }

  public getMinutoLlegada(): number {
    return this.minutoLlegada;
  }
}