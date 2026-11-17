import type { ReactNode, Ref } from "react";
import { HeroFilm } from "@/components/premium/home/HeroFilm";

/**
 * El hero con el film «El equipo». Es una escena oscura en los dos temas,
 * como las escenas de cine de las páginas de servicio: `escena-pared`
 * devuelve los colores de la pared, así el texto que usa los tokens del sitio
 * se lee igual en el tema claro.
 *
 * - Pantalla ancha: el film va abajo a la derecha y ocupa casi todo el ancho.
 *   Hacia la izquierda y hacia arriba se pierde en la pared, y ahí va el texto:
 *   los robots nunca quedan debajo de una letra.
 * - Pantalla media: el texto primero y el film debajo, a todo el ancho.
 * - Teléfono: el film abre la pantalla, cuadrado y con el corte de dos robots
 *   por plano; el título y el botón van enseguida debajo, sobre fondo liso.
 */
export function HeroEquipo({ language, children, sectionRef }: { language: "es" | "en"; children: ReactNode; sectionRef?: Ref<HTMLElement> }) {
  return (
    <section id="hero" ref={sectionRef} data-home-section="hero" data-hero="equipo" className="escena-cine escena-pared relative isolate flex flex-col overflow-hidden bg-[#0B0B0A] text-[#ECE7DD] lg:block lg:min-h-[92svh]">
      <div className="pointer-events-none relative z-10 order-2 px-5 pb-10 pt-7 sm:order-1 sm:px-8 sm:pt-36 lg:px-12 lg:pb-24">
        <div className="mx-auto w-full max-w-[1480px]">
          <div className="pointer-events-auto max-w-3xl lg:max-w-[40%]">{children}</div>
        </div>
      </div>
      {/* Desde lg el film se funde con la pared: una máscara hacia la izquierda y otra hacia arriba. */}
      <div className="order-1 sm:order-2 lg:absolute lg:bottom-0 lg:right-0 lg:-z-20 lg:w-[82%] lg:[mask-image:linear-gradient(to_right,transparent_0%,black_26%)]">
        <HeroFilm language={language} className="aspect-square w-full sm:aspect-video lg:[mask-image:linear-gradient(to_bottom,transparent_0%,black_20%)]" />
      </div>
    </section>
  );
}
