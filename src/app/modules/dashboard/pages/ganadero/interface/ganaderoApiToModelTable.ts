import { MarcasGanadera } from "./ganaderoResponsePage";

export interface GanaderoModelTable {
  id: number;
  identificacion?: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  departamento?: string;
  idMarca?: string;
  municipio?: string;
  ubicacion?: string;
  urlImage?: string;
  document?: string;
  zona?: string
  marcasGanadera?: MarcasGanadera[];
}

export interface ErrorMessages {
  [key: string]: string;
}
