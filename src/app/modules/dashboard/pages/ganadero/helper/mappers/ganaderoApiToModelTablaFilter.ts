import { Ganadero, GanaderoResponseFilter } from "../../interface/ganaderoResponseFilter";
import { UbicacionList } from "../../interface/ganaderoResponsePage";

export interface GanaderoResultante {
  nombreCompleto: string;
  identificacion: string;
  etiqueta: string;
  similitud: string;
  idMarca?: string;
  departamento?: string;
  municipio?: string;
  ubicacion?: string;
  urlImage?: string;
  zona?: string

}
export function mapGanaderosToGanaderosResultantes(ganaderos: Ganadero[]): GanaderoResultante[] {
  const ganaderosResultantes: GanaderoResultante[] = [];

  ganaderos.forEach(ganadero => {
    // Obtener el nombre completo combinando firstName y lastName
    const nombreCompleto = `${ganadero.firstName} ${ganadero.lastName}`;

    // Mapear cada marca ganadera del ganadero a un GanaderoResultante
    ganadero.marcasGanadera.forEach((marcaGanadera) => {
      const ganaderoResultante: GanaderoResultante = {
        nombreCompleto: nombreCompleto,
        identificacion: ganadero.identificacion,
        etiqueta: marcaGanadera.etiqueta,
        similitud: Math.floor(marcaGanadera.similitud * 100).toString() + '%', // Convertir similitud a string
        departamento: marcaGanadera.ubicacionList[0]?.nameDepartamento,
        municipio: marcaGanadera.ubicacionList[0]?.nameMunicipio,
        ubicacion: marcaGanadera.ubicacionList[0]?.direction,
        urlImage: marcaGanadera.urlImage,
        zona: marcaGanadera.ubicacionList[0]?.zona.codigoPostalCode
      };

      ganaderosResultantes.push(ganaderoResultante);
    });
  });

  return ganaderosResultantes;
}
