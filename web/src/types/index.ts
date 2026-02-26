export type Pilar = 'tech' | 'media' | 'growth';
export type TipoPago = 'mensual' | 'unico' | 'ambos';
export type CategoriaPortfolio = 'web' | 'app' | 'foto' | 'video' | 'redes' | 'automatizacion';

export interface Servicio {
    id: string;
    nombre: string;
    descripcion: string;
    descripcion_corta: string;
    pilar: Pilar;
    icono: string;
    precio_base: number | null;
    tipo_pago: TipoPago;
    caracteristicas: string[];
    tecnologias: string[];
    orden: number;
}

export interface PlanPrecio {
    id: string;
    nombre: string;
    slug: string;
    descripcion: string;
    precio_mensual: number | null;
    precio_unico: number | null;
    caracteristicas: string[];
    destacado: boolean;
    orden: number;
}

export interface PortfolioItem {
    id: string;
    titulo: string;
    descripcion: string;
    categoria: CategoriaPortfolio;
    imagen_url: string;
    video_url?: string;
    link_externo?: string;
    destacado: boolean;
}

export interface ContactFormData {
    nombre: string;
    email: string;
    telefono?: string;
    empresa?: string;
    servicios_interes: string[];
    plan_seleccionado?: string;
    mensaje?: string;
}
