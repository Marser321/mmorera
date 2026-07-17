import { HomeExperience } from "@/components/premium/HomeExperience";
import { isTrackMode, resolveTrackMode } from "@/data/trackModes";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ modo?: string }> }) {
  const { modo } = await searchParams;
  return <HomeExperience initialTrack={resolveTrackMode(modo)} initialModeSelected={isTrackMode(modo)} />;
}
