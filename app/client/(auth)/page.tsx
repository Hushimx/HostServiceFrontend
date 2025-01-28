"use client"

import HeroSection from "./components/HeroSection";
import OffersSection from "./components/OffersSection";
import ServicesSection from "./components/ServicesSection";
import EventsTeaser from "./components/EventsTeaser";

export default function HomePage() {
  return (
    <main className=" pt-5" >
      <ServicesSection />
      <EventsTeaser />

    </main>
  );
}
