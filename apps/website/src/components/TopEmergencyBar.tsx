import React from 'react';
import { Phone, Mail, Clock, MapPin, Ambulance, ShieldCheck, ArrowRight } from 'lucide-react';

export default function TopEmergencyBar() {
  return (
    <div className="bg-[#1F5084] text-sky-100 text-xs border-b border-[#164273]">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
        <div className="flex flex-col md:flex-row justify-between items-center py-2 gap-2">
          {/* Contact Details */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-sky-300" />
              <span className="text-sky-200">Hotline:</span>
              <a href="tel:1234567890" className="font-semibold text-white">123-456-7890</a>
            </span>
            <span className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 text-sky-300" />
              <a href="mailto:care@prohealth.hospital">care@prohealth.hospital</a>
            </span>
            <span className="hidden lg:flex items-center gap-1.5 text-sky-200/80">
              <Clock className="w-3.5 h-3.5 text-sky-300/70" />
              <span>Mon-Sun 24/7 Emergency Available</span>
            </span>
            <span className="hidden xl:flex items-center gap-1.5 text-sky-200/80">
              <MapPin className="w-3.5 h-3.5 text-sky-300/70" />
              <span>123 Medical Boulevard, New York, NY 10016</span>
            </span>
          </div>

          {/* Emergency Ambulance & Staff Portal */}
          <div className="flex items-center gap-3">
            <a
              href="tel:876256876"
              className="flex items-center gap-1.5 bg-red-600/90 hover:bg-red-600 text-white font-semibold px-2.5 py-1 rounded-full text-[11px] transition-all shadow-sm animate-pulse"
            >
              <Ambulance className="w-3.5 h-3.5" />
              <span>Ambulance: 876-256-876</span>
            </a>
            
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sky-100 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded text-[11px] font-medium transition-colors border border-white/20"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>ERP &amp; Doctor Portal</span>
              <ArrowRight className="w-3 h-3 text-sky-300" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
