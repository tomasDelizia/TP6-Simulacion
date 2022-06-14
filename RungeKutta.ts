export class RungeKutta {
  private matrizRK: number[][];

  public ecuacionLlegadaAtentado(a: number, beta: number): number {
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
    let aCorte: number = 2 * a0;

    while (true) {
      fila = [];
      fila.push(t0, a0);

      let k1: number = this.ecuacionLlegadaAtentado(a0, beta);
      let k2: number = this.ecuacionLlegadaAtentado(a0 + (k1*h/2), beta);
      let k3: number = this.ecuacionLlegadaAtentado(a0 + (k2*h/2), beta);
      let k4: number = this.ecuacionLlegadaAtentado(a0 + (k3*h), beta);

      t0 = t0 + h;
      a0 = a0 + ((h/6) * (k1 + 2 * k2 + 2 * k3 + k4));

      fila.push(k1, k2, k3, k4, t0, a0);
      this.matrizRK.push(fila);

      if (a0 < aCorte) break;
    }
    for (let i: number = 0; i < this.matrizRK.length; i++)
      console.log(this.matrizRK[i])
    return this.matrizRK[this.matrizRK.length-1][0];
  }
}