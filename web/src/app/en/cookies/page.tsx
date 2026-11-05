import type { Metadata } from "next";
import { LegalDocument } from "@/app/privacidad/_components/LegalDocument";

export const metadata: Metadata = {
  title: "Cookie policy",
  description: "What this site stores in your browser, and why.",
  alternates: {
    canonical: "/en/cookies",
    languages: { es: "/cookies", en: "/en/cookies" },
  },
};

export default function LegalPage() {
  return (
    <LegalDocument
      language="en"
      label={"Cookie policy"}
      title={"Cookies: only what's needed."}
      intro={"What this site stores in your browser, and why."}
      sections={[
        {
          id: "what-i-use-today",
          title: "What I use today",
          content: (
            <>
                <p>This site <strong>doesn&#x27;t use advertising or third-party tracking cookies.</strong> It only keeps three preferences in your browser&#x27;s local storage, so the site looks the way you left it:</p>
                <ul>
                  <li><strong>Theme</strong> (light or dark).</li>
                  <li><strong>Language</strong> you chose.</li>
                  <li><strong>Track</strong> you were viewing (design or software), updated when you visit those sections.</li>
                </ul>
                <p>None of it identifies you or is sent to third parties.</p>
            </>
          ),
        },
        {
          id: "demos-from-other-sites",
          title: "Demos from other sites",
          content: (
            <>
                <p>Some pages open, inside the site, a client demo or a tour or video hosted on another service, such as Kuula, SuperSplat or YouTube. Those sites belong to third parties and may use their own cookies under their own policies. They only load if you open them.</p>
            </>
          ),
        },
        {
          id: "if-that-changes",
          title: "If that changes",
          content: (
            <>
                <p>If I ever add analytics or any tool that uses non-essential cookies, I&#x27;ll ask for your permission before turning it on and list it here, with its provider and purpose.</p>
            </>
          ),
        },
        {
          id: "how-to-delete-them",
          title: "How to delete them",
          content: (
            <>
                <p>You can delete what the site stores from your browser settings, under &quot;Site data&quot; or &quot;Cookies&quot;.</p>
            </>
          ),
        },
      ]}
    />
  );
}
