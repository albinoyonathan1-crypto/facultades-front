import { PermisoDTO } from "./PermisoDTO";

export interface RolDTO {
    id?: number;
    nombreRol?: string;
    listaPermiso?: PermisoDTO[];
}
