export interface TotalPerson {
    message:        string;
    usuarios:       Usuario[];
    totalRegistros: number;
    paginacion:     Paginacion;
}

export interface Paginacion {
    pagina:          number;
    limitePorPagina: number;
}

export interface Usuario {
    id:             string;
    cedula:         number;
    nombrecompleto: string;
    ingreso:        Ingreso[];
    salidas:        Salida[];
}

export interface Ingreso {
    fechaEntrada: Date;
    horaEntrada:  string;
    estado:       string;
}

export interface Salida {
    fechaSalida:    Date;
    horaSalida:     string;
    tipo_de_salida: string;
}
