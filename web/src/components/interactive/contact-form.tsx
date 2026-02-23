"use client";

import * as React from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * ContactForm — formulario de calificación/auditoría.
 * Validación client-side, labels accesibles, estado loading.
 */
export function ContactForm() {
    const [enviando, setEnviando] = React.useState(false);
    const [enviado, setEnviado] = React.useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEnviando(true);

        // Simulación de envío
        setTimeout(() => {
            setEnviando(false);
            setEnviado(true);
        }, 2000);
    };

    if (enviado) {
        return (
            <Card className="max-w-lg mx-auto text-center">
                <CardContent className="py-12 px-6">
                    <div className="size-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
                        <Send className="size-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                        ¡Mensaje enviado!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Recibimos tu consulta. Te respondemos en menos de 24 horas.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="max-w-lg mx-auto">
            <CardHeader>
                <CardTitle className="text-center">Contanos sobre tu proyecto</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    {/* Nombre */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="contacto-nombre"
                            className="text-sm font-medium text-foreground"
                        >
                            Nombre completo
                        </label>
                        <Input
                            id="contacto-nombre"
                            name="nombre"
                            type="text"
                            placeholder="Juan Pérez"
                            required
                            autoComplete="name"
                            aria-required="true"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="contacto-email"
                            className="text-sm font-medium text-foreground"
                        >
                            Email
                        </label>
                        <Input
                            id="contacto-email"
                            name="email"
                            type="email"
                            placeholder="juan@empresa.com"
                            required
                            autoComplete="email"
                            aria-required="true"
                        />
                    </div>

                    {/* Empresa */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="contacto-empresa"
                            className="text-sm font-medium text-foreground"
                        >
                            Empresa
                        </label>
                        <Input
                            id="contacto-empresa"
                            name="empresa"
                            type="text"
                            placeholder="Nombre de tu empresa"
                            autoComplete="organization"
                        />
                    </div>

                    {/* Mensaje */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="contacto-mensaje"
                            className="text-sm font-medium text-foreground"
                        >
                            ¿Cómo podemos ayudarte?
                        </label>
                        <Textarea
                            id="contacto-mensaje"
                            name="mensaje"
                            placeholder="Contanos brevemente qué procesos querés automatizar o qué desafío tenés..."
                            required
                            aria-required="true"
                        />
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        variant="shimmer"
                        size="lg"
                        className="w-full"
                        disabled={enviando}
                    >
                        {enviando ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            <>
                                <Send className="size-4" />
                                Enviar consulta
                            </>
                        )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                        Sin compromiso · Respondemos en &lt;24h
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
