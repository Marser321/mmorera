export interface ContactFormData {
    nombre: string;
    email: string;
    telefono?: string;
    empresa?: string;
    servicios_interes: string[];
    plan_seleccionado?: string;
    mensaje: string;
    projectStage: string;
    teamContext: string;
    timeline: string;
    website?: string;
}
