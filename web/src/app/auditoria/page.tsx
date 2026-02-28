import Script from "next/script";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";

export const metadata = {
    title: "Auditoría de IA | MMorera SME",
    description: "Agenda tu auditoría de IA y obtén un blueprint de sistema recomendado.",
};

export default function AuditoriaPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-24 pb-16 bg-background">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary">Auditoría de IA Estratégica</h1>
                    <p className="text-lg text-muted-foreground mb-12">
                        Un &quot;Sprint de diagnóstico&quot; donde analizamos tus cuellos de botella y diseñamos tu sistema operativo de IA a medida.
                    </p>

                    <div className="border border-border bg-card shadow-2xl rounded-xl p-4 md:p-8 max-w-3xl mx-auto">
                        <h2 className="text-2xl font-semibold mb-6">Elige tu horario</h2>
                        {/* Contenedor principal de Cal.com */}
                        <div style={{ width: "100%", height: "100%", overflow: "scroll" }} id="my-cal-inline"></div>
                    </div>
                </div>
            </main>
            <Footer />

            <Script
                id="cal-com-init"
                type="text/javascript"
                dangerouslySetInnerHTML={{
                    __html: `
                        (function (C, A, L) { 
                            let p = function (a, ar) { a.q.push(ar); }; 
                            let d = C.document; C.Cal = C.Cal || function () { 
                                let cal = C.Cal; let ar = arguments; 
                                if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } 
                                if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} 
                                p(cal, ar); 
                            }; 
                        })(window, "https://app.cal.com/embed/embed.js", "init");
                        Cal("init", {origin:"https://cal.com"});
                        
                        // NOTA: Cambiar "team/nexo/auditoria" por el link real de Cal.com del usuario
                        Cal("inline", {
                            elementOrSelector:"#my-cal-inline",
                            calLink: "team/nexo/auditoria",
                            layout: "month_view"
                        });
                        Cal("ui", {"styles":{"branding":{"brandColor":"#ffffff"}},"hideEventTypeDetails":false,"layout":"month_view"});
                    `
                }}
            />
        </>
    );
}
