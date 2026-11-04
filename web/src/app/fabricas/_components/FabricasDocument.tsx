import { ServicePage } from "@/components/service/ServicePage";
import { BriefToPiece } from "@/components/premium/fabricas/BriefToPiece";
import { VideoGallery, type VideoGalleryItem } from "@/components/premium/fabricas/VideoGallery";
import { SERVICE_PAGES } from "@/data/servicePages";
import { BRIEF_TO_PIECE } from "@/data/briefToPiece";
import { VIDEO_GALLERY, galleryMedia } from "@/data/videoGallery";

/** m:ss, como en un reproductor. */
const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, "0")}`;

export function FabricasDocument({ language }: { language: "es" | "en" }) {
  const content = SERVICE_PAGES.fabricas;
  const videos: VideoGalleryItem[] = VIDEO_GALLERY.map((item) => ({
    slug: item.slug,
    title: item.title,
    poster: { src: galleryMedia(item.poster, language), alt: item.title },
    src: galleryMedia(item.src, language),
    duration: clock(item.duration),
    tools: [item.tools[language]],
    note: item.label[language],
  }));
  return <ServicePage content={content} language={language} howItWorks={<>
    <BriefToPiece pieces={BRIEF_TO_PIECE} language={language} label={content.howItWorks?.title?.[language]} />
    <VideoGallery videos={videos} language={language} />
  </>} />;
}
