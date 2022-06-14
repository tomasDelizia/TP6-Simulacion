import { Empleado } from "./Empleado";
import { EstadoPasajero } from "./EstadoPasajero";
import { Evento } from "./Evento";
import { Pasajero } from "./Pasajero";
import { PasajeroAlt } from "./PasajeroAlt";
import { Utils } from "./Utils";

export class SimuladorColas {
  private mediaTiempoEntreLlegadas: number = 3.4474;
  
  private aTiempoFacturacion: number = 2;
  private bTiempoFacturacion: number = 5;

  private mediaTiempoVentaBilletes: number = 6.858;

  private mediaTiempoChequeoBilletes: number = 1;
  private desviacionTiempoChequeoBilletes: number = 0.5;
  
  private mediaTiempoControlMetales: number = 2;

  private mediaTiempoPasoEntreZonas: number = 2;

  private matrizEstado: string[][];

  private cantMaxPasajeros: number;

  private probTiposPasajeros: number[] = [0.3, 0.45, 1];

  public simular(cantEventos: number, eventoDesde: number): void {
    this.matrizEstado = [];

    // Definimos el rango de filas que vamos a mostrar.
    let indiceHasta: number = eventoDesde + 399;
    if (indiceHasta > cantEventos - 1)
      indiceHasta = cantEventos;

    // Vector de estado.
    let evento: string[] = [];

    let tipoEvento: Evento;
    let reloj: number = 0;

    // Llegada de un pasajero.
    let rndLlegada: number = -1;
    let tiempoEntreLlegadas: number = -1;
    let proximaLlegada: number = -1;
    let rndTipoPasajero: number = -1;
    let tipoPasajero: string = '';

    // Facturación de pasajero.
    let rndFacturacion: number = -1;
    let tiempoFacturacion: number = -1;
    let finFacturacion: number = -1;

    // Venta billete.
    let rndVentaBillete: number = -1;
    let tiempoVentaBillete: number = -1;
    let finVentaBillete: number = -1;

    // Chequeo billete.
    let rnd1ChequeoBillete: number = -1;
    let rnd2ChequeoBillete: number = -1;
    let tiempoChequeoBillete: number = -1;
    let finChequeoBillete: number = -1;

    // Control de metales.
    let rndControlMetales: number = -1;
    let tiempoControlMetales: number = -1;
    let finControlMetales: number = -1;

    // Pase entre zonas: Venta y facturación.
    let rndPaseEntreVentaYFacturacion: number = -1;
    let tiempoPaseEntreVentaYFacturacion: number = -1;
    let finPaseEntreVentaYFacturacion: number = -1;

    // Pase entre zonas: Facturación y control.
    let rndPaseEntreFacturacionYControl: number = -1;
    let tiempoPaseEntreFacturacionYControl: number = -1;
    let finPaseEntreFacturacionYControl: number = -1;

    // Pase entre zonas: Chequeo y control.
    let rndPaseEntreChequeoYControl: number = -1;
    let tiempoPaseEntreChequeoYControl: number = -1;
    let finPaseEntreChequeoYControl: number = -1;

    // Pase entre zonas: Control y embarque.
    let rndPaseEntreControlYEmbarque: number = -1;
    let tiempoPaseEntreControlYEmbarque: number = -1;
    let finPaseEntreControlYEmbarque: number = -1;

    // Empleado facturación.
    let empleadoFacturacion = new Empleado();
    let colaFacturacion: Pasajero[] = [];

    // Empleado Venta de billetes.
    let empleadoVentaBillete = new Empleado();
    let colaVentaBillete: Pasajero[] = [];

    // Empleado Chequeo de billetes.
    let empleadoChequeoBillete = new Empleado();
    let colaChequeoBillete: Pasajero[] = [];

    // Agente control de metales.
    let empleadoControlMetales = new Empleado();
    let colaControlMetales: Pasajero[] = [];

    // Pasajeros en el sistema.
    let pasajerosEnSistema: Pasajero[] = [];

    // Métricas.
    let totalPasajerosA: number = 0;
    let totalPasajerosB: number = 0;
    let totalPasajerosC: number = 0;
    let totalPasajeros: number = 0;
    let acuTiempoPasajeros: number = 0;
    let minutoTiempoOciosoEmpControlDesde: number = 0;
    let acuTiempoOciosoEmpControl: number = 0;
    let cantPasajerosAtentidosPorVenta: number = 0;
    let cantMaxPasajerosEnAlgunaCola: number = 0;
    let cantMaxPasajerosEnColaControl: number = 0;

    this.cantMaxPasajeros = 0;

    for (let i: number = 0; i < cantEventos; i++) {
      evento = [];
      // Determinamos el tipo de evento.
      if (i == 0) {
        tipoEvento = Evento.INICIO_SIMULACION;
      }
      else if (i == cantEventos - 1) {
        tipoEvento = Evento.FIN_SIMULACION;
      }
      else {
        let eventosCandidatos: number[] = [
          proximaLlegada,
          finFacturacion,
          finVentaBillete,
          finChequeoBillete,
          finControlMetales,
        ];
        for (let i: number = 0; i < pasajerosEnSistema.length; i++) {
          let pasajero: Pasajero = pasajerosEnSistema[i];
          eventosCandidatos.push(
            pasajero.minutoLlegadaDeVentaAFacturacion,
            pasajero.minutoLlegadaDeFacturacionAControl,
            pasajero.minutoLlegadaDeChequeoBilleteAControl,
            pasajero.minutoLlegadaDeControlAEmbarque
          );
        }
        reloj = Number(Utils.getMenorMayorACero(eventosCandidatos).toFixed(4));
        tipoEvento = this.getSiguienteEvento(eventosCandidatos, reloj);
      }

      switch (tipoEvento) {
        // Inicio de la simulación.
        case Evento.INICIO_SIMULACION: {
          rndLlegada = Number(Math.random().toFixed(4));
          tiempoEntreLlegadas = Number(this.getTiempoEntreLlegadas(rndLlegada).toFixed(4));
          proximaLlegada = Number((reloj + tiempoEntreLlegadas).toFixed(4));
          break;
        }
        // Llegada de un pasajero.
        case Evento.LLEGADA_PASAJERO: {
          // Obtenemos el tipo de pasajero.
          rndTipoPasajero = Number(Math.random().toFixed(4));
          tipoPasajero = this.getTipoPasajero(rndTipoPasajero);
          totalPasajeros ++;

          // Generamos la llegada del próximo pasajero.
          rndLlegada = Number(Math.random().toFixed(4));
          tiempoEntreLlegadas = Number(this.getTiempoEntreLlegadas(rndLlegada).toFixed(4));
          proximaLlegada = Number((reloj + tiempoEntreLlegadas).toFixed(4));

          // Creamos el objeto pasajero.
          let pasajero: Pasajero = new Pasajero(
            totalPasajeros,
            tipoPasajero,
            reloj
          );

          pasajerosEnSistema.push(pasajero);

          switch (tipoPasajero) {
            // Llega un pasajero de tipo A. Va primero a la ventanilla de facturación de equipaje.
            case "A": {
              totalPasajerosA++;
              if (empleadoFacturacion.estaLibre()) {
                pasajero.facturandoEquipaje();
                empleadoFacturacion.ocupado();

                // Generamos el tiempo de facturación.
                rndFacturacion = Number(Math.random().toFixed(4));
                tiempoFacturacion = Number(this.getTiempoFacturacion(rndFacturacion).toFixed(4));
                finFacturacion = Number((reloj + tiempoFacturacion).toFixed(4));
              }
              else {
                pasajero.enEsperaFacturacion();
                colaFacturacion.push(pasajero);
              }
              break;
            }

            // Llega un pasajero de tipo B. Va primero a la ventanilla de venta de billetes.
            case "B": {
              cantPasajerosAtentidosPorVenta++
              totalPasajerosB++;
              if (empleadoVentaBillete.estaLibre()) {
                pasajero.comprandoBillete();
                empleadoVentaBillete.ocupado();

                // Generamos el tiempo de venta de billete.
                rndVentaBillete = Number(Math.random().toFixed(4));
                tiempoVentaBillete = Number(this.getTiempoVentaBillete(rndVentaBillete).toFixed(4));
                finVentaBillete = Number((reloj + tiempoVentaBillete).toFixed(4));
              }
              else {
                pasajero.enEsperaCompraBillete();
                colaVentaBillete.push(pasajero);
              }
              break;
            }

            // Llega un pasajero de tipo C. Va primero a la ventanilla de chequeo de billetes.
            case "C": {
              totalPasajerosC++;
              if (empleadoChequeoBillete.estaLibre()) {
                pasajero.chequeandoBillete();
                empleadoChequeoBillete.ocupado();

                // Generamos el tiempo de chequeo de billete.
                rnd1ChequeoBillete = Number(Math.random().toFixed(4));
                rnd2ChequeoBillete = Number(Math.random().toFixed(4));
                tiempoChequeoBillete = Number(this.getTiempoChequeoBillete(rnd1ChequeoBillete, rnd2ChequeoBillete).toFixed(4));
                finChequeoBillete = Number((reloj + tiempoChequeoBillete).toFixed(4));
              }
              else {
                pasajero.enEsperaChequeoBilletes();
                colaChequeoBillete.push(pasajero);
              }
              break;
            }
          }
          break;
        }

        // Fin de facturación de un pasajero.
        case Evento.FIN_FACTURACION: {
          rndFacturacion = -1;
          tiempoFacturacion = -1;
          finFacturacion = -1;
          // Se genera el tiempo que tardará el pasajero atendido en pasar a la zona de control de metales.
          rndPaseEntreFacturacionYControl = Number(Math.random().toFixed(4));
          tiempoPaseEntreFacturacionYControl = Number(this.getTiempoPasoEntreZonas(rndPaseEntreFacturacionYControl).toFixed(4));
          finPaseEntreFacturacionYControl = Number((reloj + tiempoPaseEntreFacturacionYControl).toFixed(4));
          // Buscamos el pasajero atendido y le cambiamos el estado.
          let pasajeroAtendido: Pasajero = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.FACTURANDO_EQUIPAJE);
          pasajeroAtendido.pasandoDeFacturacionAControl();
          pasajeroAtendido.minutoLlegadaDeFacturacionAControl = finPaseEntreFacturacionYControl;
          // Preguntamos si hay alguien en la cola.
          if (colaFacturacion.length === 0) {
            empleadoFacturacion.libre();
          }
          else {
            // El servidor pasa de ocupado a ocupado.
            empleadoFacturacion.ocupado();

            // Quitamos a un pasajero de la cola y cambiamos su estado.
            colaFacturacion.shift().facturandoEquipaje();
            // Generamos el tiempo de facturación.
            rndFacturacion = Number(Math.random().toFixed(4));
            tiempoFacturacion = Number(this.getTiempoFacturacion(rndFacturacion).toFixed(4));
            finFacturacion = Number((reloj + tiempoFacturacion).toFixed(4));
          }
          break;
        }

        // Fin de venta de billete a un pasajero.
        case Evento.FIN_VENTA_BILLETE: {
          rndVentaBillete = -1;
          tiempoVentaBillete = -1;
          finVentaBillete = -1;
          // Se genera el tiempo que tardará el pasajero atendido en pasar a la ventanilla de facturación.
          rndPaseEntreVentaYFacturacion = Number(Math.random().toFixed(4));
          tiempoPaseEntreVentaYFacturacion = Number(this.getTiempoPasoEntreZonas(rndPaseEntreVentaYFacturacion).toFixed(4));
          finPaseEntreVentaYFacturacion = Number((reloj + tiempoPaseEntreVentaYFacturacion).toFixed(4));
          // Buscamos el pasajero atendido y le cambiamos el estado.
          let pasajeroAtendido: Pasajero = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.COMPRANDO_BILLETE);
          pasajeroAtendido.pasandoDeVentaAFacturacion();
          pasajeroAtendido.minutoLlegadaDeVentaAFacturacion = finPaseEntreVentaYFacturacion;
          // Preguntamos si hay alguien en la cola.
          if (colaVentaBillete.length === 0) {
            empleadoVentaBillete.libre();
          }
          else {
            empleadoVentaBillete.ocupado();
            // Quitamos a un pasajero de la cola y cambiamos su estado.
            colaVentaBillete.shift().comprandoBillete();
            // Generamos el tiempo de venta de billete.
            rndVentaBillete = Number(Math.random().toFixed(4));
            tiempoVentaBillete = Number(this.getTiempoVentaBillete(rndVentaBillete).toFixed(4));
            finVentaBillete = Number((reloj + tiempoVentaBillete).toFixed(4));
          }
          break;
        }

        // Fin de chequeo de billete a un pasajero.
        case Evento.FIN_CHEQUEO_BILLETE: {
          rnd1ChequeoBillete = -1;
          rnd2ChequeoBillete = -1;
          tiempoChequeoBillete = -1;
          finChequeoBillete = -1;
          // Se genera el tiempo que tardará el pasajero atendido en pasar a la zona de control de metales.
          rndPaseEntreChequeoYControl = Number(Math.random().toFixed(4));
          tiempoPaseEntreChequeoYControl = Number(this.getTiempoPasoEntreZonas(rndPaseEntreChequeoYControl).toFixed(4));
          finPaseEntreChequeoYControl = Number((reloj + tiempoPaseEntreChequeoYControl).toFixed(4));
          // Buscamos el pasajero atendido y le cambiamos el estado.
          let pasajeroAtendido: Pasajero = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.CHEQUEANDO_BILLETE);
          pasajeroAtendido.pasandoDeChequeoAControl();
          pasajeroAtendido.minutoLlegadaDeChequeoBilleteAControl = finPaseEntreChequeoYControl;

          // Preguntamos si hay alguien en la cola.
          if (colaChequeoBillete.length === 0) {
            empleadoChequeoBillete.libre();
          }
          else {
            empleadoChequeoBillete.ocupado();
            // Quitamos a un pasajero de la cola y cambiamos su estado.
            colaChequeoBillete.shift().chequeandoBillete();
            // Generamos el tiempo de Chequeo de billete.
            rnd1ChequeoBillete = Number(Math.random().toFixed(4));
            rnd2ChequeoBillete = Number(Math.random().toFixed(4));
            tiempoChequeoBillete = Number(this.getTiempoChequeoBillete(rnd1ChequeoBillete, rnd2ChequeoBillete).toFixed(4));
            finChequeoBillete = Number((reloj + tiempoChequeoBillete).toFixed(4));
          }
          break;
        }

        // Fin de control de metales a un pasajero.
        case Evento.FIN_CONTROL_METALES: {
          rndControlMetales = -1;
          tiempoControlMetales = -1;
          finControlMetales = -1;
          // Se genera el tiempo que tardará el pasajero atendido en pasar a la zona de embarque.
          rndPaseEntreControlYEmbarque = Number(Math.random().toFixed(4));
          tiempoPaseEntreControlYEmbarque = Number(this.getTiempoPasoEntreZonas(rndPaseEntreControlYEmbarque).toFixed(4));
          finPaseEntreControlYEmbarque = Number((reloj + tiempoPaseEntreControlYEmbarque).toFixed(4));
          // Buscamos el pasajero atendido y le cambiamos el estado.
          let pasajeroAtendido: Pasajero = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.EN_CONTROL_METALES);
          pasajeroAtendido.pasandoDeControlAEmbarque();
          pasajeroAtendido.minutoLlegadaDeControlAEmbarque = finPaseEntreControlYEmbarque;

          // Preguntamos si hay alguien en la cola.
          if (colaControlMetales.length === 0) {
            empleadoControlMetales.libre();
            minutoTiempoOciosoEmpControlDesde = reloj;
          }
          else {
            // El servidor pasa de ocupado a ocupado.
            empleadoControlMetales.ocupado();
            // Quitamos a un pasajero de la cola y cambiamos su estado.
            colaControlMetales.shift().enControlMetales();
            rndControlMetales = Number(Math.random().toFixed(4));
            tiempoControlMetales = Number(this.getTiempoControlMetales(rndControlMetales).toFixed(4));
            finControlMetales = Number((reloj + tiempoControlMetales).toFixed(4));
          }
          break;
        }

        // Fin de paso entre zonas de un pasajero.
        case Evento.FIN_PASO_ENTRE_VENTA_Y_FACTURACION: {
          rndPaseEntreVentaYFacturacion = -1;
          tiempoPaseEntreVentaYFacturacion = -1;
          finPaseEntreVentaYFacturacion = -1;
          // Buscamos el pasajero que llegó a la zona de facturación y le cambiamos el estado. Antes, preguntamos por el servidor.
          let pasajero: Pasajero = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.PASANDO_DE_VENTA_A_FACTURACION && pasajero.minutoLlegadaDeVentaAFacturacion === reloj);
          pasajero.minutoLlegadaDeVentaAFacturacion = -1;
          if (empleadoFacturacion.estaLibre()) {
            pasajero.facturandoEquipaje();
            empleadoFacturacion.ocupado();

            // Generamos el tiempo de facturación.
            rndFacturacion = Number(Math.random().toFixed(4));
            tiempoFacturacion = Number(this.getTiempoFacturacion(rndFacturacion).toFixed(4));
            finFacturacion = Number((reloj + tiempoFacturacion).toFixed(4));
          }
          else {
            pasajero.enEsperaFacturacion();
            colaFacturacion.push(pasajero);
          }
          break;
        }

        // Fin de paso entre zonas de un pasajero.
        case Evento.FIN_PASO_ENTRE_FACTURACION_Y_CONTROL: {
          rndPaseEntreFacturacionYControl = -1;
          tiempoPaseEntreFacturacionYControl = -1;
          finPaseEntreFacturacionYControl = -1;
          // Buscamos el pasajero que llegó a la zona de control y le cambiamos el estado. Antes, preguntamos por el servidor.
          let pasajero: Pasajero = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.PASANDO_DE_FACTURACION_A_CONTROL && pasajero.minutoLlegadaDeFacturacionAControl === reloj);
          pasajero.minutoLlegadaDeFacturacionAControl = -1;
          if (empleadoControlMetales.estaLibre()) {
            pasajero.enControlMetales();
            empleadoControlMetales.ocupado();
            acuTiempoOciosoEmpControl += reloj - minutoTiempoOciosoEmpControlDesde;

            // Generamos el tiempo de facturación.
            rndControlMetales = Number(Math.random().toFixed(4));
            tiempoControlMetales = Number(this.getTiempoFacturacion(rndControlMetales).toFixed(4));
            finControlMetales = Number((reloj + tiempoControlMetales).toFixed(4));
          }
          else {
            pasajero.enEsperaControlMetales();
            colaControlMetales.push(pasajero);

          }
          break;
        }

        // Fin de paso entre zonas de un pasajero.
        case Evento.FIN_PASO_ENTRE_CHEQUEO_Y_CONTROL: {
          rndPaseEntreChequeoYControl = -1;
          tiempoPaseEntreChequeoYControl = -1;
          finPaseEntreChequeoYControl = -1;
          // Buscamos el pasajero que llegó a la zona de control y le cambiamos el estado. Antes, preguntamos por el servidor.
          let pasajero: Pasajero = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.PASANDO_DE_CHEQUEO_BILLETE_A_CONTROL && pasajero.minutoLlegadaDeChequeoBilleteAControl === reloj);
          pasajero.minutoLlegadaDeChequeoBilleteAControl = -1;
          if (empleadoControlMetales.estaLibre()) {
            pasajero.enControlMetales();
            empleadoControlMetales.ocupado();
            acuTiempoOciosoEmpControl += reloj - minutoTiempoOciosoEmpControlDesde;

            // Generamos el tiempo de facturación.
            rndControlMetales = Number(Math.random().toFixed(4));
            tiempoControlMetales = Number(this.getTiempoFacturacion(rndControlMetales).toFixed(4));
            finControlMetales = Number((reloj + tiempoControlMetales).toFixed(4));
          }
          else {
            pasajero.enEsperaControlMetales();
            colaControlMetales.push(pasajero);
          }
          break;
        }

        // Fin de paso entre zonas de un pasajero.
        case Evento.FIN_PASO_ENTRE_CONTROL_Y_EMBARQUE: {
          rndPaseEntreControlYEmbarque = -1;
          tiempoPaseEntreControlYEmbarque = -1;
          finPaseEntreControlYEmbarque = -1;
          // Buscamos el pasajero que llegó a embarque y lo eliminamos del sistema.
          let indicePasajero: number = pasajerosEnSistema.findIndex(pasajero => pasajero.getEstado() === EstadoPasajero.PASANDO_DE_CONTROL_A_EMBARQUE && pasajero.minutoLlegadaDeControlAEmbarque === reloj);
          let pasajeroFinalizado: Pasajero = pasajerosEnSistema[indicePasajero];
          // Calculamos el tiempo de permanencia.
          let tiempoPermanencia: number = reloj - pasajeroFinalizado.getMinutoLlegada();
          acuTiempoPasajeros += tiempoPermanencia;
          pasajerosEnSistema.splice(indicePasajero, 1);
          break;
        }

        // Fin de simulación.
        case Evento.FIN_SIMULACION: {
          // Calculamos el tiempo de permanencia en el sistema de los pasajeros que quedaron en el sistema.
          for (let i: number = 0; i < pasajerosEnSistema.length; i++) {
            acuTiempoPasajeros += reloj - pasajerosEnSistema[i].getMinutoLlegada();
          }
          break;
        }
      }

      // Comparamos la cantidad de pasajeros en todas las colas en la iteración actual.
      cantMaxPasajerosEnAlgunaCola = Math.max(
        Math.max(
        colaVentaBillete.length,
        colaFacturacion.length,
        colaChequeoBillete.length,
        colaControlMetales.length
        ),
        cantMaxPasajerosEnAlgunaCola
      );

      cantMaxPasajerosEnColaControl = Math.max(colaControlMetales.length, cantMaxPasajerosEnColaControl);

      // Cargamos la matriz de estado a mostrar solo para el rango pasado por parámetro.
      if ((i >= eventoDesde && i <= indiceHasta) || i == cantEventos-1) {
        evento.push(
          i.toString(),
          Evento[tipoEvento],
          reloj.toString(),
    
          rndLlegada.toString(),
          tiempoEntreLlegadas.toString(),
          proximaLlegada.toString(),
          rndTipoPasajero.toString(),
          tipoPasajero.toString(),
    
          rndFacturacion.toString(),
          tiempoFacturacion.toString(),
          finFacturacion.toString(),
    
          rndVentaBillete.toString(),
          tiempoVentaBillete.toString(),
          finVentaBillete.toString(),
    
          rnd1ChequeoBillete.toString(),
          rnd2ChequeoBillete.toString(),
          tiempoChequeoBillete.toString(),
          finChequeoBillete.toString(),
    
          rndControlMetales.toString(),
          tiempoControlMetales.toString(),
          finControlMetales.toString(),
    
          rndPaseEntreVentaYFacturacion.toString(),
          tiempoPaseEntreVentaYFacturacion.toString(),
          finPaseEntreVentaYFacturacion.toString(),
    
          rndPaseEntreFacturacionYControl.toString(),
          tiempoPaseEntreFacturacionYControl.toString(),
          finPaseEntreFacturacionYControl.toString(),
    
          rndPaseEntreChequeoYControl.toString(),
          tiempoPaseEntreChequeoYControl.toString(),
          finPaseEntreChequeoYControl.toString(),
    
          rndPaseEntreControlYEmbarque.toString(),
          tiempoPaseEntreControlYEmbarque.toString(),
          finPaseEntreControlYEmbarque.toString(),
    
          empleadoFacturacion.getEstado(),
          colaFacturacion.length.toString(),
    
          empleadoVentaBillete.getEstado(),
          colaVentaBillete.length.toString(),
    
          empleadoChequeoBillete.getEstado(),
          colaChequeoBillete.length.toString(),
    
          empleadoControlMetales.getEstado(),
          colaControlMetales.length.toString(),
    
          totalPasajerosA.toString(),
          totalPasajerosB.toString(),
          totalPasajerosC.toString(),
          totalPasajeros.toString(),
          acuTiempoPasajeros.toFixed(4),
          acuTiempoOciosoEmpControl.toFixed(4),
          cantPasajerosAtentidosPorVenta.toString(),
          cantMaxPasajerosEnAlgunaCola.toString(),
          cantMaxPasajerosEnColaControl.toString()
        );
    
        for (let i: number = 0; i < pasajerosEnSistema.length; i++) {
          evento.push(
            pasajerosEnSistema[i].getId().toString(),
            pasajerosEnSistema[i].getTipoPasajero(),
            EstadoPasajero[pasajerosEnSistema[i].getEstado()],
            pasajerosEnSistema[i].getMinutoLlegada().toString(),
            pasajerosEnSistema[i].minutoLlegadaDeVentaAFacturacion.toString(),
            pasajerosEnSistema[i].minutoLlegadaDeFacturacionAControl.toString(),
            pasajerosEnSistema[i].minutoLlegadaDeChequeoBilleteAControl.toString(),
            pasajerosEnSistema[i].minutoLlegadaDeControlAEmbarque.toString(),
          );
        }

        this.matrizEstado.push(evento);

        // Actualizamos la cantidad de pasajeros máximos que hubo en el sistema.
        if (pasajerosEnSistema.length > this.cantMaxPasajeros)
          this.cantMaxPasajeros = pasajerosEnSistema.length;
      }

      console.log('Evento ' + i + ': Hay ' + pasajerosEnSistema.length + ' pasajeros en el sistema');

      // Reseteamos algunas variables.
      rndTipoPasajero = -1;
      tipoPasajero = "";
    }
  }

  public getMatrizEstado(): string[][] {
    return this.matrizEstado;
  }

  public getSiguienteEvento(tiemposEventos: number[], relojActual: number): Evento {
    let menor: number = Utils.getMenorMayorACero(tiemposEventos);
    for (let i: number = 0; i < tiemposEventos.length; i++) {
      if (tiemposEventos[i] === menor) {
        if (i < 5)
          return Evento[Evento[i+1]];
        if (tiemposEventos[i] >= relojActual) {
          switch (i % 4) {
            case 0: {
              return Evento.FIN_PASO_ENTRE_CONTROL_Y_EMBARQUE;
            }
            case 1: {
              return Evento.FIN_PASO_ENTRE_VENTA_Y_FACTURACION;
            }
            case 2: {
              return Evento.FIN_PASO_ENTRE_FACTURACION_Y_CONTROL;
            }
            case 3: {
              return Evento.FIN_PASO_ENTRE_CHEQUEO_Y_CONTROL;
            }
          }
        }
      }
    }
    return -1;
  }

  // Cálculo del tiempo entre llegadas, que tiene distribución exponencial.
  public getTiempoEntreLlegadas(rndLlegada: number): number {
    let tiempo: number = -this.mediaTiempoEntreLlegadas * Math.log(1 - rndLlegada);
    return tiempo;
  }

  // Obtención del tipo de pasajero según la probabilidad asociada.
  public getTipoPasajero(probTipoPasajero: number): string {
    const tipos: string[] = ["A", "B", "C"];
    for (let i: number = 0; i < this.probTiposPasajeros.length; i++) {
      if (probTipoPasajero < this.probTiposPasajeros[i])
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
    let tiempo: number = -this.mediaTiempoVentaBilletes * Math.log(1 - rndTiempoVenta);
    return tiempo;
  }

  // Cálculo del tiempo de chequeo de billete, que tiene distribución normal.
  public getTiempoChequeoBillete(rndTiempoChequeo1: number, rndTiempoChequeo2: number): number {
    let tiempo: number = (Math.sqrt(-2 * Math.log(rndTiempoChequeo1)) * Math.cos(2 * Math.PI * rndTiempoChequeo2)) * this.desviacionTiempoChequeoBilletes + this.mediaTiempoChequeoBilletes;
    return Math.abs(tiempo);
  }

  // Cálculo del tiempo de chequeo de billete, que tiene distribución exponencial.
  public getTiempoControlMetales(rndTiempoControl: number): number {
    let tiempo: number = -this.mediaTiempoControlMetales * Math.log(1 - rndTiempoControl);
    return tiempo;
  }

  // Cálculo del tiempo de paso entre zonas, que tiene distribución exponencial.
  public getTiempoPasoEntreZonas(rndPasoZonas: number): number {
    let tiempo: number = -this.mediaTiempoPasoEntreZonas * Math.log(1 - rndPasoZonas);
    return tiempo;
  }

  public getCantMaxPasajerosEnSistema(): number {
    return this.cantMaxPasajeros;
  }
}