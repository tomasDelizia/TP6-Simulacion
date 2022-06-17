import { HTMLUtils } from './HTMLUtils';
import { RungeKutta } from './RungeKutta';
import { Simulador } from './Simulador';
import { SimuladorColas } from './SimuladorColas';
import { SimuladorColasAlternativo } from './SimuladorColasAlternativo';
import './style.css';

// Definición de los cuadros de texto de la interfaz de usuario.
const txtCantNros: HTMLInputElement = document.getElementById('txtCantNros') as HTMLInputElement;
const txtEventoDesde: HTMLInputElement = document.getElementById('txtEventoDesde') as HTMLInputElement;
const txtMediaLlegadaPasajeros: HTMLInputElement = document.getElementById('txtMediaLlegadaPasajeros') as HTMLInputElement;
const txtAFinDeFacturacion: HTMLInputElement = document.getElementById('txtAFinDeFacturacion') as HTMLInputElement;
const txtBFinDeFacturacion: HTMLInputElement = document.getElementById('txtBFinDeFacturacion') as HTMLInputElement;
const txtMediaFinVentaBillete: HTMLInputElement = document.getElementById('txtMediaFinVentaBillete') as HTMLInputElement;
const txtMediaFinChequeoBillete: HTMLInputElement = document.getElementById('txtMediaFinChequeoBillete') as HTMLInputElement;
const txtDesEstFinChequeoBillete: HTMLInputElement = document.getElementById('txtDesEstFinChequeoBillete') as HTMLInputElement;
const txtMediaFinControlMetales: HTMLInputElement = document.getElementById('txtMediaFinControlMetales') as HTMLInputElement;
const txtMediaFinPasoEntreZonas: HTMLInputElement = document.getElementById('txtMediaFinPasoEntreZonas') as HTMLInputElement;

// Definición de los combo box de la interfaz de usuario.
const cboJuntarVentanilla: HTMLSelectElement = document.getElementById('cboJuntarVentanilla') as HTMLSelectElement;

// Definición de la secciones de la simulación.
const divTablaSimulacion: HTMLDivElement = document.getElementById('divTablaSimulacion') as HTMLDivElement;
const divTablaSimulacionAlternativa: HTMLDivElement = document.getElementById('divTablaSimulacionAlternativa') as HTMLDivElement;
const divRungeKutta: HTMLDivElement = document.getElementById('divRungeKutta') as HTMLDivElement;

// Definición de la tablas de simulación de colas.
const tablaSimulacion: HTMLTableElement = document.getElementById('tablaSimulacion') as HTMLTableElement;
const cantEncabezadosTablaSimulacion = tablaSimulacion.rows[0].cells.length;
const cantSubEncabezadosTablaSimulacion = tablaSimulacion.rows[1].cells.length;
const tablaSimulacionAlternativa: HTMLTableElement = document.getElementById('tablaSimulacionAlternativa') as HTMLTableElement;
const cantEncabezadosTablaSimulacionAlt = tablaSimulacionAlternativa.rows[0].cells.length;
const cantSubEncabezadosTablaSimulacionAlt = tablaSimulacionAlternativa.rows[1].cells.length;
const indicesEventosCandidatos: number[] = [5, 10, 14, 17, 20, 24, 26, 29];
const indicesEventosCandidatosAlt: number[] = [5, 10, 14, 17, 18, 22, 24, 27];
const colPasajeros: string[] = ['ID Pasajero', 'Tipo Pasajero', 'Estado', 'Minuto llegada', 'Minuto llegada de venta a facturación', 'Minuto llegada de facturación a control', 'Minuto llegada de chequeo a control', 'Minuto llegada de control a embarque'];
const colPasajerosAlt: string[] = ['ID Pasajero', 'Tipo Pasajero', 'Estado', 'Minuto llegada', 'Minuto llegada de venta-facturación a control', 'Minuto llegada de chequeo a control', 'Minuto llegada de control a embarque'];

// Definición de botones de la interfaz de usuario.
const btnSimular: HTMLButtonElement = document.getElementById('btnSimular') as HTMLButtonElement;
const btnRK: HTMLButtonElement = document.getElementById('btnRK') as HTMLButtonElement;
const btnRKAlternativo: HTMLButtonElement = document.getElementById('btnRKAlternativo') as HTMLButtonElement;

// Definición de los objetos que realizan la simulación de colas.
let simulador: Simulador;
let matrizEstado: string[][];
let cantMaxPasajeros: number;

// Definición de los parámetros.
let n: number;
let eventoDesde: number;
let mediaLlegadaPasajero: number;
let AFinFacturacion: number;
let BFinFacturacion: number;
let mediaVentaBillete: number;
let mediaChequeoBilletes: number;
let desEstChequeoBilletes: number;
let mediaControlMetales: number;
let mediaPasoEntreZonas: number;

//Ocultamos la seccion en donde esta la tabla.
HTMLUtils.ocultarSeccion(divTablaSimulacion);
HTMLUtils.ocultarSeccion(divTablaSimulacionAlternativa);
HTMLUtils.ocultarSeccion(divRungeKutta);

// Disparamos la simulación.
btnSimular.addEventListener('click', () => {
  HTMLUtils.ocultarSeccion(divTablaSimulacion);
  HTMLUtils.ocultarSeccion(divTablaSimulacionAlternativa);
  HTMLUtils.ocultarSeccion(divRungeKutta);
  simular();
});

// Mostramos las tablas de Runge-Kutta.
btnRK.addEventListener('click', () => {
  mostrarRK();
});

btnRKAlternativo.addEventListener('click', () => {
  mostrarRK();
});

const mostrarRK = () => {
  divRungeKutta.innerHTML = '';
  HTMLUtils.mostrarSeccion(divRungeKutta);
  let rkAtentados: Array<number[][]> = simulador.getRKAtentados();
  let rkFinesBloqueoCliente: Array<number[][]> = simulador.getRKFinesBloqueoCliente();
  let rkFinesBloqueoServidor: Array<number[][]> = simulador.getRKFinesBloqueoServidor();

  if (rkAtentados.length > 0) {
    divRungeKutta.innerHTML += '<h1 class="text-center">Tablas de Runge-Kutta de tiempos de llegada de atentados:</h1>';
    for (let i: number = 0; i < rkAtentados.length; i++) {
      let tabla: string = HTMLUtils.crearTablaRK(rkAtentados[i], 'A');
      divRungeKutta.innerHTML += tabla;
    }
  }

  if (rkFinesBloqueoCliente.length > 0) {
    divRungeKutta.innerHTML += '<h1 class="text-center">Tablas de Runge-Kutta de tiempos de bloqueo de llegadas:</h1>';
    for (let i: number = 0; i < rkFinesBloqueoCliente.length; i++) {
      let tabla: string = HTMLUtils.crearTablaRK(rkFinesBloqueoCliente[i], 'L');
      divRungeKutta.innerHTML += tabla;
    }
  }

  if (rkFinesBloqueoServidor.length > 0) {
    divRungeKutta.innerHTML += '<h1 class="text-center">Tablas de Runge-Kutta de tiempos de bloqueo del empleado de Chequeo de Billetes:</h1>';
    for (let i: number = 0; i < rkFinesBloqueoServidor.length; i++) {
      let tabla: string = HTMLUtils.crearTablaRK(rkFinesBloqueoServidor[i], 'S');
      divRungeKutta.innerHTML += tabla;
    }
  }
}

const simular = () => {
  // Validamos los parámetros ingresados por el usuario.
  if (!validarParametros())
    return;

  switch (cboJuntarVentanilla.value) {
    // Simulación juntando las ventanillas de venta y facturación.
    case "1": {
      var startTime = performance.now()
      HTMLUtils.limpiarTablaSimulacion(tablaSimulacionAlternativa, cantEncabezadosTablaSimulacionAlt, cantSubEncabezadosTablaSimulacionAlt);
      console.log(`La limpieza tardó ${performance.now() - startTime} milisegundos`);

      // Realizamos la simulación alternativa.
      startTime = performance.now();
      simulador = new SimuladorColasAlternativo();
      simulador.simular(n, eventoDesde, mediaLlegadaPasajero, AFinFacturacion, BFinFacturacion, mediaVentaBillete, mediaChequeoBilletes, desEstChequeoBilletes, mediaControlMetales, mediaPasoEntreZonas);
      console.log(`La simulación tardó ${performance.now() - startTime} milisegundos`);

      matrizEstado = simulador.getMatrizEstado();
      cantMaxPasajeros = simulador.getCantMaxPasajerosEnSistema();
      
      // Cargamos la tabla a mostrar.
      startTime = performance.now()
      HTMLUtils.completarEncabezadosPasajeros(cantMaxPasajeros, tablaSimulacionAlternativa, colPasajerosAlt);
      HTMLUtils.llenarTablaSimulacion(matrizEstado, indicesEventosCandidatosAlt, tablaSimulacionAlternativa);
      console.log(`La renderización tardó ${performance.now() - startTime} milisegundos`);
      HTMLUtils.mostrarSeccion(divTablaSimulacionAlternativa);
      break;
    }

    // Simulación con las ventanillas de venta y facturación separadas.
    case "2": {
      var startTime = performance.now();
      HTMLUtils.limpiarTablaSimulacion(tablaSimulacion, cantEncabezadosTablaSimulacion, cantSubEncabezadosTablaSimulacion);
      console.log(`La limpieza tardó ${performance.now() - startTime} milisegundos`);

      // Realizamos la simulación.
      startTime = performance.now();
      simulador = new SimuladorColas();
      simulador.simular(n, eventoDesde, mediaLlegadaPasajero, AFinFacturacion, BFinFacturacion, mediaVentaBillete, mediaChequeoBilletes, desEstChequeoBilletes, mediaControlMetales, mediaPasoEntreZonas);
      console.log(`La simulación tardó ${performance.now() - startTime} milisegundos`);

      matrizEstado = simulador.getMatrizEstado();
      cantMaxPasajeros = simulador.getCantMaxPasajerosEnSistema();

      // Cargamos la tabla a mostrar.
      startTime = performance.now();
      HTMLUtils.completarEncabezadosPasajeros(cantMaxPasajeros, tablaSimulacion, colPasajeros);
      HTMLUtils.llenarTablaSimulacion(matrizEstado, indicesEventosCandidatos, tablaSimulacion);
      console.log(`La renderización tardó ${performance.now() - startTime} milisegundos`);
      HTMLUtils.mostrarSeccion(divTablaSimulacion);
      break;
    }
  }
}

// Validación de los parámetros del usuario.
function validarParametros(): boolean {
  if (txtCantNros.value === '' || txtEventoDesde.value === '') {
    alert('Tiene que ingresar todos los parámetros solicitados.');
    return false;
  }

  if ( Number(cboJuntarVentanilla.value) <= 0 || Number(cboJuntarVentanilla.value) > 2) {
    alert('Seleccione si desea juntar las ventanillas.');
    return false;
  }

  n = Number(txtCantNros.value);
  eventoDesde = Number(txtEventoDesde.value);
  mediaLlegadaPasajero = Number(txtMediaLlegadaPasajeros.value);
  AFinFacturacion = Number(txtAFinDeFacturacion.value);
  BFinFacturacion = Number(txtBFinDeFacturacion.value);
  mediaVentaBillete = Number(txtMediaFinVentaBillete.value);
  mediaChequeoBilletes = Number(txtMediaFinChequeoBillete.value);
  desEstChequeoBilletes = Number(txtDesEstFinChequeoBillete.value);
  mediaControlMetales = Number(txtMediaFinControlMetales.value);
  mediaPasoEntreZonas = Number(txtMediaFinPasoEntreZonas.value);

  if (n <= 0) {
    alert('La cantidad de eventos a generar debe ser mayor a cero.');
    return false;
  }
  if (eventoDesde < 0 || eventoDesde > n) {
    alert('El evento desde ingresado debe estar comprendido entre 0 y ' + n + '.');
    return false;
  }
  if (mediaLlegadaPasajero < 0 || mediaVentaBillete < 0 || mediaChequeoBilletes < 0 || mediaControlMetales < 0 || mediaPasoEntreZonas < 0) {
    alert('La media no puede ser un valor negativo.');
    return false;
  }
  if (AFinFacturacion >= BFinFacturacion) {
    alert('El valor de "B" debe ser mayor a "A".');
    return false;
  }
  if (desEstChequeoBilletes < 0){
    alert('La desviación estándar no puede ser un valor negativo.');
    return false
  }
  return true;
}