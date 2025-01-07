import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { FeatureSection } from '../components/home/FeatureSection';
import { StatsSection } from '../components/home/StatsSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <FeatureSection />
    </div>
  );
}