import type { Metadata } from "next";
import { LegalDocument } from "@/app/privacidad/_components/LegalDocument";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "Qué guarda este sitio en tu navegador y por qué.",
  alternates: {
    canonical: "/cookies",
    languages: { es: "/cookies", en: "/en/cookies" },
  },
};

export default function LegalPage() {
  return (
    <LegalDocument
      language="es"
      label={"Política de cookies"}
      title={"Cookies: solo lo necesario."}
      intro={"Qué guarda este sitio en tu navegador y por qué."}
      sections={[
        {
          id: "que-uso-hoy",
          title: "Qué uso hoy",
          content: (
            <>
                <p>El sitio <strong>no usa cookies de publicidad ni de seguimiento de terceros.</strong> Solo guarda en el almacenamiento local de tu navegador tres preferencias, para que el sitio se vea como lo dejaste:</p>
                <ul>
                  <li><strong>Tema</strong> (claro u oscuro).</li>
                  <li><strong>Idioma</strong> que elegiste.</li>
                  <li><strong>Recorrido</strong> que estabas viendo (diseño o software), que se actualiza al visitar esas secciones.</li>
                </ul>
                <p>Nada de eso te identifica ni se envía a terceros.</p>
            </>
          ),
        },
        {
          id: "demos-de-otros-sitios",
          title: "Demos de otros sitios",
          content: (
            <>
                <p>Algunas páginas abren, dentro del sitio, una demo de un cliente o un recorrido o video alojado en otro servicio, como Kuula, SuperSplat o YouTube. Esos sitios son de terceros y pueden usar sus propias cookies según su política. Solo se cargan si tú los abres.</p>
            </>
          ),
        },
        {
          id: "si-eso-cambia",
          title: "Si eso cambia",
          content: (
            <>
                <p>Si en el futuro sumo analítica o cualquier herramienta que use cookies no esenciales, voy a pedirte permiso antes de activarla y a listarla acá, con su proveedor y su finalidad.</p>
            </>
          ),
        },
        {
          id: "como-borrarlas",
          title: "Cómo borrarlas",
          content: (
            <>
                <p>Puedes borrar lo que el sitio guarda desde la configuración de tu navegador, en «Datos de sitios» o «Cookies».</p>
            </>
          ),
        },
      ]}
    />
  );
}
