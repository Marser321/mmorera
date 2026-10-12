import type { Metadata } from "next";
import { BotDemoGallery } from "@/components/bot-studio/BotDemoGallery";

export const metadata: Metadata = {
  title: { absolute: "Demos de bots — Mario Morera" },
  description: "Explora cinco asistentes de ejemplo diseñados para distintos rubros, con respuestas acotadas y contenido ficticio.",
  alternates: {
    canonical: "https://mmorera.agency/demos/bots",
    languages: {
      es: "https://mmorera.agency/demos/bots",
      en: "https://mmorera.agency/en/demos/bots",
      "x-default": "https://mmorera.agency/demos/bots",
    },
  },
};

export default function BotDemosPage() {
  return <BotDemoGallery />;
}
