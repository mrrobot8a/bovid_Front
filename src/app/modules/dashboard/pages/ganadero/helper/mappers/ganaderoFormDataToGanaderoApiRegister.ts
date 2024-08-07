import { Content, MarcasGanadera, UbicacionList } from '../../interface/ganaderoResponsePage';

export function mapToContent(jsonData: string,marcaEliminar?:{ marcaId?: string, isElimnado: boolean }[]): Content {

  const data: DataFormGandero = JSON.parse(jsonData);

  const ubicacionListArray: UbicacionList[] = [];
  const MarcasGanaderaArray: MarcasGanadera[] = [];


  const ubicacionList: UbicacionList = {
    nameCorregimiento: data.ubicacion,
    nameMunicipio: data.municipio,
    nameDepartamento: data.departamento,
    direction: data.ubicacion,
    zona: {
      codigoPostalCode: data.zona.toString(),
    }

  }

  ubicacionListArray.push(ubicacionList);


  const marcasGanadera: MarcasGanadera = {
    id: data.idMarca,
    description: data.ubicacion,
    etiqueta: '',
    urlImage: '',
    isDeleted: marcaEliminar ? marcaEliminar.find(x => x.marcaId === data.idMarca)?.isElimnado ?? false : false,
    ubicacionList: ubicacionListArray,
  }

  MarcasGanaderaArray.push(marcasGanadera);


  const content: Content = {
    id: parseInt(data.id),
    identificacion: data.identificacion,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    marcasGanadera: MarcasGanaderaArray,
  };

  return content;
}



interface DataFormGandero {
  id: string;
  firstName: string;
  lastName: string;
  ubicacion: string;
  zona: number;
  identificacion: string;
  phone: string;
  idMarca: string;
  municipio: string;
  departamento: string;
  documentFile: string;
  ListImageFile: string;
}
