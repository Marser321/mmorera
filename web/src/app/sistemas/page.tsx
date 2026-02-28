import { getMarkdownFile } from "@/lib/mdx";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";

export const metadata = {
    title: "Sistemas | MMorera SME",
    description: "Catálogo de sistemas operativos impulsados por IA.",
};

export default async function SistemasPage() {
    // Aquí leeríamos el catálogo de sistemas desde contenido MDX si es necesario
    // o lo renderizaríamos directamente desde la BD InsForge.

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Nuestros Sistemas</h1>
                    <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
                        No vendemos &quot;servicios&quot;, implementamos sistemas operativos enfocados en ROI operativo, infraestructura de conversión y escalabilidad.
                    </p>

                    {/* Aquí iteraríamos sobre los sistemas. Placeholder por ahora */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Placeholder Card */}
                        <div className="border border-border bg-card p-6 rounded-xl shadow-lg">
                            <h3 className="text-2xl font-bold mb-3">Autopiloto Express</h3>
                            <p className="text-muted-foreground mb-4">Bot WhatsApp IA 24/7 para FAQs y agendas.</p>
                        </div>
                        <div className="border border-border bg-card p-6 rounded-xl shadow-lg">
                            <h3 className="text-2xl font-bold mb-3">Infraestructura de Crecimiento</h3>
                            <p className="text-muted-foreground mb-4">Landing pages de alta conversión + tracking.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
