"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export function AnimatedCounter({
    value,
    prefix = "",
    suffix = "",
    className,
}: {
    value: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) =>
        Math.round(latest).toLocaleString("es-UY")
    );

    useEffect(() => {
        const controls = animate(count, value, {
            duration: 1.2,
            ease: "easeOut",
        });
        return controls.stop;
    }, [value, count]);

    return (
        <span className={className}>
            {prefix}
            <motion.span>{rounded}</motion.span>
            {suffix}
        </span>
    );
}
