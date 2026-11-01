import type { Metadata } from "next";
import { LegalDocument } from "@/app/privacidad/_components/LegalDocument";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The rules for using mmorera.agency and what its case studies show.",
  alternates: {
    canonical: "/en/terminos",
    languages: { es: "/terminos", en: "/en/terminos" },
  },
};

export default function LegalPage() {
  return (
    <LegalDocument
      language="en"
      label={"Terms of use"}
      title={"What you can expect from this site."}
      intro={"The rules for using mmorera.agency and what its case studies show."}
      sections={[
        {
          id: "the-site",
          title: "The site",
          content: (
            <>
                <p>mmorera.agency presents the work and services of Mario Morera. Using it means accepting these terms. If you don&#x27;t agree, please don&#x27;t use it.</p>
            </>
          ),
        },
        {
          id: "what-the-case-studies-show",
          title: "What the case studies show",
          content: (
            <>
                <ul><li>Case studies describe real work or demonstrations. <strong>When something is a demo, a concept or a recreated example, it&#x27;s labeled as such.</strong></li><li>Client brands, logos and screenshots belong to their owners and are shown as a reference of the work done.</li><li>A case study <strong>is not a promise of results.</strong> Every project depends on its context, its scope and who uses it.</li></ul>
            </>
          ),
        },
        {
          id: "intellectual-property",
          title: "Intellectual property",
          content: (
            <>
                <p>The design, code, copy, films and animations on this site belong to Mario Morera, except third-party brands and materials. You may share links and quote excerpts with credit and a link to the source. You may not copy the site, its films or its components to use as your own.</p>
            </>
          ),
        },
        {
          id: "services-and-proposals",
          title: "Services and proposals",
          content: (
            <>
                <p>The information on the site is for guidance only. Nothing on this website is a binding offer: the scope, timeline and price of each project are agreed in writing in a separate proposal or contract, which takes precedence over the site.</p>
            </>
          ),
        },
        {
          id: "links-to-other-sites",
          title: "Links to other sites",
          content: (
            <>
                <p>The site links to client projects and third-party services. I don&#x27;t control their content or policies and I&#x27;m not responsible for them.</p>
            </>
          ),
        },
        {
          id: "availability-and-liability",
          title: "Availability and liability",
          content: (
            <>
                <p>I take care that the site works and that its information is accurate, but it may contain errors, become outdated or be temporarily unavailable. To the extent permitted by law, I&#x27;m not liable for damages arising from using the site or relying on its content without a signed proposal.</p>
            </>
          ),
        },
        {
          id: "acceptable-use",
          title: "Acceptable use",
          content: (
            <>
                <p>Don&#x27;t use the site or its forms to send spam, illegal content or malicious code, or to try to access systems you&#x27;re not authorized to access.</p>
            </>
          ),
        },
        {
          id: "governing-law",
          title: "Governing law",
          content: (
            <>
                <p>These terms are governed by the laws of the Oriental Republic of Uruguay, and any dispute is submitted to its competent courts. If there&#x27;s a disagreement, let&#x27;s first try to resolve it by talking: <a href="mailto:mario@mmorera.agency">mario@mmorera.agency</a>.</p>
            </>
          ),
        },
        {
          id: "changes",
          title: "Changes",
          content: (
            <>
                <p>I may update these terms; the date above shows the current version.</p>
            </>
          ),
        },
      ]}
    />
  );
}
