export interface SalidaPersonal {
    message:          string;
    asistenciasalida: Asistenciasalida;
}

export interface Asistenciasalida {
    id:             string;
    cedula:         number;
    tipo_de_salida: string;
    fechaSalida:    Date;
    horaSalida:     string;
}
