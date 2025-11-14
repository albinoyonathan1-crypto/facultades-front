
import { CalificacionDTO } from './calificacion';
import { ComentarioDTO } from './ComentarioDTO';

export interface CarreraDTO {
    id?: number;
    nombre?: string;
    grado?: string;
    duracion?: string;
    activa?: boolean;
    listaComentarios?: ComentarioDTO[];
    listaCalificacion?: CalificacionDTO[];
    universidadId?: number;
    idUsuario?:number;
    eliminacionLogica?:boolean;

}
