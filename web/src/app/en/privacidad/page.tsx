import type { Metadata } from "next";
import { LegalDocument } from "@/app/privacidad/_components/LegalDocument";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("privacidad", "en");

export default function LegalPage() {
  return (
    <LegalDocument
      language="en"
      label={"Privacy policy"}
      title={"Your data is used to reply to you. Nothing else."}
      intro={"What information I receive when you write to me, what I use it for and how you can ask me to delete it."}
      sections={[
        {
          id: "who-is-responsible",
          title: "Who is responsible",
          content: (
            <>
                <p>Mario Morera, an independent professional who runs this site (mmorera.agency). Contact for anything related to your data: <a href="mailto:mario@mmorera.agency">mario@mmorera.agency</a>.</p>
            </>
          ),
        },
        {
          id: "what-data-i-receive",
          title: "What data I receive",
          content: (
            <>
                <ul><li><strong>What you write in the project form:</strong> name, email, company or project (optional), project stage, team context, description and estimated start.</li><li><strong>What you send me by email or WhatsApp,</strong> when you choose those channels.</li><li><strong>Minimal technical data</strong> any website receives in order to work (IP address, browser type), processed by the hosting provider.</li></ul>
                <p>Don&#x27;t send passwords, credentials, payment details or sensitive information (such as health data) through these channels.</p>
            </>
          ),
        },
        {
          id: "what-i-use-it-for",
          title: "What I use it for",
          content: (
            <>
                <ul><li>To read your enquiry, assess whether I can help and reply.</li><li>To continue the conversation and, if we work together, prepare a proposal.</li></ul>
                <p>I don&#x27;t sell your data, I don&#x27;t use it for third-party advertising and I don&#x27;t add you to mailing lists without your permission.</p>
            </>
          ),
        },
        {
          id: "who-it-s-shared-with",
          title: "Who it's shared with",
          content: (
            <>
                <p>Only with the services that keep the site and the communication running:</p>
                <ul><li><strong>Site hosting:</strong> Vercel.</li><li><strong>Internal form notifications:</strong> email and Telegram, so I see your enquiry in time.</li><li><strong>Follow-up record (CRM),</strong> when configured, so nothing gets lost.</li></ul>
                <p>Each provider handles data under its own policies and only to deliver that service.</p>
            </>
          ),
        },
        {
          id: "how-long-i-keep-it",
          title: "How long I keep it",
          content: (
            <>
                <p>While the conversation is active and up to 24 months after the last contact, unless you ask me to delete it sooner or a legal obligation requires keeping it longer.</p>
            </>
          ),
        },
        {
          id: "your-rights",
          title: "Your rights",
          content: (
            <>
                <p>You can ask me to <strong>access</strong>, <strong>correct</strong> or <strong>delete</strong> your data, or <strong>object</strong> to its use, by writing to <a href="mailto:mario@mmorera.agency">mario@mmorera.agency</a>. I reply within the time limits set by Uruguay&#x27;s Personal Data Protection Law No. 18,331. If you believe your rights weren&#x27;t respected, you can file a complaint with the Personal Data Regulatory and Control Unit (URCDP).</p>
            </>
          ),
        },
        {
          id: "cookies",
          title: "Cookies",
          content: (
            <>
                <p>See the <a href="/en/cookies">cookie policy</a>.</p>
            </>
          ),
        },
        {
          id: "minors",
          title: "Minors",
          content: (
            <>
                <p>This site is meant for businesses and professionals. I don&#x27;t knowingly receive data from minors.</p>
            </>
          ),
        },
        {
          id: "changes",
          title: "Changes",
          content: (
            <>
                <p>If this policy changes, I update the date above. Important changes are announced on this page.</p>
            </>
          ),
        },
      ]}
    />
  );
}
