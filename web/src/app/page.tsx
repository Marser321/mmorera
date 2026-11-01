import type { Metadata } from "next";
import { HomeExperience } from "@/components/premium/HomeExperience";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("inicio", "es");

// Estática a propósito: el Home no depende de la URL, así se sirve desde la CDN.
export default function HomePage() {
  return <HomeExperience />;
}
