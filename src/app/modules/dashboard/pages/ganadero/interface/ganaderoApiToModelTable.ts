import { MarcasGanadera } from "./ganaderoResponsePage";

export interface GanaderoModelTable {
  id: number;
  identificacion?: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  departamento?: string;
  municipio?: string;
  ubicacion?: string;
  urlImage?: string;
  zona?: string
  marcasGanadera?: MarcasGanadera[];
}
