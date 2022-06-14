import { EstadoPasajero } from "./EstadoPasajero";

export class Pasajero {
  private id: number;
  private tipoPasajero: string;
  private minutoLlegada: number;
  private estado: EstadoPasajero;
  private _minutoLlegadaDeVentaAFacturacion: number;
  private _minutoLlegadaDeFacturacionAControl: number;
  private _minutoLlegadaDeChequeoBilleteAControl: number;
  private _minutoLlegadaDeControlAEmbarque: number;

  public get minutoLlegadaDeVentaAFacturacion() {
    return this._minutoLlegadaDeVentaAFacturacion;
  }

  public get minutoLlegadaDeFacturacionAControl() {
    return this._minutoLlegadaDeFacturacionAControl;
  }

  public get minutoLlegadaDeChequeoBilleteAControl() {
    return this._minutoLlegadaDeChequeoBilleteAControl;
  }

  public get minutoLlegadaDeControlAEmbarque() {
    return this._minutoLlegadaDeControlAEmbarque;
  }

  public set minutoLlegadaDeVentaAFacturacion(minuto: number) {
    this._minutoLlegadaDeVentaAFacturacion = minuto;
  }

  public set minutoLlegadaDeFacturacionAControl(minuto: number) {
    this._minutoLlegadaDeFacturacionAControl = minuto;
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
    this._minutoLlegadaDeVentaAFacturacion = -1;
    this._minutoLlegadaDeFacturacionAControl = -1;
    this._minutoLlegadaDeChequeoBilleteAControl = -1;
    this._minutoLlegadaDeControlAEmbarque = -1;
  }

  public facturandoEquipaje(): void {
    this.estado = EstadoPasajero.FACTURANDO_EQUIPAJE;
  }

  public enEsperaFacturacion(): void {
    this.estado = EstadoPasajero.ESPERANDO_FACTURACION;
  }

  public enControlMetales(): void {
    this.estado = EstadoPasajero.EN_CONTROL_METALES;
  }

  public enEsperaControlMetales(): void {
    this.estado = EstadoPasajero.ESPERANDO_CONTROL;
  }

  public comprandoBillete(): void {
    this.estado = EstadoPasajero.COMPRANDO_BILLETE;
  }

  public enEsperaCompraBillete(): void {
    this.estado = EstadoPasajero.ESPERANDO_COMPRA_BILLETE;
  }

  public chequeandoBillete(): void {
    this.estado = EstadoPasajero.CHEQUEANDO_BILLETE;
  }

  public enEsperaChequeoBilletes(): void {
    this.estado = EstadoPasajero.ESPERANDO_CHEQUEO_BILLETE;
  }

  public pasandoDeVentaAFacturacion(): void {
    this.estado = EstadoPasajero.PASANDO_DE_VENTA_A_FACTURACION;
  }

  public pasandoDeFacturacionAControl(): void {
    this.estado = EstadoPasajero.PASANDO_DE_FACTURACION_A_CONTROL;
  }

  public pasandoDeChequeoAControl(): void {
    this.estado = EstadoPasajero.PASANDO_DE_CHEQUEO_BILLETE_A_CONTROL;
  }

  public pasandoDeControlAEmbarque(): void {
    this.estado = EstadoPasajero.PASANDO_DE_CONTROL_A_EMBARQUE;
  }

  public getEstado(): EstadoPasajero {
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