import { Session, HistorialModelTable } from "../../interfaces";


export function mapToHistorialModelTable(data: Session[]): HistorialModelTable[] {
  return data.map((item) => ({
    ipComputer: item.ipComputer,
    fechaInicio: formatFechaWithAMPM(item.fechaIncio), // Asegúrate de corregir la ortografía si fue un error
    fullname: item.users.firtsName + ' ' + item.users.lastName,
    accion:item.accion,
  }));
}


function formatFechaWithAMPM(fecha: string): string {
  const dateObject = new Date(fecha);

  let year = dateObject.getFullYear();
  // Aseguramos que el mes y el día tengan dos dígitos.
  let month = ('0' + (dateObject.getMonth() + 1)).slice(-2);
  let day = ('0' + dateObject.getDate()).slice(-2);
  let hours = dateObject.getHours();
  let minutes = ('0' + dateObject.getMinutes()).slice(-2);
  let seconds = ('0' + dateObject.getSeconds()).slice(-2);
  let ampm = hours >= 12 ? 'PM' : 'AM';

  // Convertimos el formato de 24 horas a 12 horas, ajustando mediodía y medianoche.
  hours = hours % 12;
  hours = hours ? hours : 12; // El valor 0 debería ser 12.
  let hoursStr = ('0' + hours).slice(-2);

  // Construimos la cadena de fecha final con `/`.
  let formattedDate = `${year}/${month}/${day}-${hoursStr}:${minutes}:${seconds}${ampm}`;

  return formattedDate;
}
