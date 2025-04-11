export interface EmpleadosRegistrados {
    message:    string;
    empleados:  Empleado[];
    paginacion: Paginacion;
}

export interface Empleado {
    id:             string;
    cedula:         string;
    nombrecompleto: string;
    empresa:        string;
    cargo:          string;
    jefeInmediato:  string;
    correo:         string;
    fechaRegistro ?:  Date;
}

export interface Paginacion {
    total:        number;
    paginaActual: number;
    totalPaginas: number;
}
