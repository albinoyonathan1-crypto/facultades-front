export interface MensajeDTO {
    id?: number;
    contenido?: string;      
    idEmisor?:number;       
    idReceptor?: number;     
    fecha?: Date;            
    leida?: boolean;         
}
