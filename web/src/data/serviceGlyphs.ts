import { LuCalendarCheck, LuMonitorSmartphone, LuSparkles, LuWorkflow } from "react-icons/lu";
import type { Tech } from "./techStack";

/**
 * Glifos de servicio para el campo de partículas: cuando el visitante enfoca
 * un servicio en el hero, las partículas dibujan su ícono en vez de un logo
 * del stack. Viven fuera de TECH_STACK para no aparecer en órbitas ni listas.
 */
export const SERVICE_GLYPHS: Record<string, Tech> = {
  "web-ecommerce": { name: "service:web-ecommerce", category: "Web", Icon: LuMonitorSmartphone },
  "booking-payments": { name: "service:booking-payments", category: "Commerce", Icon: LuCalendarCheck },
  "crm-automation": { name: "service:crm-automation", category: "CRM", Icon: LuWorkflow },
  "ai-software": { name: "service:ai-software", category: "AI", Icon: LuSparkles },
};

export const SERVICE_GLYPH_TECHS: Tech[] = Object.values(SERVICE_GLYPHS);
