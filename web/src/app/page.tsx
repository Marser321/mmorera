import { HomeExperience } from "@/components/premium/HomeExperience";

// Estática a propósito: el Home no depende de la URL, así se sirve desde la CDN.
export default function HomePage() {
  return <HomeExperience />;
}
