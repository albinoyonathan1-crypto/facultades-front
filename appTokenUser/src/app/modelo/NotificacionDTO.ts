import { UsuarioDTO } from "./UsuarioDTO";
import { UsuarioLeidoDTO } from "./UsuarioLeidoDTO";

export interface NotificacionDTO {
    id?: number;
    informacion?: string;
    idRedireccionamiento?: number;
    leida?: boolean;
    carrera?: boolean;
    comentario?: boolean;
    usuario?: boolean;
    universidad?: boolean;
    permiso?: boolean;
    respuesta?: boolean;
    fecha?: string;
    publicacionComentada?:boolean;
    respuestaComentarioRecibida?:boolean;
    respuestaAunaRespuesta?:boolean;
    carreraAgregada?:boolean;
    comentarioAgregadoCarrera?:boolean;
    auditada?:boolean;
    // Representa solo los IDs de los usuarios en la lista
    listaUsuariosIds?: number[];
  
    // Representa solo los IDs de los usuarios leídos
    listaDeusuariosLeidosIds?: number[];

}