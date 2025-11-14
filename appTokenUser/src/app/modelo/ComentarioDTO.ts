import { ReaccionDTO } from './ReaccionDTO';
import { RespuestaDTO } from './RespuestaDTO';
import { UsuarioDTO } from './UsuarioDTO';

export interface ComentarioDTO {
    id?: number;
    mostrarFormularioEdicion?: boolean;
    mostrarFormularioRespuesta?: boolean;
    usuarioId?:number;
    fecha?: string;
    mostrarRespuestas?:boolean;
    mensaje?: string;
    listaReaccion?: ReaccionDTO[];
    listaRespuesta?: RespuestaDTO[];
    username?:string;
    nickname?:string;
    editado?: boolean;
    eliminado?:boolean;
    imagenUsuario?:string;
}
