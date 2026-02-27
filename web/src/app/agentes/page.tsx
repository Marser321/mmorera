import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { WorkflowDiagram } from "@/components/interactive/workflow-diagram";

export const metadata = {
    title: "Agentes y Demos | NEXO AI",
    description: "Demos interactivas y flujos de trabajo de nuestros agentes IA.",
};

export default function AgentesPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Agentes y Blueprints</h1>
                    <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
                        Explorá interactivamente cómo funcionan nuestros sistemas. Demos guiadas, trazas de ejecución y simuladores.
                    </p>

                    <div className="w-full">
                        <WorkflowDiagram />
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
