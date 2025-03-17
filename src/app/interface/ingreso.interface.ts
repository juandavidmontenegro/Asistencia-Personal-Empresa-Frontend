export interface IngresoPersonal {
  message:    string;
  asistencia: Asistencia;
}

export interface Asistencia {
  id:           string;
  cedula:       number;
  fechaEntrada: Date;
  horaEntrada:  string;
  estado:       string;
}

