'use client';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { MapContainer } from '@/components/map/MapContainer';
import { ChatWidget } from '@/components/chat/ChatWidget';

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Map */}
        <main className="flex-1 relative map-container">
          <MapContainer />
        </main>
      </div>

      {/* Chat Widget */}
      <ChatWidget />

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
