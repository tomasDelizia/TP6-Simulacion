import { HTMLUtils } from './HTMLUtils';
import { RungeKutta } from './RungeKutta';
import { Simulador } from './Simulador';
import { SimuladorColas } from './SimuladorColas';
import { SimuladorColasAlternativo } from './SimuladorColasAlternativo';
import './style.css';

// Definición de los cuadros de texto de la interfaz de usuario.
const txtCantNros: HTMLInputElement = document.getElementById('txtCantNros') as HTMLInputElement;
const txtEventoDesde: HTMLInputElement = document.getElementById('txtEventoDesde') as HTMLInputElement;

// Definición de los combo box de la interfaz de usuario.
const cboJuntarVentanilla: HTMLSelectElement = document.getElementById('cboJuntarVentanilla') as HTMLSelectElement;

// Definición de la secciones de la simulación.
const divTablaSimulacion: HTMLDivElement = document.getElementById('divTablaSimulacion') as HTMLDivElement;
const divTablaSimulacionAlternativa: HTMLDivElement = document.getElementById('divTablaSimulacionAlternativa') as HTMLDivElement;

// Definición de la tablas de simulación de colas.
const tablaSimulacion: HTMLTableElement = document.getElementById('tablaSimulacion') as HTMLTableElement;
const cantEncabezadosTablaSimulacion = tablaSimulacion.rows[0].cells.length;
const cantSubEncabezadosTablaSimulacion = tablaSimulacion.rows[1].cells.length;
const tablaSimulacionAlternativa: HTMLTableElement = document.getElementById('tablaSimulacionAlternativa') as HTMLTableElement;
const cantEncabezadosTablaSimulacionAlt = tablaSimulacionAlternativa.rows[0].cells.length;
const cantSubEncabezadosTablaSimulacionAlt = tablaSimulacionAlternativa.rows[1].cells.length;
const indicesEventosCandidatos: number[] = [5, 10, 13, 17, 20];
const indicesEventosCandidatosAlt: number[] = [5, 10, 11, 15, 18];
const colPasajeros: string[] = ['ID Pasajero', 'Tipo Pasajero', 'Estado', 'Minuto llegada', 'Minuto llegada de venta a facturación', 'Minuto llegada de facturación a control', 'Minuto llegada de chequeo a control', 'Minuto llegada de control a embarque'];
const colPasajerosAlt: string[] = ['ID Pasajero', 'Tipo Pasajero', 'Estado', 'Minuto llegada', 'Minuto llegada de venta-facturación a control', 'Minuto llegada de chequeo a control', 'Minuto llegada de control a embarque'];

// Definición de botones de la interfaz de usuario.
const btnSimular: HTMLButtonElement = document.getElementById('btnSimular') as HTMLButtonElement;

// Definición de los objetos que realizan la simulación de colas.
let simulador: Simulador;
let matrizEstado: string[][];
let cantMaxPasajeros: number;

// Definición de los parámetros.
let n: number;
let eventoDesde: number;

//Ocultamos la seccion en donde esta la tabla.
HTMLUtils.ocultarSeccion(divTablaSimulacion);
HTMLUtils.ocultarSeccion(divTablaSimulacionAlternativa);

// Disparamos la simulación.
btnSimular.addEventListener('click', () => {
  HTMLUtils.ocultarSeccion(divTablaSimulacion);
  HTMLUtils.ocultarSeccion(divTablaSimulacionAlternativa);
  simular();
});

const simular = () => {
  // Validamos los parámetros ingresados por el usuario.
  if (!validarParametros())
    return;

  switch (cboJuntarVentanilla.value) {
    // Simulación juntando las ventanillas de venta y facturación.
    case "1": {
      var startTime = performance.now()
      HTMLUtils.limpiarTabla(tablaSimulacionAlternativa, cantEncabezadosTablaSimulacionAlt, cantSubEncabezadosTablaSimulacionAlt);
      console.log(`La limpieza tardó ${performance.now() - startTime} milisegundos`);

      // Realizamos la simulación alternativa.
      startTime = performance.now();
      simulador = new SimuladorColasAlternativo();
      simulador.simular(n, eventoDesde);
      console.log(`La simulación tardó ${performance.now() - startTime} milisegundos`);

      matrizEstado = simulador.getMatrizEstado();
      cantMaxPasajeros = simulador.getCantMaxPasajerosEnSistema();
      
      // Cargamos la tabla a mostrar.
      startTime = performance.now()
      HTMLUtils.completarEncabezadosPasajeros(cantMaxPasajeros, tablaSimulacionAlternativa, colPasajerosAlt);
      HTMLUtils.llenarTabla(matrizEstado, indicesEventosCandidatosAlt, tablaSimulacionAlternativa);
      console.log(`La renderización tardó ${performance.now() - startTime} milisegundos`);
      HTMLUtils.mostrarSeccion(divTablaSimulacionAlternativa);
      break;
    }

    // Simulación con las ventanillas de venta y facturación separadas.
    case "2": {
      var startTime = performance.now();
      HTMLUtils.limpiarTabla(tablaSimulacion, cantEncabezadosTablaSimulacion, cantSubEncabezadosTablaSimulacion);
      console.log(`La limpieza tardó ${performance.now() - startTime} milisegundos`);

      // Realizamos la simulación.
      startTime = performance.now();
      simulador = new SimuladorColas();
      simulador.simular(n, eventoDesde);
      console.log(`La simulación tardó ${performance.now() - startTime} milisegundos`);

      matrizEstado = simulador.getMatrizEstado();
      cantMaxPasajeros = simulador.getCantMaxPasajerosEnSistema();

      // Cargamos la tabla a mostrar.
      startTime = performance.now();
      HTMLUtils.completarEncabezadosPasajeros(cantMaxPasajeros, tablaSimulacion, colPasajeros);
      HTMLUtils.llenarTabla(matrizEstado, indicesEventosCandidatos, tablaSimulacion);
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

  if (n <= 0) {
    alert('La cantidad de eventos a generar debe ser mayor a cero.');
    return false;
  }
  if (eventoDesde < 0 || eventoDesde > n) {
    alert('El evento desde ingresado debe estar comprendido entre 0 y ' + n + '.');
    return false;
  }
  return true;
}