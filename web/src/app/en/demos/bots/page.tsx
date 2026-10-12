import type { Metadata } from "next";
import { BotDemoGallery } from "@/components/bot-studio/BotDemoGallery";

export const metadata: Metadata = {
  title: { absolute: "Bot demos — Mario Morera" },
  description: "Explore five sample assistants designed for different industries, with scoped responses and fictional content.",
  alternates: {
    canonical: "https://mmorera.agency/en/demos/bots",
    languages: {
      es: "https://mmorera.agency/demos/bots",
      en: "https://mmorera.agency/en/demos/bots",
      "x-default": "https://mmorera.agency/demos/bots",
    },
  },
};

export default function EnglishBotDemosPage() {
  return <BotDemoGallery />;
}
