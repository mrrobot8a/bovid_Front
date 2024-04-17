import { Ganadero, GanaderoResponseFilter, MarcasGanadera } from "../interface/ganaderoResponseFilter";

export function encontrarUrlFileMayorSimilitud(ganaderoResponseFilter: GanaderoResponseFilter): string | null {
    let urlFileMayorSimilitud: string | null = null;
    let mayorSimilitud = -1; // Inicializamos con un valor que nunca será alcanzado por la similitud

    // Iteramos sobre cada objeto ganadero
    ganaderoResponseFilter.ganadero.forEach((ganadero: Ganadero) => {
        ganadero.marcasGanadera.forEach((marca: MarcasGanadera) => {
            // Convertimos la similitud a número
            const similitud = marca.similitud;
            if (similitud > mayorSimilitud) {
                mayorSimilitud = similitud;
                // Si encontramos una similitud mayor, actualizamos la urlFile
                urlFileMayorSimilitud = ganadero.marcasGanadera[0].urlImage;
            }
        });
    });

    return urlFileMayorSimilitud;
}
