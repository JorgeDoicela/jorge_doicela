'use client';

import React from 'react';
import ParallaxBackground from './ParallaxBackground';
import InteractiveParticles from './InteractiveParticles';
import CinematicSpiralGalaxy from './CinematicSpiralGalaxy';

export function LandingVisualEffects() {
    return (
        <>
            <ParallaxBackground />
            <InteractiveParticles />
            <CinematicSpiralGalaxy />
        </>
    );
}

export default LandingVisualEffects;
