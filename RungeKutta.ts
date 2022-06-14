export class RungeKutta {
  public ecuacionLlegadaAtentado(beta: number, a: number): number {
    return  beta * a;
  }

  public ecuacionFinBloqueoCliente(t: number, l: number): number {
    return -((l/0.8) * Math.pow(t, 2)) - l;
  }

  public ecuacionFinBloqueoServidor(t: number, s: number) {
    return (0.2 * s) + 3 - t;
  }

  public rk4(x0: number, y0: number, xn: number, n: number): void {
    let h: number = (xn - x0) / n;
    for (let i: number = 0; i < n; i++) {
      let k1: number = h;
    }
  }
}