export interface Empresas {
    message: string;
    datos:   Dato[];
}

export interface Dato {
    empresa:         string;
    total_empleados: number;
}
