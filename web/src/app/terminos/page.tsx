import type { Metadata } from "next";
import { LegalDocument } from "@/app/privacidad/_components/LegalDocument";

export const metadata: Metadata = {
  title: "Términos y condiciones de uso",
  description: "Las reglas para usar mmorera.agency y lo que muestran sus casos.",
  alternates: {
    canonical: "/terminos",
    languages: { es: "/terminos", en: "/en/terminos" },
  },
};

export default function LegalPage() {
  return (
    <LegalDocument
      language="es"
      label={"Términos y condiciones de uso"}
      title={"Lo que puedes esperar de este sitio."}
      intro={"Las reglas para usar mmorera.agency y lo que muestran sus casos."}
      sections={[
        {
          id: "el-sitio",
          title: "El sitio",
          content: (
            <>
                <p>mmorera.agency presenta el trabajo y los servicios de Mario Morera. Usarlo implica aceptar estos términos. Si no estás de acuerdo, no lo uses.</p>
            </>
          ),
        },
        {
          id: "que-muestran-los-casos",
          title: "Qué muestran los casos",
          content: (
            <>
                <ul><li>Los casos describen trabajos reales o demostraciones. <strong>Cuando algo es una demo, un concepto o un ejemplo recreado, está rotulado así.</strong></li><li>Las marcas, logos y capturas de clientes pertenecen a sus titulares y se muestran como referencia del trabajo realizado.</li><li>Un caso <strong>no es una promesa de resultados.</strong> Cada proyecto depende de su contexto, su alcance y quien lo usa.</li></ul>
            </>
          ),
        },
        {
          id: "propiedad-intelectual",
          title: "Propiedad intelectual",
          content: (
            <>
                <p>El diseño, el código, los textos, los films y las animaciones de este sitio son de Mario Morera, salvo las marcas y materiales de terceros. Puedes compartir enlaces y citar fragmentos con mención y enlace a la fuente. No puedes copiar el sitio, sus films o sus componentes para usarlos como propios.</p>
            </>
          ),
        },
        {
          id: "servicios-y-propuestas",
          title: "Servicios y propuestas",
          content: (
            <>
                <p>La información del sitio es orientativa. Ningún texto de esta web es una oferta vinculante: el alcance, los plazos y los precios de cada trabajo se acuerdan por escrito en una propuesta o contrato aparte, que prevalece sobre lo que dice el sitio.</p>
            </>
          ),
        },
        {
          id: "enlaces-a-otros-sitios",
          title: "Enlaces a otros sitios",
          content: (
            <>
                <p>El sitio enlaza a proyectos de clientes y a servicios de terceros. No controlo su contenido ni sus políticas, y no respondo por ellos.</p>
            </>
          ),
        },
        {
          id: "disponibilidad-y-responsabilidad",
          title: "Disponibilidad y responsabilidad",
          content: (
            <>
                <p>Cuido que el sitio funcione y que la información sea correcta, pero puede tener errores o quedar desactualizado, y puede estar fuera de servicio por momentos. En la medida que la ley lo permite, no respondo por daños que surjan del uso del sitio o de la confianza en su contenido sin una propuesta firmada.</p>
            </>
          ),
        },
        {
          id: "uso-aceptable",
          title: "Uso aceptable",
          content: (
            <>
                <p>No uses el sitio ni sus formularios para enviar spam, contenido ilegal o código malicioso, ni para intentar acceder a sistemas que no te corresponden.</p>
            </>
          ),
        },
        {
          id: "ley-aplicable",
          title: "Ley aplicable",
          content: (
            <>
                <p>Estos términos se rigen por las leyes de la República Oriental del Uruguay, y cualquier controversia se somete a sus tribunales competentes. Ante un desacuerdo, primero intentemos resolverlo conversando: <a href="mailto:mario@mmorera.agency">mario@mmorera.agency</a>.</p>
            </>
          ),
        },
        {
          id: "cambios",
          title: "Cambios",
          content: (
            <>
                <p>Puedo actualizar estos términos; la fecha de arriba indica la versión vigente.</p>
            </>
          ),
        },
      ]}
    />
  );
}
