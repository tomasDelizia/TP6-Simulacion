import { Empleado } from "./Empleado";
import { EstadoPasajero } from "./EstadoPasajero";
import { Evento } from "./Evento";
import { Pasajero } from "./Pasajero";
import { Simulador } from "./Simulador";
import { Utils } from "./Utils";

export class SimuladorColas extends Simulador {
  public simular(
    cantEventos: number,
    eventoDesde: number,
    mediaLlegadaPasajero: number, 
    AFinFacturacion: number, 
    BFinFacturacion: number, 
    mediaVentaBillete: number, 
    mediaChequeoBilletes: number, 
    desEstChequeoBilletes: number, 
    mediaControlMetales: number, 
    mediaPasoEntreZonas: number): void {
      
    this.mediaTiempoEntreLlegadas = mediaLlegadaPasajero;
    this.aTiempoFacturacion = AFinFacturacion;
    this.bTiempoFacturacion = BFinFacturacion;
    this.mediaTiempoVentaBilletes = mediaVentaBillete;
    this.mediaTiempoChequeoBilletes = mediaChequeoBilletes;
    this.desviacionTiempoChequeoBilletes = desEstChequeoBilletes;
    this.mediaTiempoControlMetales = mediaControlMetales;
    this.mediaTiempoPasoEntreZonas = mediaPasoEntreZonas;

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

    // Llegada de un bloqueo.
    let rndValorbeta: number = -1;
    let tiempoEntreBloqueos: number = -1;
    let proximoBloqueo: number = -1;
    let rndObjetivoBloqueo: number = -1;
    let objetivoBloqueo: string = '';
    
    // Bloqueo a un cliente en la puerta del aeropuerto.
    let tiempoBloqueoCliente: number = -1;
    let finBloqueoCliente: number = -1;
    let estaBloqueadaLaEntrada: boolean = false;
    let colaPasajerosBloqueadosEnIngreso: Pasajero[] = [];

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

    // Bloqueo al empleado de chequeo de billete.
    let tiempoBloqueoEmpleadoChequeo: number = -1;
    let finBloqueoEmpleadoChequeo: number = -1;
    let tiempoRemanenteChequeo: number = -1;

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
          proximoBloqueo,
          proximaLlegada,
          finBloqueoCliente,
          finFacturacion,
          finVentaBillete,
          finChequeoBillete,
          finBloqueoEmpleadoChequeo,
          finControlMetales
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
        reloj = Utils.getMenorMayorACero(eventosCandidatos);
        tipoEvento = this.getSiguienteEvento(eventosCandidatos);
      }

      switch (tipoEvento) {
        // Inicio de la simulación.
        case Evento.INICIO_SIMULACION: {
          rndValorbeta = Math.random();
          tiempoEntreBloqueos = this.rungeKutta.getTiempoEntreAtentados(0, this.relojEnOchentaLlegadas, 0.01, rndValorbeta);
          proximoBloqueo = (reloj + tiempoEntreBloqueos);

          rndLlegada = Math.random();
          tiempoEntreLlegadas = this.getTiempoEntreLlegadas(rndLlegada);
          proximaLlegada = (reloj + tiempoEntreLlegadas);
          break;
        }

        // Llegada de un bloqueo.
        case Evento.LLEGADA_BLOQUEO: {
          proximoBloqueo = -1;
          rndObjetivoBloqueo = Math.random();
          objetivoBloqueo = this.getObjetivoBloqueo(rndObjetivoBloqueo);

          switch (objetivoBloqueo) {
            case "Cliente": {
              tiempoBloqueoCliente = this.rungeKutta.getTiempoBloqueoCliente(0, reloj, 0.1);
              finBloqueoCliente = (reloj + tiempoBloqueoCliente);
              estaBloqueadaLaEntrada = true;
              break;
            }
            case "Empleado Chequeo": {
              tiempoBloqueoEmpleadoChequeo = this.rungeKutta.getTiempoBloqueoServidor(0, reloj, 0.01);
              finBloqueoEmpleadoChequeo = (reloj + tiempoBloqueoEmpleadoChequeo);
              if (empleadoChequeoBillete.estaOcupado()) {
                let pasajeroABloquear: Pasajero = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.CHEQUEANDO_BILLETE);
                pasajeroABloquear.bloqueadoEnChequeo();

                tiempoRemanenteChequeo = (finChequeoBillete - reloj);
                finChequeoBillete = -1;
              }
              empleadoChequeoBillete.bloqueado();
              break;
            }
          }
          break;
        }

        // Llegada de un pasajero.
        case Evento.LLEGADA_PASAJERO: {
          // Obtenemos el tipo de pasajero.
          rndTipoPasajero = Math.random();
          tipoPasajero = this.getTipoPasajero(rndTipoPasajero, ["A", "B", "C"]);
          totalPasajeros++;

          // Generamos la llegada del próximo pasajero.
          rndLlegada = Math.random();
          tiempoEntreLlegadas = this.getTiempoEntreLlegadas(rndLlegada);
          proximaLlegada = (reloj + tiempoEntreLlegadas);

          // Creamos el objeto pasajero.
          let pasajero: Pasajero = new Pasajero(
            totalPasajeros,
            tipoPasajero,
            reloj
          );

          pasajerosEnSistema.push(pasajero);

          // Preguntamos si hay un bloqueo de la entrada del aeropuerto en curso.
          if (estaBloqueadaLaEntrada) {
            pasajero.bloqueadoEnEntrada();
            colaPasajerosBloqueadosEnIngreso.push(pasajero);
          }
          else {
            switch (tipoPasajero) {
              // Llega un pasajero de tipo A. Va primero a la ventanilla de facturación de equipaje.
              case "A": {
                totalPasajerosA++;
                if (empleadoFacturacion.estaLibre()) {
                  pasajero.facturandoEquipaje();
                  empleadoFacturacion.ocupado();
  
                  // Generamos el tiempo de facturación.
                  rndFacturacion = Math.random();
                  tiempoFacturacion = this.getTiempoFacturacion(rndFacturacion);
                  finFacturacion = (reloj + tiempoFacturacion);
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
                  rndVentaBillete = Math.random();
                  tiempoVentaBillete = this.getTiempoVentaBillete(rndVentaBillete);
                  finVentaBillete = (reloj + tiempoVentaBillete);
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
                  rnd1ChequeoBillete = Math.random();
                  rnd2ChequeoBillete = Math.random();
                  tiempoChequeoBillete = this.getTiempoChequeoBillete(rnd1ChequeoBillete, rnd2ChequeoBillete);
                  finChequeoBillete = (reloj + tiempoChequeoBillete);
                }
                else {
                  pasajero.enEsperaChequeoBilletes();
                  colaChequeoBillete.push(pasajero);
                }
                break;
              }
            }
          }
          break;
        }

        // Fin de bloqueo de la puerta del aeropuerto.
        case Evento.FIN_BLOQUEO_LLEGADA: {
          finBloqueoCliente = -1;

          // Generamos la llegada del siguiente bloqueo.
          rndValorbeta = Math.random();
          tiempoEntreBloqueos = this.rungeKutta.getTiempoEntreAtentados(0, this.relojEnOchentaLlegadas, 0.01, rndValorbeta);
          proximoBloqueo = (reloj + tiempoEntreBloqueos);

          estaBloqueadaLaEntrada = false;
          let tamColaPasajeros: number = colaPasajerosBloqueadosEnIngreso.length;

          if (tamColaPasajeros > 0) {
            // Mandamos todos los pasajeros bloqueados en el ingreso a sus respectivas zonas.
            for (let i: number = 0; i < tamColaPasajeros; i++) {
              let pasajero: Pasajero = colaPasajerosBloqueadosEnIngreso.shift();
              // Determinamos el tipo de pasajero.
              switch (pasajero.getTipoPasajero()) {
                // Llega un pasajero de tipo A. Va primero a la ventanilla de facturación de equipaje.
                case "A": {
                  totalPasajerosA++;
                  if (empleadoFacturacion.estaLibre()) {
                    pasajero.facturandoEquipaje();
                    empleadoFacturacion.ocupado();
    
                    // Generamos el tiempo de facturación.
                    rndFacturacion = Math.random();
                    tiempoFacturacion = this.getTiempoFacturacion(rndFacturacion);
                    finFacturacion = (reloj + tiempoFacturacion);
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
                    rndVentaBillete = Math.random();
                    tiempoVentaBillete = this.getTiempoVentaBillete(rndVentaBillete);
                    finVentaBillete = (reloj + tiempoVentaBillete);
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
                    rnd1ChequeoBillete = Math.random();
                    rnd2ChequeoBillete = Math.random();
                    tiempoChequeoBillete = this.getTiempoChequeoBillete(rnd1ChequeoBillete, rnd2ChequeoBillete);
                    finChequeoBillete = (reloj + tiempoChequeoBillete);
                  }
                  else {
                    pasajero.enEsperaChequeoBilletes();
                    colaChequeoBillete.push(pasajero);
                  }
                  break;
                }
              }
            }   
          }
          break;
        }

        // Fin de facturación de un pasajero.
        case Evento.FIN_FACTURACION: {
          finFacturacion = -1;
          // Se genera el tiempo que tardará el pasajero atendido en pasar a la zona de control de metales.
          rndPaseEntreFacturacionYControl = Math.random();
          tiempoPaseEntreFacturacionYControl = this.getTiempoPasoEntreZonas(rndPaseEntreFacturacionYControl);
          finPaseEntreFacturacionYControl = (reloj + tiempoPaseEntreFacturacionYControl);
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
            rndFacturacion = Math.random();
            tiempoFacturacion = this.getTiempoFacturacion(rndFacturacion);
            finFacturacion = (reloj + tiempoFacturacion);
          }
          break;
        }

        // Fin de venta de billete a un pasajero.
        case Evento.FIN_VENTA_BILLETE: {
          finVentaBillete = -1;
          // Se genera el tiempo que tardará el pasajero atendido en pasar a la ventanilla de facturación.
          rndPaseEntreVentaYFacturacion = Math.random();
          tiempoPaseEntreVentaYFacturacion = this.getTiempoPasoEntreZonas(rndPaseEntreVentaYFacturacion);
          finPaseEntreVentaYFacturacion = (reloj + tiempoPaseEntreVentaYFacturacion);
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
            rndVentaBillete = Math.random();
            tiempoVentaBillete = this.getTiempoVentaBillete(rndVentaBillete);
            finVentaBillete = (reloj + tiempoVentaBillete);
          }
          break;
        }

        // Fin de chequeo de billete a un pasajero.
        case Evento.FIN_CHEQUEO_BILLETE: {
          finChequeoBillete = -1;
          // Se genera el tiempo que tardará el pasajero atendido en pasar a la zona de control de metales.
          rndPaseEntreChequeoYControl = Math.random();
          tiempoPaseEntreChequeoYControl = this.getTiempoPasoEntreZonas(rndPaseEntreChequeoYControl);
          finPaseEntreChequeoYControl = (reloj + tiempoPaseEntreChequeoYControl);
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
            rnd1ChequeoBillete = Math.random();
            rnd2ChequeoBillete = Math.random();
            tiempoChequeoBillete = this.getTiempoChequeoBillete(rnd1ChequeoBillete, rnd2ChequeoBillete);
            finChequeoBillete = (reloj + tiempoChequeoBillete);
          }
          break;
        }

        case Evento.FIN_BLOQUEO_CHEQUEO: {
          finBloqueoEmpleadoChequeo = -1;

          // Generamos la llegada del siguiente bloqueo.
          rndValorbeta = Math.random();
          tiempoEntreBloqueos = this.rungeKutta.getTiempoEntreAtentados(0, this.relojEnOchentaLlegadas, 0.01, rndValorbeta);
          proximoBloqueo = (reloj + tiempoEntreLlegadas);

          let pasajeroBloqueado: Pasajero = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.BLOQUEADO_EN_CHEQUEO);
          if (pasajeroBloqueado != null) {
            finChequeoBillete = (reloj + tiempoRemanenteChequeo);
            tiempoRemanenteChequeo = -1;
            pasajeroBloqueado.chequeandoBillete();
            empleadoChequeoBillete.ocupado();
          }
          else {
            empleadoChequeoBillete.libre();
          }
          break;
        }

        // Fin de control de metales a un pasajero.
        case Evento.FIN_CONTROL_METALES: {
          finControlMetales = -1;
          // Se genera el tiempo que tardará el pasajero atendido en pasar a la zona de embarque.
          rndPaseEntreControlYEmbarque = Math.random();
          tiempoPaseEntreControlYEmbarque = this.getTiempoPasoEntreZonas(rndPaseEntreControlYEmbarque);
          finPaseEntreControlYEmbarque = (reloj + tiempoPaseEntreControlYEmbarque);
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
            rndControlMetales = Math.random();
            tiempoControlMetales = this.getTiempoControlMetales(rndControlMetales);
            finControlMetales = (reloj + tiempoControlMetales);
          }
          break;
        }

        // Fin de paso entre zonas de un pasajero.
        case Evento.FIN_PASO_ENTRE_VENTA_Y_FACTURACION: {
          finPaseEntreVentaYFacturacion = -1;
          // Buscamos el pasajero que llegó a la zona de facturación y le cambiamos el estado. Antes, preguntamos por el servidor.
          let pasajero: Pasajero = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.PASANDO_DE_VENTA_A_FACTURACION && pasajero.minutoLlegadaDeVentaAFacturacion === reloj);
          pasajero.minutoLlegadaDeVentaAFacturacion = -1;
          if (empleadoFacturacion.estaLibre()) {
            pasajero.facturandoEquipaje();
            empleadoFacturacion.ocupado();

            // Generamos el tiempo de facturación.
            rndFacturacion = Math.random();
            tiempoFacturacion = this.getTiempoFacturacion(rndFacturacion);
            finFacturacion = (reloj + tiempoFacturacion);
          }
          else {
            pasajero.enEsperaFacturacion();
            colaFacturacion.push(pasajero);
          }
          break;
        }

        // Fin de paso entre zonas de un pasajero.
        case Evento.FIN_PASO_ENTRE_FACTURACION_Y_CONTROL: {
          finPaseEntreFacturacionYControl = -1;
          // Buscamos el pasajero que llegó a la zona de control y le cambiamos el estado. Antes, preguntamos por el servidor.
          let pasajero: Pasajero = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.PASANDO_DE_FACTURACION_A_CONTROL && pasajero.minutoLlegadaDeFacturacionAControl === reloj);
          pasajero.minutoLlegadaDeFacturacionAControl = -1;
          if (empleadoControlMetales.estaLibre()) {
            pasajero.enControlMetales();
            empleadoControlMetales.ocupado();
            acuTiempoOciosoEmpControl += reloj - minutoTiempoOciosoEmpControlDesde;

            // Generamos el tiempo de facturación.
            rndControlMetales = Math.random();
            tiempoControlMetales = this.getTiempoFacturacion(rndControlMetales);
            finControlMetales = (reloj + tiempoControlMetales);
          }
          else {
            pasajero.enEsperaControlMetales();
            colaControlMetales.push(pasajero);

          }
          break;
        }

        // Fin de paso entre zonas de un pasajero.
        case Evento.FIN_PASO_ENTRE_CHEQUEO_Y_CONTROL: {
          finPaseEntreChequeoYControl = -1;
          // Buscamos el pasajero que llegó a la zona de control y le cambiamos el estado. Antes, preguntamos por el servidor.
          let pasajero: Pasajero = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.PASANDO_DE_CHEQUEO_BILLETE_A_CONTROL && pasajero.minutoLlegadaDeChequeoBilleteAControl === reloj);
          pasajero.minutoLlegadaDeChequeoBilleteAControl = -1;
          if (empleadoControlMetales.estaLibre()) {
            pasajero.enControlMetales();
            empleadoControlMetales.ocupado();
            acuTiempoOciosoEmpControl += reloj - minutoTiempoOciosoEmpControlDesde;

            // Generamos el tiempo de facturación.
            rndControlMetales = Math.random();
            tiempoControlMetales = this.getTiempoFacturacion(rndControlMetales);
            finControlMetales = (reloj + tiempoControlMetales);
          }
          else {
            pasajero.enEsperaControlMetales();
            colaControlMetales.push(pasajero);
          }
          break;
        }

        // Fin de paso entre zonas de un pasajero.
        case Evento.FIN_PASO_ENTRE_CONTROL_Y_EMBARQUE: {
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
        colaVentaBillete.length,
        colaFacturacion.length,
        colaChequeoBillete.length,
        colaControlMetales.length,
        cantMaxPasajerosEnAlgunaCola
      );

      cantMaxPasajerosEnColaControl = Math.max(colaControlMetales.length, cantMaxPasajerosEnColaControl);

      // Cargamos la matriz de estado a mostrar solo para el rango pasado por parámetro.
      if ((i >= eventoDesde && i <= indiceHasta) || i == cantEventos-1) {
        evento.push(
          i.toString(),
          Evento[tipoEvento],
          reloj.toFixed(4),

          rndValorbeta.toFixed(4),
          tiempoEntreBloqueos.toFixed(4),
          proximoBloqueo.toFixed(4),
          rndObjetivoBloqueo.toFixed(4),
          objetivoBloqueo,
    
          rndLlegada.toFixed(4),
          tiempoEntreLlegadas.toFixed(4),
          proximaLlegada.toFixed(4),
          rndTipoPasajero.toFixed(4),
          tipoPasajero,

          tiempoBloqueoCliente.toFixed(4),
          finBloqueoCliente.toFixed(4),
    
          rndFacturacion.toFixed(4),
          tiempoFacturacion.toFixed(4),
          finFacturacion.toFixed(4),
    
          rndVentaBillete.toFixed(4),
          tiempoVentaBillete.toFixed(4),
          finVentaBillete.toFixed(4),
    
          rnd1ChequeoBillete.toFixed(4),
          rnd2ChequeoBillete.toFixed(4),
          tiempoChequeoBillete.toFixed(4),
          finChequeoBillete.toFixed(4),

          tiempoBloqueoEmpleadoChequeo.toFixed(4),
          finBloqueoEmpleadoChequeo.toFixed(4),
    
          rndControlMetales.toFixed(4),
          tiempoControlMetales.toFixed(4),
          finControlMetales.toFixed(4),
    
          rndPaseEntreVentaYFacturacion.toFixed(4),
          tiempoPaseEntreVentaYFacturacion.toFixed(4),
          finPaseEntreVentaYFacturacion.toFixed(4),
    
          rndPaseEntreFacturacionYControl.toFixed(4),
          tiempoPaseEntreFacturacionYControl.toFixed(4),
          finPaseEntreFacturacionYControl.toFixed(4),
    
          rndPaseEntreChequeoYControl.toFixed(4),
          tiempoPaseEntreChequeoYControl.toFixed(4),
          finPaseEntreChequeoYControl.toFixed(4),
    
          rndPaseEntreControlYEmbarque.toFixed(4),
          tiempoPaseEntreControlYEmbarque.toFixed(4),
          finPaseEntreControlYEmbarque.toFixed(4),

          colaPasajerosBloqueadosEnIngreso.length.toString(),
    
          empleadoFacturacion.getEstado(),
          colaFacturacion.length.toString(),
    
          empleadoVentaBillete.getEstado(),
          colaVentaBillete.length.toString(),
    
          empleadoChequeoBillete.getEstado(),
          colaChequeoBillete.length.toString(),
          tiempoRemanenteChequeo.toFixed(4),
    
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
            pasajerosEnSistema[i].getMinutoLlegada().toFixed(4),
            pasajerosEnSistema[i].minutoLlegadaDeVentaAFacturacion.toFixed(4),
            pasajerosEnSistema[i].minutoLlegadaDeFacturacionAControl.toFixed(4),
            pasajerosEnSistema[i].minutoLlegadaDeChequeoBilleteAControl.toFixed(4),
            pasajerosEnSistema[i].minutoLlegadaDeControlAEmbarque.toFixed(4),
          );
        }

        this.matrizEstado.push(evento);

        // Actualizamos la cantidad de pasajeros máximos que hubo en el sistema.
        if (pasajerosEnSistema.length > this.cantMaxPasajeros)
          this.cantMaxPasajeros = pasajerosEnSistema.length;
      }

      // Reseteamos algunas variables.
      rndValorbeta = -1;
      tiempoEntreBloqueos = -1;
      rndObjetivoBloqueo = -1;
      objetivoBloqueo = "";
      rndLlegada = -1;
      tiempoEntreLlegadas = -1;
      rndTipoPasajero = -1;
      tipoPasajero = "";
      tiempoBloqueoCliente = -1;
      rndFacturacion = -1;
      tiempoFacturacion = -1;
      rndVentaBillete = -1;
      tiempoVentaBillete = -1;
      rnd1ChequeoBillete = -1;
      rnd2ChequeoBillete = -1;
      tiempoChequeoBillete = -1;
      tiempoBloqueoEmpleadoChequeo = -1;
      rndControlMetales = -1;
      tiempoControlMetales = -1;
      rndPaseEntreVentaYFacturacion = -1;
      tiempoPaseEntreVentaYFacturacion = -1;
      rndPaseEntreFacturacionYControl = -1;
      tiempoPaseEntreFacturacionYControl = -1;
      rndPaseEntreChequeoYControl = -1;
      tiempoPaseEntreChequeoYControl = -1;
      rndPaseEntreControlYEmbarque = -1;
      tiempoPaseEntreControlYEmbarque = -1;
    }
  }

  public getSiguienteEvento(tiemposEventos: number[]): Evento {
    let menor: number = Utils.getMenorMayorACero(tiemposEventos);
    for (let i: number = 0; i < tiemposEventos.length; i++) {
      if (tiemposEventos[i] === menor) {
        if (i < 8) return Evento[Evento[i+1]];
        else {
          switch (i % 4) {
            case 0: {
              return Evento.FIN_PASO_ENTRE_VENTA_Y_FACTURACION;
            }
            case 1: {
              return Evento.FIN_PASO_ENTRE_FACTURACION_Y_CONTROL;
            }
            case 2: {
              return Evento.FIN_PASO_ENTRE_CHEQUEO_Y_CONTROL;
            }
            case 3: {
              return Evento.FIN_PASO_ENTRE_CONTROL_Y_EMBARQUE;
            }
          }
        }
      }
    }
    return -1;
  }
}