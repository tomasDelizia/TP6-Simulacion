import { EstadoEmpleado } from "./EstadoEmpleado";

export class Empleado {
  private estado: EstadoEmpleado;

  constructor() {
    this.estado = EstadoEmpleado.LIBRE;
  }

  public libre(): void {
    this.estado = EstadoEmpleado.LIBRE;
  }

  public ocupado(): void {
    this.estado = EstadoEmpleado.OCUPADO;
  }

  //public bloqueado(): void{
  //  this.estado = EstadoEmpleado.BLOQUEADO;
  //}

  public estaLibre(): boolean {
    return this.estado == EstadoEmpleado.LIBRE;
  }

  public estaOcupado(): boolean {
    return this.estado == EstadoEmpleado.OCUPADO;
  }

  //public estaBloqueado(): boolean {
  //  return this.estado == EstadoEmpleado.BLOQUEADO;
  //}

  public getEstado(): string {
    return EstadoEmpleado[this.estado];
  }
}