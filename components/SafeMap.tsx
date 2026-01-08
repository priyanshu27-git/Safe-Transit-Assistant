import React from 'react';
import { TransitRoute } from '../types';
import { MapPin, User, Shield, AlertTriangle, ShieldCheck, Sun, Moon, CloudMoon, Users } from 'lucide-react';

interface SafeMapProps {
  routes: TransitRoute[];
  selectedRouteId: string | null;
  progress: number;
}

export const SafeMap: React.FC<SafeMapProps> = ({ routes, selectedRouteId, progress }) => {
  const safestRouteId = [...routes].sort((a, b) => (b.safetyScore || 0) - (a.safetyScore || 0))[0]?.id;

  const getPointOnPath = (routeId: string, p: number) => {
    if (routeId === 'route-1') {
      if (p <= 0.5) return { x: 100 + (300 * (p / 0.5)), y: 300 };
      return { x: 400 + (300 * ((p - 0.5) / 0.5)), y: 300 };
    }
    if (routeId === 'route-2') {
      const d = p * 1000;
      if (d <= 200) return { x: 100, y: 300 - d };
      if (d <= 500) return { x: 100 + (d - 200), y: 100 };
      if (d <= 800) return { x: 400 + (d - 500), y: 100 };
      return { x: 700, y: 100 + (d - 800) };
    }
    if (routeId === 'route-3') {
      const d = p * 1000;
      if (d <= 200) return { x: 100, y: 300 + d };
      if (d <= 500) return { x: 100 + (d - 200), y: 500 };
      if (d <= 800) return { x: 400 + (d - 500), y: 500 };
      return { x: 700, y: 500 - (d - 800) };
    }
    return { x: 100, y: 300 };
  };

  const getCrimeColor = (level: string) => {
    switch (level) {
      case 'high': return '#ef4444'; // Red-500
      case 'moderate': return '#f59e0b'; // Amber-500
      case 'low': return '#10b981'; // Emerald-500
      default: return '#94a3b8';
    }
  };

  const getLightingInfo = (level: string) => {
    switch (level) {
      case 'high': return { Icon: Sun, color: '#f59e0b', label: 'Well Lit' };
      case 'medium': return { Icon: CloudMoon, color: '#6366f1', label: 'Partial Light' };
      case 'low': return { Icon: Moon, color: '#1e293b', label: 'Poorly Lit' };
      default: return { Icon: Sun, color: '#94a3b8', label: 'Unknown' };
    }
  };

  const getCrowdInfo = (level: string) => {
    switch (level) {
      case 'busy': return { color: '#2563eb', label: 'Crowded (Safe)', opacity: 1, pulse: true };
      case 'moderate': return { color: '#60a5fa', label: 'Moderate', opacity: 0.7, pulse: false };
      case 'empty': return { color: '#94a3b8', label: 'Isolated (Risk)', opacity: 0.4, pulse: false };
      default: return { color: '#cbd5e1', label: 'Unknown', opacity: 0.5, pulse: false };
    }
  };

  const userPos = selectedRouteId ? getPointOnPath(selectedRouteId, progress) : { x: 100, y: 300 };

  const getRouteSegmentsPathData = (routeId: string) => {
    if (routeId === 'route-1') {
      return [
        { d: "M100 300 L400 300", crime: 'moderate', lighting: 'low', crowd: 'empty', midP: 0.25 },
        { d: "M400 300 L700 300", crime: 'low', lighting: 'high', crowd: 'busy', midP: 0.75 }
      ];
    }
    if (routeId === 'route-2') {
      return [
        { d: "M100 300 L100 100 L400 100", crime: 'low', lighting: 'high', crowd: 'busy', midP: 0.25 },
        { d: "M400 100 L700 100 L700 300", crime: 'low', lighting: 'high', crowd: 'moderate', midP: 0.75 }
      ];
    }
    if (routeId === 'route-3') {
      return [
        { d: "M100 300 L100 500 L400 500", crime: 'low', lighting: 'medium', crowd: 'moderate', midP: 0.25 },
        { d: "M400 500 L700 500 L700 300", crime: 'low', lighting: 'medium', crowd: 'empty', midP: 0.75 }
      ];
    }
    return [];
  };

  return (
    <div className="w-full h-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      {/* Legend Container */}
      <div className="absolute top-20 left-4 flex flex-col gap-3 z-10 hidden md:flex w-52">
        {/* Crime Density Legend */}
        <div className="glass p-3 rounded-xl border border-white/60 shadow-lg">
          <h4 className="text-[9px] font-black text-slate-800 uppercase mb-2 tracking-widest border-b border-slate-200 pb-1">Crime Density</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 rounded-full bg-red-500"></div>
              <span className="text-[10px] text-slate-700 font-bold uppercase">High Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] text-slate-700 font-bold uppercase">Safe Corridor</span>
            </div>
          </div>
        </div>

        {/* Lighting Legend */}
        <div className="glass p-3 rounded-xl border border-white/60 shadow-lg">
          <h4 className="text-[9px] font-black text-slate-800 uppercase mb-2 tracking-widest border-b border-slate-200 pb-1">Street Lighting</h4>
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1">
              <Sun size={12} className="text-amber-500" />
              <span className="text-[8px] font-bold text-slate-500">WELL-LIT</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Moon size={12} className="text-slate-800" />
              <span className="text-[8px] font-bold text-slate-500">DARK</span>
            </div>
          </div>
        </div>

        {/* Crowd Density Legend */}
        <div className="glass p-3 rounded-xl border border-white/60 shadow-lg">
          <h4 className="text-[9px] font-black text-slate-800 uppercase mb-2 tracking-widest border-b border-slate-200 pb-1">Crowd Density</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users size={12} className="text-blue-600" />
              <span className="text-[10px] text-slate-700 font-bold uppercase">Busy (Safer)</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={12} className="text-slate-400 opacity-50" />
              <span className="text-[10px] text-slate-700 font-bold uppercase">Empty (Riskier)</span>
            </div>
          </div>
        </div>
      </div>

      <svg className="w-full h-full min-w-[800px] min-h-[600px] drop-shadow-sm" viewBox="0 0 800 600">
        <defs>
          <radialGradient id="riskGradient">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Base Streets */}
        <path d="M50 300 H750" stroke="#e2e8f0" strokeWidth="24" fill="none" strokeLinecap="round" />
        <path d="M400 50 V550" stroke="#e2e8f0" strokeWidth="24" fill="none" strokeLinecap="round" />
        <path d="M50 100 Q400 100 750 100" stroke="#e2e8f0" strokeWidth="24" fill="none" strokeLinecap="round" />
        <path d="M50 500 Q400 500 750 500" stroke="#e2e8f0" strokeWidth="24" fill="none" strokeLinecap="round" />

        {/* Routes */}
        {routes.map((route) => {
          const isSelected = route.id === selectedRouteId;
          const isSafest = route.id === safestRouteId;
          const opacity = selectedRouteId ? (isSelected ? 1 : 0.08) : 0.6;
          const segments = getRouteSegmentsPathData(route.id);

          return (
            <g key={route.id} opacity={opacity} className="transition-opacity duration-500">
              {/* Safety Glow for Safest Route */}
              {isSafest && (
                <path 
                  d={segments.map(s => s.d).join(" ")} 
                  stroke="#10b981" 
                  strokeWidth={isSelected ? 26 : 22} 
                  fill="none" 
                  strokeLinecap="round" 
                  opacity={0.15}
                  className="transition-all duration-700"
                />
              )}

              {/* Individual Route Segments */}
              {segments.map((seg, idx) => {
                const lightingInfo = getLightingInfo(seg.lighting);
                const LightingIconComp = lightingInfo.Icon;
                const crowdInfo = getCrowdInfo(seg.crowd);
                const midPoint = getPointOnPath(route.id, seg.midP);
                
                return (
                  <g key={`${route.id}-seg-group-${idx}`}>
                    <path 
                      d={seg.d} 
                      stroke={getCrimeColor(seg.crime)} 
                      strokeWidth={isSelected ? 10 : 5} 
                      fill="none" 
                      strokeLinecap="round" 
                      strokeDasharray={isSelected ? "none" : "10,5"}
                      className="transition-all duration-500"
                    />
                    
                    {/* Multi-Indicator Group */}
                    <g transform={`translate(${midPoint.x}, ${midPoint.y})`}>
                      {/* Lighting Indicator (Above segment) */}
                      <g transform="translate(-14, -16)">
                        <circle r="9" fill="white" stroke={lightingInfo.color} strokeWidth="1" className="shadow-sm" />
                        <LightingIconComp x="-5" y="-5" size={10} style={{ color: lightingInfo.color }} />
                      </g>

                      {/* Crowd Indicator (Below segment) */}
                      <g transform="translate(14, 16)">
                        <circle 
                          r="9" 
                          fill="white" 
                          stroke={crowdInfo.color} 
                          strokeWidth="1" 
                          opacity={crowdInfo.opacity}
                          className={crowdInfo.pulse ? "animate-pulse" : ""}
                        />
                        <Users 
                          x="-5" y="-5" 
                          size={10} 
                          style={{ color: crowdInfo.color, opacity: crowdInfo.opacity }} 
                        />
                      </g>
                    </g>
                  </g>
                );
              })}
              
              {/* Selected Route Tracking Animation Overlay */}
              {isSelected && (
                <path 
                  d={segments.map(s => s.d).join(" ")} 
                  stroke="white" 
                  strokeWidth="2" 
                  fill="none" 
                  strokeDasharray="4,4" 
                  className="animate-[dash_2s_linear_infinite]"
                />
              )}
            </g>
          );
        })}

        {/* Global Danger Zones Heatmap */}
        <g transform="translate(380, 280)" opacity="0.6">
          <circle r="45" fill="url(#riskGradient)" className="animate-pulse" />
          <AlertTriangle x="-12" y="-12" size={24} className="text-red-600 drop-shadow-sm" />
        </g>

        {/* User Position Marker */}
        {selectedRouteId && (
          <g transform={`translate(${userPos.x}, ${userPos.y})`} className="transition-all duration-200 ease-linear">
            <circle r="16" fill="#4f46e5" className="animate-ping opacity-20" />
            <circle r="11" fill="white" stroke="#4f46e5" strokeWidth="3" />
            <Shield x="-5.5" y="-5.5" size={11} className="text-indigo-600 fill-indigo-100" />
          </g>
        )}

        {/* Landmark Nodes */}
        <g transform="translate(100, 300)">
          <circle r="14" fill="white" stroke="#4f46e5" strokeWidth="3" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
          <User x="-7" y="-7" size={14} className="text-indigo-600" />
        </g>
        
        <g transform="translate(700, 300)">
          <circle r="14" fill="#ef4444" stroke="white" strokeWidth="3" style={{ filter: 'drop-shadow(0 4px 6px rgba(239,68,68,0.3))' }} />
          <MapPin x="-7" y="-7" size={14} className="text-white" />
        </g>
      </svg>

      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -40; }
        }
      `}</style>
    </div>
  );
};