import { ServicePage } from "@/components/service/ServicePage";
import { BriefToPiece } from "@/components/premium/fabricas/BriefToPiece";
import { VideoGallery } from "@/components/premium/fabricas/VideoGallery";
import { SERVICE_PAGES } from "@/data/servicePages";
import { BRIEF_TO_PIECE_FIXTURES, VIDEO_GALLERY_FIXTURES } from "../_fixtures/slotFixtures";

export function FabricasDocument({ language }: { language: "es" | "en" }) {
  const content = SERVICE_PAGES.fabricas;
  return <ServicePage content={content} language={language} howItWorks={<>
    <BriefToPiece pieces={BRIEF_TO_PIECE_FIXTURES} language={language} label={content.howItWorks?.title?.[language]} demo />
    <VideoGallery videos={VIDEO_GALLERY_FIXTURES} language={language} demo />
  </>} />;
}
