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

  public getTiempoEntreAtentados(t0: number, a0: number, h: number, beta: number): number {
    this.matrizRK = [];
    let fila: number[];
    let aCorte: number = 2 * a0;

    while (true) {
      if (a0 >= aCorte) break;
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
    }
    return this.matrizRK[this.matrizRK.length-1][6] * 9;
  }

  public getTiempoBloqueoCliente(t0: number, l0: number, h: number): number {
    this.matrizRK = [];
    let fila: number[];
    let lAnterior: number = l0;

    while (true) {
      fila = [];
      fila.push(t0, l0);

      let k1: number = this.ecuacionFinBloqueoCliente(t0, l0);
      let k2: number = this.ecuacionFinBloqueoCliente(t0 + (h/2), l0 + (k1*h/2));
      let k3: number = this.ecuacionFinBloqueoCliente(t0 + (h/2), l0 + (k2*h/2));
      let k4: number = this.ecuacionFinBloqueoCliente(t0 + (h/2), l0 + (k3*h));

      t0 = t0 + h;
      lAnterior = l0;
      l0 = l0 + ((h/6) * (k1 + 2 * k2 + 2 * k3 + k4));

      fila.push(k1, k2, k3, k4, t0, l0);
      this.matrizRK.push(fila);
      if (lAnterior - l0 < 1) break;
    }
    return this.matrizRK[this.matrizRK.length-1][6] * 5;
  }

  public getTiempoBloqueoServidor(t0: number, l0: number, h: number): number {
    this.matrizRK = [];
    let fila: number[];
    let lCorte: number = l0 * 1.35;

    while (true) {
      fila = [];
      fila.push(t0, l0);

      let k1: number = this.ecuacionFinBloqueoServidor(t0, l0);
      let k2: number = this.ecuacionFinBloqueoServidor(t0 + (h/2), l0 + (k1*h/2));
      let k3: number = this.ecuacionFinBloqueoServidor(t0 + (h/2), l0 + (k2*h/2));
      let k4: number = this.ecuacionFinBloqueoServidor(t0 + (h/2), l0 + (k3*h));

      t0 = t0 + h;
      l0 = l0 + ((h/6) * (k1 + 2 * k2 + 2 * k3 + k4));

      fila.push(k1, k2, k3, k4, t0, l0);
      this.matrizRK.push(fila);

      if (l0 >= lCorte) break;
    }
    return this.matrizRK[this.matrizRK.length-1][6] * 2;
  }
}