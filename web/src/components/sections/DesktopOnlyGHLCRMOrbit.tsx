'use client';

import dynamic from 'next/dynamic';

import { useMediaQuery } from '@/hooks/useMediaQuery';

const GHLCRMOrbit = dynamic(
    () => import('@/components/animations/GHLCRMOrbit').then((mod) => mod.GHLCRMOrbit),
    { ssr: false },
);

export function DesktopOnlyGHLCRMOrbit() {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    if (!isDesktop) return null;

    return <GHLCRMOrbit />;
}
