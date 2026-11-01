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
                <p>El sitio <strong>no usa cookies de publicidad ni de seguimiento de terceros.</strong> Solo guarda en tu navegador preferencias que tú eliges, como el tema claro u oscuro o el idioma, para recordarlas en tu próxima visita. Eso funciona sin identificarte.</p>
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
