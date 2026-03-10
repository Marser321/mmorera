import { LucideIcon } from "lucide-react";

export interface SliderConfig {
    id: string;
    label: string;
    icon: LucideIcon;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    suffix: string;
    prefix?: string;
    color: string;
}
