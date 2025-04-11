export interface RegisterPerson {
    message: string;
    persona: Persona;
}

export interface Persona {
    cedula:         string;
    nombrecompleto: string;
    empresa:        string;
    cargo:          string;
    correo:         string;
    jefeInmediato:  string;
}


