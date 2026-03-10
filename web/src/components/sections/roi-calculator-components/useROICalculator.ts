import { useState, useCallback, useMemo, useRef } from "react";

export function useROICalculator() {
    const [values, setValues] = useState({
        horasManuales: 20,
        salarioEmpleado: 2000,
        costoSoftware: 500,
        tasaError: 10,
    });

    const [isInteracting, setIsInteracting] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSliderChange = useCallback(
        (id: string, val: number) => {
            setValues((prev) => ({ ...prev, [id]: val }));
            setIsInteracting(true);

            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setIsInteracting(false), 2000);
        },
        []
    );

    const roiData = useMemo(() => {
        const { horasManuales, salarioEmpleado, costoSoftware, tasaError } = values;

        const costoHora = salarioEmpleado / 160;
        const costoManualMensual = horasManuales * 4.33 * costoHora;
        const costoErroresMensual = costoManualMensual * (tasaError / 100) * 1.5;

        const eficienciaIA = 0.70;
        const reduccionErrores = 0.90;

        const costoManualPost = costoManualMensual * (1 - eficienciaIA);
        const costoErrorPost = costoErroresMensual * (1 - reduccionErrores);

        const costoMmoreMensual = 800;

        const ahorroMensual =
            costoManualMensual -
            costoManualPost +
            (costoErroresMensual - costoErrorPost) +
            (costoSoftware * 0.4) -
            costoMmoreMensual;

        const ahorroAnual = Math.max(ahorroMensual * 12, 0);

        const horasRecuperadas = horasManuales * eficienciaIA;
        const porcentajeEficiencia = Math.round(
            (horasRecuperadas / horasManuales) * 100
        );

        const inversionInicial = 7500;
        const periodoRecuperacion =
            ahorroMensual > 0
                ? Math.max(Math.ceil(inversionInicial / ahorroMensual), 1)
                : 99;

        const barras = [
            {
                label: "Horas/mes",
                antes: horasManuales * 4.33,
                despues: horasManuales * 4.33 * (1 - eficienciaIA),
            },
            {
                label: "Costo RRHH",
                antes: costoManualMensual,
                despues: costoManualPost,
            },
            {
                label: "Errores",
                antes: costoErroresMensual,
                despues: costoErrorPost,
            },
            {
                label: "Software",
                antes: costoSoftware,
                despues: costoSoftware * 0.6,
            },
            {
                label: "Total/mes",
                antes: costoManualMensual + costoErroresMensual + costoSoftware,
                despues:
                    costoManualPost + costoErrorPost + costoSoftware * 0.6 + costoMmoreMensual,
            },
        ];

        const maxBarValue = Math.max(
            ...barras.map((b) => Math.max(b.antes, b.despues))
        );

        return {
            ahorroAnual: Math.round(ahorroAnual),
            porcentajeEficiencia,
            periodoRecuperacion: Math.min(periodoRecuperacion, 36),
            barras,
            maxBarValue,
        };
    }, [values]);

    return {
        values,
        isInteracting,
        handleSliderChange,
        roiData,
    };
}
