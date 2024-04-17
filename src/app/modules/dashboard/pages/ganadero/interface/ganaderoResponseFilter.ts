// To parse this data:
//
//   import { Convert, GanaderoResponseFilter } from "./file";
//
//   const ganaderoResponseFilter = Convert.toGanaderoResponseFilter(json);

import { UbicacionList } from "./ganaderoResponsePage";

export interface GanaderoResponseFilter {
  ganadero: Ganadero[];
}

export interface Ganadero {
  id:              number;
  identificacion:  string;
  firstName:       string;
  lastName:        string;
  phone:           string;
  marcasGanadera:  MarcasGanadera[];
  supportDocument: SupportDocument;
}

export interface MarcasGanadera {
  id:            number;
  description:   string;
  etiqueta:      string;
  urlImage:      string;
  similitud:     number;
  ubicacionList: UbicacionList[];
}

export interface SupportDocument {
  id:       number;
  fileName: string;
  urlFile:  string;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toGanaderoResponseFilter(json: string): GanaderoResponseFilter {
      return JSON.parse(json);
  }

  public static ganaderoResponseFilterToJson(value: GanaderoResponseFilter): string {
      return JSON.stringify(value);
  }
}
