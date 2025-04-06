export interface IngresoPersonal {
  message:    string;
  asistencia: Asistencia;
}

export interface Asistencia {
  id:             string;
  cedula:         number;
  nombrecompleto: string;
  fechaEntrada:   Date;
  horaEntrada:    string;
  estado:         string;
  observacion ?:   string;
  ultima_salida:  UltimaSalida;
}

export interface UltimaSalida {
  tipo_salida:  string;
  fecha_salida: Date;
  fecha_boleta:  null;
}
