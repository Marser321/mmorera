import type { Metadata } from "next";
import { LegalDocument } from "@/app/privacidad/_components/LegalDocument";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Qué información recibo cuando me escribes, para qué la uso y cómo puedes pedir que la borre.",
  alternates: {
    canonical: "/privacidad",
    languages: { es: "/privacidad", en: "/en/privacidad" },
  },
};

export default function LegalPage() {
  return (
    <LegalDocument
      language="es"
      label={"Política de privacidad"}
      title={"Tus datos sirven para responderte. Nada más."}
      intro={"Qué información recibo cuando me escribes, para qué la uso y cómo puedes pedir que la borre."}
      sections={[
        {
          id: "quien-es-responsable",
          title: "Quién es responsable",
          content: (
            <>
                <p>Mario Morera, profesional independiente que opera este sitio (mmorera.agency). Contacto para todo lo relacionado con tus datos: <a href="mailto:mario@mmorera.agency">mario@mmorera.agency</a>.</p>
            </>
          ),
        },
        {
          id: "que-datos-recibo",
          title: "Qué datos recibo",
          content: (
            <>
                <ul><li><strong>Lo que escribes en el formulario de proyecto:</strong> nombre, email, empresa o proyecto (opcional), etapa del proyecto, contexto del equipo, descripción y momento estimado de inicio.</li><li><strong>Lo que me envías por email o WhatsApp,</strong> cuando eliges esos canales.</li><li><strong>Datos técnicos mínimos</strong> que cualquier sitio recibe para funcionar (dirección IP, tipo de navegador), procesados por el proveedor de hosting.</li></ul>
                <p>No pidas ni envíes contraseñas, credenciales, datos de pago ni información sensible (salud, por ejemplo) por estos canales.</p>
            </>
          ),
        },
        {
          id: "para-que-los-uso",
          title: "Para qué los uso",
          content: (
            <>
                <ul><li>Leer tu consulta, evaluar si puedo ayudarte y responderte.</li><li>Continuar la conversación y, si trabajamos juntos, preparar una propuesta.</li></ul>
                <p>No vendo tus datos, no los uso para publicidad de terceros y no te sumo a listas de correo sin tu permiso.</p>
            </>
          ),
        },
        {
          id: "con-quien-se-comparten",
          title: "Con quién se comparten",
          content: (
            <>
                <p>Solo con los servicios que hacen funcionar el sitio y la comunicación:</p>
                <ul><li><strong>Hosting del sitio:</strong> Vercel.</li><li><strong>Avisos internos del formulario:</strong> email y Telegram, para que vea tu consulta a tiempo.</li><li><strong>Registro de seguimiento (CRM),</strong> cuando está configurado, para no perder el hilo.</li></ul>
                <p>Cada proveedor trata los datos según sus propias políticas y solo para prestar ese servicio.</p>
            </>
          ),
        },
        {
          id: "cuanto-tiempo-los-guardo",
          title: "Cuánto tiempo los guardo",
          content: (
            <>
                <p>Mientras la conversación siga activa y hasta 24 meses después del último contacto, salvo que pidas borrarlos antes o que una obligación legal exija conservarlos más tiempo.</p>
            </>
          ),
        },
        {
          id: "tus-derechos",
          title: "Tus derechos",
          content: (
            <>
                <p>Puedes pedirme <strong>acceder</strong> a tus datos, <strong>corregirlos</strong>, <strong>borrarlos</strong> u <strong>oponerte</strong> a su uso, escribiendo a <a href="mailto:mario@mmorera.agency">mario@mmorera.agency</a>. Respondo dentro de los plazos que fija la Ley N.º 18.331 de Protección de Datos Personales de Uruguay. Si consideras que no se respetaron tus derechos, puedes presentar un reclamo ante la Unidad Reguladora y de Control de Datos Personales (URCDP).</p>
            </>
          ),
        },
        {
          id: "cookies",
          title: "Cookies",
          content: (
            <>
                <p>Ver la <a href="/cookies">política de cookies</a>.</p>
            </>
          ),
        },
        {
          id: "menores",
          title: "Menores",
          content: (
            <>
                <p>Este sitio está pensado para empresas y profesionales. No recibo a sabiendas datos de menores de edad.</p>
            </>
          ),
        },
        {
          id: "cambios",
          title: "Cambios",
          content: (
            <>
                <p>Si esta política cambia, actualizo la fecha de arriba. Los cambios importantes los aviso en esta misma página.</p>
            </>
          ),
        },
      ]}
    />
  );
}
