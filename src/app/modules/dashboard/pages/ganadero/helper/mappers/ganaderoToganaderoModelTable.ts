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
    if (ganadero.marcasGanadera!.length > 0) {
      ganadero.marcasGanadera!.forEach((marca,index) => {
       console.log('marca',ganadero.marcasGanadera![index].urlImage );
        const nuevoGanadero: GanaderoModelTable = {
          id: ganadero.id,
          identificacion: ganadero.identificacion,
          firstName: ganadero.firstName,
          lastName: ganadero.lastName,
          phone: ganadero.phone,
          idMarca: ganadero.marcasGanadera![index].id,
          departamento: ganadero.marcasGanadera![index].ubicacionList[0].nameDepartamento,
          municipio: ganadero.marcasGanadera![index].ubicacionList[0].nameMunicipio,
          ubicacion: ganadero.marcasGanadera![index].ubicacionList[0].direction,
          urlImage: ganadero.marcasGanadera![index].urlImage,
          zona: ganadero.marcasGanadera![index].ubicacionList[0].zona.codigoPostalCode // Supongo que la zona se mantiene igual para todas las marcas
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
        departamento: ganadero.marcasGanadera![0].ubicacionList[0].nameDepartamento,
        municipio: ganadero.marcasGanadera![0].ubicacionList[0].nameMunicipio,
        ubicacion: ganadero.marcasGanadera![0].ubicacionList[0].direction,
        urlImage: ganadero.marcasGanadera![0].urlImage,
        zona: ganadero.marcasGanadera![0].ubicacionList[0].zona.codigoPostalCode.toString()
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
