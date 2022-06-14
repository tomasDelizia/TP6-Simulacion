export class RungeKutta {
  private matrizRK: number[][];

  public ecuacionLlegadaAtentado(t: number, a: number, beta: number): number {
    return  beta * a;
  }

  public ecuacionFinBloqueoCliente(t: number, l: number): number {
    return -((l/0.8) * Math.pow(t, 2)) - l;
  }

  public ecuacionFinBloqueoServidor(t: number, s: number) {
    return (0.2 * s) + 3 - t;
  }

  public getTiempoEntreLlegadas(t0: number, a0: number, h: number, beta: number): number {
    this.matrizRK = [];
    let fila: number[];

    while (a0 < 2*a0) {
      fila = [];
      fila.push(t0, a0);

      let k1: number = h * this.ecuacionLlegadaAtentado(t0, a0, beta);
      let k2: number = h * this.ecuacionLlegadaAtentado((t0 + (h/2)), (a0 + (k1/2)), beta);
      let k3: number = h * this.ecuacionLlegadaAtentado((t0 + (h/2)), (a0 + (k1/2)), beta);
      let k4: number = h * this.ecuacionLlegadaAtentado(t0 + h, a0 + k3, beta);

      t0 = t0 + h;
      a0 = a0 + ((k1 + 2 * k2 + 2 * k3 + k4) / 6);

      fila.push(k1, k2, k3, k4, t0, a0);
      this.matrizRK.push(fila);
    }
    for (let i: number = 0; i < this.matrizRK.length; i++)
      console.log(this.matrizRK[i])
    return 0;
    //return this.matrizRK[this.matrizRK.length][0];
  }
}