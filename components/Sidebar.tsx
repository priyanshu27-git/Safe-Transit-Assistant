
import React from 'react';
import { AppState, TransitRoute } from '../types';
import { Search, MapPin, Loader2, ShieldCheck, Zap, Shield, AlertCircle } from 'lucide-react';

interface SidebarProps {
  state: AppState;
  onSearchChange: (val: string) => void;
  onSearch: () => void;
  onSelectRoute: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ state, onSearchChange, onSearch, onSelectRoute }) => {
  // Find the safest and fastest routes
  const sortedBySafety = [...state.routes].sort((a, b) => (b.safetyScore || 0) - (a.safetyScore || 0));
  const safestId = sortedBySafety[0]?.id;
  const fastestId = [...state.routes].sort((a, b) => a.estimatedTime - b.estimatedTime)[0]?.id;

  return (
    <div className="w-full md:w-96 bg-white border-r border-slate-200 h-full overflow-y-auto p-6 flex flex-col shadow-xl z-30">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight tracking-tight">Safe Transit</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Security-Aware Navigation</p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="relative group">
          <div className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <MapPin className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            value={state.origin}
            disabled
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-400 cursor-not-allowed font-medium"
          />
        </div>

        <div className="relative group">
          <div className="absolute left-3 top-3 text-indigo-500 group-focus-within:scale-110 transition-transform">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder="Search destination..."
            value={state.destination}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm font-medium"
          />
        </div>

        <button 
          onClick={onSearch}
          disabled={state.isAnalyzing || !state.destination}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          {state.isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Calculating Safest Paths...
            </>
          ) : (
            'Analyze Safety Routes'
          )}
        </button>
      </div>

      {state.routes.length > 0 && (
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recommended Routes</h3>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">AI Optimized</span>
          </div>

          {state.routes.map((route) => {
            const isSafest = route.id === safestId;
            const isFastest = route.id === fastestId;
            const isSelected = state.selectedRouteId === route.id;

            return (
              <div 
                key={route.id}
                onClick={() => onSelectRoute(route.id)}
                className={`p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-md translate-x-1' 
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col gap-1">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      {route.name}
                      {isSafest && <Shield className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />}
                    </h4>
                    <div className="flex gap-1">
                      {isSafest && <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded uppercase">Best Safety</span>}
                      {isFastest && <span className="text-[9px] font-black bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase">Shortest Path</span>}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-[11px] font-black ${
                    (route.safetyScore || 0) > 80 ? 'bg-emerald-500 text-white' : 
                    (route.safetyScore || 0) > 60 ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {route.safetyScore}%
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-[11px] text-slate-500 font-bold">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {route.estimatedTime} mins
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {(route.totalDistance / 1000).toFixed(1)} km
                  </span>
                </div>

                {isSelected && (
                  <div className="mt-3 text-[11px] text-indigo-800 bg-white p-3 rounded-xl leading-relaxed border border-indigo-100 shadow-inner">
                    <div className="flex items-center gap-1.5 mb-1.5 font-black uppercase tracking-wider text-indigo-500">
                      <AlertCircle className="w-3 h-3" />
                      Safety Intel
                    </div>
                    {route.riskAnalysis}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      <div className="mt-auto pt-6 border-t border-slate-100 space-y-4">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Live Safety Policy</p>
          <p className="text-[10px] text-slate-500 leading-tight font-medium">
            Routes are recalculated every 60s based on local police reports and street lighting telemetry.
          </p>
        </div>
      </div>
    </div>
  );
};
