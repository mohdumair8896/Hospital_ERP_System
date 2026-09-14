'use client';

import React from 'react';
import TopEmergencyBar from '../../components/TopEmergencyBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmergencyFAB from '../../components/EmergencyFAB';
import { BlogHeaderFeaturedPost01 } from '../../components/marketing/blog/blog-header-featured-post-01';

export default function BlogCatalogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopEmergencyBar />
      <Navbar />

      {/* Featured Header & Interactive Medical Articles Suite */}
      <main className="flex-1">
        <BlogHeaderFeaturedPost01 />
      </main>

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
