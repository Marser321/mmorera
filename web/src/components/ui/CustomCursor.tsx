"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    // Motion values para coordenadas
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Spring physics suaves para el anillo externo
    const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        // Detectar si el dispositivo tiene puntero fino (mouse)
        const isFinePointer = window.matchMedia("(pointer: fine)").matches;
        if (!isFinePointer) return;

        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Detectar elementos interactivos
            const isInteractive =
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.closest("button") ||
                target.closest("a") ||
                target.tagName === "INPUT" ||
                target.classList.contains("cursor-pointer");

            setIsHovering(!!isInteractive);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseleave", handleMouseLeave);
        document.addEventListener("mouseenter", handleMouseEnter);

        // Agregar clase al body para ocultar cursor default
        document.body.classList.add("custom-cursor-active");

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseenter", handleMouseEnter);
            document.body.classList.remove("custom-cursor-active");
        };
    }, [mouseX, mouseY, isVisible]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            <motion.div
                className="absolute rounded-full border border-white/60"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    width: isHovering ? 48 : 24,
                    height: isHovering ? 48 : 24,
                    opacity: isClicking ? 0.8 : 0.4,
                    borderColor: isHovering ? "#FFFFFF" : "rgba(255, 255, 255, 0.5)", 
                    scale: isClicking ? 0.8 : 1,
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
            />

            {/* Punto central (sin delay, pegado al mouse) */}
            <motion.div
                className="absolute rounded-full bg-white"
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    width: isHovering ? 8 : 4,
                    height: isHovering ? 8 : 4,
                    backgroundColor: isHovering ? "#FFFFFF" : "rgba(255, 255, 255, 0.8)",
                }}
                transition={{ duration: 0.1 }}
            />
        </div>
    );
}
