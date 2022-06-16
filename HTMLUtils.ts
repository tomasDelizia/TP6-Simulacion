export module HTMLUtils {

  // Función para ocultar un elemento div.
  export function ocultarSeccion(div: HTMLDivElement): void {
    div.style.display = 'none';
  }

  // Función para mostrar un elemento div.
  export function mostrarSeccion(div: HTMLDivElement): void {
    div.style.display = 'block';
  }

  // Función que elimina todas las filas de la tabla HTML excepto los encabezados.
  export function limpiarTablaSimulacion(tabla: HTMLTableElement, cantEncabezados: number, cantSubEncabezados: number) {
    for (let i: number = tabla.rows.length; i > 2; i--)
      tabla.deleteRow(i - 1);
 
    // Limpiamos los encabezados correspondientes a los pasajeros.
    for (let i: number = tabla.rows[0].cells.length; i > cantEncabezados; i--)
      tabla.rows[0].deleteCell(i - 1);

    for (let i: number = tabla.rows[1].cells.length; i > cantSubEncabezados; i--)
      tabla.rows[1].deleteCell(i - 1);  
  }

  // Crea una fila a una tabla html a partir de un vector pasado por parámetro.
  export function crearFilaTablaSimulacion(fila: string[], indicesColor: number[]): string {
    let filaHTML: string = "<tr>";
    for (let i: number = 0; i < fila.length; i++) {
      let celdaHTML: string = "<td";
      for (let j: number = 0; j < indicesColor.length; j++) {
        if (i == indicesColor[j])
          celdaHTML += ' style="color: red"';
      }
      celdaHTML += ">";
      const valorCelda: string = !(typeof fila[i] === 'undefined' || fila[i] == 'null' || fila[i] === '-1.0000' || fila[i] === '') ? fila[i] : '-';
      celdaHTML += valorCelda + "</td>";
      filaHTML += celdaHTML;
    }
    filaHTML += "</tr>"
    return filaHTML;
  }

  // Carga de tabla html.
  export function llenarTablaSimulacion(matriz: any[][], indicesColor: number[], tabla: HTMLTableElement): void {
    tabla.hidden = true;
    let bodyTabla: string = "";
    for (let i: number = 0; i < matriz.length; i++) {
      let filaHTML: string = crearFilaTablaSimulacion(matriz[i], indicesColor);
      bodyTabla += filaHTML;
    }
    tabla.tBodies[0].innerHTML = bodyTabla;
    tabla.hidden = false;
  }

  // Completa los encabezados de la tabla con los datos de los pasajeros.
  export function completarEncabezadosPasajeros(cantPasajeros: number, tabla: HTMLTableElement, columnas: string[]): void {
    let encabezados: HTMLTableRowElement = tabla.rows[0];
    let subEncabezados: HTMLTableRowElement = tabla.rows[1];

    for (let i: number = 0; i < cantPasajeros; i++) {
      let col: HTMLTableHeaderCellElement = encabezados.insertCell();
      col.colSpan = columnas.length;
      col.style.fontWeight = "bold";
      col.appendChild(document.createTextNode('Pasajero N° ' + (i+1)));

      for (let j: number = 0; j < columnas.length; j++) {
        let subCol: HTMLTableHeaderCellElement = subEncabezados.insertCell();
        subCol.style.fontWeight = "bold";
        subCol.appendChild(document.createTextNode(columnas[j]));
      }
    }
  }

  export function crearTablaRK(matriz: number[][], y: string): string {
    let tabla: string = '<div class="table-responsive scrollable row mb-3 mx-3">';
    tabla += '<table class="table table-hover table-bordered mx-3 mb-3">';
    tabla += `
    <thead>
      <tr>'
        <th>ti</th>
        <th>${y}i</th>
        <th>K1</th>
        <th>K2</th>
        <th>K3</th>
        <th>K4</th>
        <th>ti+1</th>
        <th>${y}i+1</th>
      </tr>
    </thead>`;
    tabla += '<tbody>';
    for (let i: number = 0; i < matriz.length; i++) {
      let fila: string = '<tr>';
      for (let j: number = 0; j < 8; j++) {
        fila += `<td>${matriz[i][j].toFixed(4)}</td>`;
      }
      fila += '</tr>';
      tabla += fila;
    }
    tabla += '</tbody></table></div>';
    return tabla;
  }
}