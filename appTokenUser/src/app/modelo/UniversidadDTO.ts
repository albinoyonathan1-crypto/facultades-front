
import { CalificacionDTO } from "./calificacion";
import { CarreraDTO } from "./CarreraDTO";
import { ComentarioDTO } from "./ComentarioDTO";

export interface UniversidadDTO {
    id?: number;
    nombre?: string;
    imagen?: string;
    direccion?: string;
    descripcion?: string;
    direccionWeb?: string;
    usuarioId?:number;
    listaCarreras?: CarreraDTO[];
    listaCalificacion?: CalificacionDTO[];
    listaComentarios?: ComentarioDTO[];
    eliminacionLogica?:boolean;
}
