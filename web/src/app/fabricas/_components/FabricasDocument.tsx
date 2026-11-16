import { localePath } from "@/config/site";
import { ServicePage } from "@/components/service/ServicePage";
import { SideDoor } from "@/components/branches/SideDoor";
import { BriefToPiece } from "@/components/premium/fabricas/BriefToPiece";
import { StyleShowcase } from "@/components/premium/fabricas/StyleShowcase";
import { VideoGallery, type VideoGalleryItem } from "@/components/premium/fabricas/VideoGallery";
import { ServiceFilms, type ServiceFilmItem } from "@/components/premium/fabricas/ServiceFilms";
import { SERVICE_PAGES } from "@/data/servicePages";
import { getServiceHeroFilm } from "@/data/serviceHeroFilms";
import { getDoorFilm, getFilmOfDoor } from "@/data/doorFilms";
import { SERVICE_SOLUTIONS } from "@/data/solutionsData";
import { BRIEF_TO_PIECE } from "@/data/briefToPiece";
import { VIDEO_GALLERY, galleryMedia } from "@/data/videoGallery";
import { RECORRIDOS_PAGE, RECORRIDOS_PATH } from "@/data/recorridos";

/** m:ss, como en un reproductor. */
const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, "0")}`;

export function FabricasDocument({ language }: { language: "es" | "en" }) {
  const content = SERVICE_PAGES.fabricas;
  const videos: VideoGalleryItem[] = VIDEO_GALLERY.map((item) => ({
    slug: item.slug,
    title: item.title,
    poster: { src: galleryMedia(item.poster, language), alt: item.title },
    src: galleryMedia(item.src, language),
    landscape: item.landscape ? { src: galleryMedia(item.landscape.src, language), poster: galleryMedia(item.landscape.poster, language) } : undefined,
    duration: clock(item.duration),
    tools: [item.tools[language]],
    note: item.label[language],
  }));
  // Un film por servicio: los de las cuatro puertas del home y el de campañas.
  const serviceFilms: ServiceFilmItem[] = [
    ...SERVICE_SOLUTIONS.flatMap((service) => {
      const film = getDoorFilm(service.id, language);
      return film ? [{ id: service.id, title: service.shortTitle[language], href: localePath(language, service.path), film }] : [];
    }),
    { id: "campanas", title: SERVICE_PAGES.campanas.hero.eyebrow?.[language] ?? "", href: localePath(language, "/campanas"), film: getFilmOfDoor("campanas", language) },
  ];
  return <ServicePage content={content} language={language} heroFilm={getServiceHeroFilm("fabricas", language)} howItWorks={<>
    <BriefToPiece pieces={BRIEF_TO_PIECE} language={language} label={content.howItWorks?.title?.[language]} />
    <VideoGallery videos={videos} language={language} />
    <ServiceFilms films={serviceFilms} language={language} />
    <StyleShowcase language={language} />
    <SideDoor eyebrow={RECORRIDOS_PAGE.door.eyebrow[language]} title={RECORRIDOS_PAGE.door.title[language]} href={localePath(language, RECORRIDOS_PATH)} className="mt-8" />
  </>} />;
}
