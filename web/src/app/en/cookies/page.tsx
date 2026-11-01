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
                <p>This site <strong>doesn&#x27;t use advertising or third-party tracking cookies.</strong> It only stores preferences you choose, such as light or dark theme or language, so they&#x27;re remembered on your next visit. That works without identifying you.</p>
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
