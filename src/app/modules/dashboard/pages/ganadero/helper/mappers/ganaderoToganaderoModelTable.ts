import { GanaderoModelTable } from "../../interface/ganaderoApiToModelTable";

import { map } from 'rxjs';
import { Content, MarcasGanadera } from "../../interface/ganaderoResponsePage";

// export function mapToGanaderoModelTable(datos: Content[]): GanaderoModelTable[] {
//   return datos.map((ganadero) => {
//     const ubicacion = ganadero.marcasGanadera.length > 0 ? ganadero.marcasGanadera[0].ubicacionList[0] : null;

//     return {
//       id: ganadero.id,
//       identificacion: ganadero.identificacion,
//       firstName: ganadero.firstName,
//       lastName: ganadero.lastName,
//       phone: ganadero.phone,
//       departamento: ubicacion ? ubicacion.nameDepartamento : undefined,
//       municipio: ubicacion ? ubicacion.nameMunicipio : undefined,
//       ubicacion: ubicacion ? ubicacion.direction : undefined,
//       urlImage: ganadero.marcasGanadera.length > 0 ? ganadero.marcasGanadera[0].urlImage : undefined,
//       zona: ubicacion ? ubicacion.zona.codigoPostalCode : undefined,
//       marcasGanadera: []
//     };
//   });
// }

export function mapToGanaderoModelTable(ganaderos: Content[]): GanaderoModelTable[] {
  const nuevosGanaderos: GanaderoModelTable[] = [];

  ganaderos.forEach(ganadero => {
    if (ganadero.marcasGanadera && ganadero.marcasGanadera.length > 0) {
      ganadero.marcasGanadera.forEach((marca, index) => {
        const nuevoGanadero: GanaderoModelTable = {
          id: ganadero.id,
          identificacion: ganadero.identificacion,
          firstName: ganadero.firstName,
          lastName: ganadero.lastName,
          phone: ganadero.phone,
          idMarca: marca.id,
          document: ganadero.supportDocument?.fileName,
          departamento: marca.ubicacionList[0].nameDepartamento,
          municipio: marca.ubicacionList[0].nameMunicipio,
          ubicacion: marca.ubicacionList[0].direction,
          urlImage: marca.urlImage,
          zona: marca.ubicacionList[0].zona.codigoPostalCode.toString() // Supongo que la zona se mantiene igual para todas las marcas
        };
        nuevosGanaderos.push(nuevoGanadero);
      });
    } else {
      const nuevoGanadero: GanaderoModelTable = {
        id: ganadero.id,
        identificacion: ganadero.identificacion,
        firstName: ganadero.firstName,
        lastName: ganadero.lastName,
        phone: ganadero.phone,
        document: ganadero.supportDocument?.fileName,
        departamento: 'marca no asignada',
        municipio: 'marca no asignada',
        ubicacion: 'marca no asignada',
        urlImage: 'marca no asignada',
        zona: 'marca no asignada'
      };
      nuevosGanaderos.push(nuevoGanadero);
    }
  });

  // Ordenar por apellidos
  nuevosGanaderos.sort((a, b) => {
    if (a.lastName && b.lastName) {
      return a.lastName.localeCompare(b.lastName);
    } else {
      return 0; // Si algún ganadero no tiene apellido, mantener el orden original
    }
  });

  return nuevosGanaderos;
}

