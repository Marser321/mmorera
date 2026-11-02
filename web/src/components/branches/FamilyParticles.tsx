"use client";

import { useEffect } from "react";
import { useActiveTech } from "@/context/ActiveTechContext";
import type { Family } from "@/data/techStack";

/** Al entrar a una rama, el fondo de partículas dibuja las herramientas de estas familias. */
export function FamilyParticles({ families }: { families: Family[] }) {
  const { setActiveFamilies } = useActiveTech();
  const key = families.join(",");
  useEffect(() => {
    setActiveFamilies(key ? (key.split(",") as Family[]) : []);
    return () => setActiveFamilies([]);
  }, [key, setActiveFamilies]);
  return null;
}
