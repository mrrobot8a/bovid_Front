// To parse this data:
//
//   import { Convert, GanaderoResponsePage } from "./file";
//
//   const ganaderoResponsePage = Convert.toGanaderoResponsePage(json);

export interface GanaderoResponsePageble {
  success: boolean;
  ganadero: Ganadero;
  mensaje: string;
}

export interface Ganadero {
  content: Content[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}



export interface Content {
  id: number;
  identificacion: string;
  firstName: string;
  lastName: string;
  phone: string;
  marcasGanadera: MarcasGanadera[];
  supportDocument?: SupportDocument;
}

export interface SupportDocument {
  id: number;
  fileName: string;
  urlFile: string;
}

export interface MarcasGanadera {
  description: string;
  etiqueta: string;
  urlImage: string;
  ubicacionList: UbicacionList[];
}

export interface UbicacionList {
  nameCorregimiento: string;
  nameMunicipio: string;
  nameDepartamento: string;
  direction: string;
  zona: Zona;
}

export interface Zona {
  codigoPostalCode: string;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toGanaderoResponsePage(json: string): GanaderoResponsePageble {
    return JSON.parse(json);
  }

  public static ganaderoResponsePageToJson(value: GanaderoResponsePageble): string {
    return JSON.stringify(value);
  }
}
