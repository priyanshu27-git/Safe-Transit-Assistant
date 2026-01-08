
import React from 'react';
import { TransitRoute, RouteSegment } from '../types';
import { Sun, Users, ShieldAlert, Clock, Pause, Play, CheckCircle2, AlertTriangle, Moon, Shield } from 'lucide-react';

interface RouteDetailsProps {
  route: TransitRoute;
  isTracking: boolean;
  progress: number;
  onStart: () => void;
}

export const RouteDetails: React.FC<RouteDetailsProps> = ({ route, isTracking, progress, onStart }) => {
  const isFinished = progress >= 1;

  // Identify key risk factors for summary
  const worstLightingSegment = [...route.segments].sort((a, b) => {
    const weights = { low: 0, medium: 1, high: 2 };
    return weights[a.lightingLevel] - weights[b.lightingLevel];
  })[0];

  const highestCrimeSegment = [...route.segments].sort((a, b) => {
    const weights = { low: 0, moderate: 1, high: 2 };
    return weights[b.crimeHistory] - weights[a.crimeHistory];
  })[0];

  const getSafetyColor = (score: number = 0) => {
    if (score > 80) return 'text-emerald-500 bg-emerald-50 border-emerald-100';
    if (score > 60) return 'text-amber-500 bg-amber-50 border-amber-100';
    return 'text-red-500 bg-red-50 border-red-100';
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header with Safety Score */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <h3 className="font-black text-slate-900 text-xl tracking-tight">{route.name}</h3>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isFinished ? 'Arrived' : `${Math.round(route.estimatedTime * (1 - progress))} mins remaining`}
            </span>
          </div>
        </div>
        <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl border-2 transition-colors ${getSafetyColor(route.safetyScore)}`}>
          <span className="text-lg font-black leading-none">{route.safetyScore}%</span>
          <span className="text-[8px] font-black uppercase tracking-tighter">Safe</span>
        </div>
      </div>

      {!isFinished ? (
        <>
          {/* Safety Insights Summary */}
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Shield className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Safety Verdict</p>
                <p className="text-[11px] text-slate-600 font-medium leading-tight line-clamp-2">
                  {route.riskAnalysis || "Optimized for well-lit streets and high visibility."}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <div className={`flex-1 flex items-center gap-2 p-2 rounded-xl border ${worstLightingSegment.lightingLevel === 'low' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                <Moon className={`w-3.5 h-3.5 ${worstLightingSegment.lightingLevel === 'low' ? 'text-red-500' : 'text-slate-400'}`} />
                <div className="overflow-hidden">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter truncate">Darkest Area</p>
                  <p className="text-[10px] font-bold text-slate-700 truncate">{worstLightingSegment.name}</p>
                </div>
              </div>
              <div className={`flex-1 flex items-center gap-2 p-2 rounded-xl border ${highestCrimeSegment.crimeHistory === 'high' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                <AlertTriangle className={`w-3.5 h-3.5 ${highestCrimeSegment.crimeHistory === 'high' ? 'text-red-500' : 'text-slate-400'}`} />
                <div className="overflow-hidden">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter truncate">Risk Alert</p>
                  <p className="text-[10px] font-bold text-slate-700 truncate">{highestCrimeSegment.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Segments Grid */}
          <div className="grid grid-cols-2 gap-2">
            {route.segments.map((segment) => (
              <div key={segment.id} className="p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm flex flex-col gap-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight truncate">{segment.name}</span>
                <div className="flex items-center gap-2">
                  <Sun className={`w-3 h-3 ${segment.lightingLevel === 'high' ? 'text-amber-500' : 'text-slate-200'}`} />
                  <Users className={`w-3 h-3 ${segment.crowdDensity === 'busy' ? 'text-blue-500' : 'text-slate-200'}`} />
                  <ShieldAlert className={`w-3 h-3 ${segment.crimeHistory === 'low' ? 'text-emerald-500' : 'text-red-300'}`} />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col items-center gap-3 text-center animate-in zoom-in duration-300">
          <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-black text-emerald-900 text-lg uppercase tracking-tight">Safely Arrived</h4>
            <p className="text-xs font-medium text-emerald-700">Journey complete. Your safety is our priority.</p>
          </div>
        </div>
      )}

      {/* Progress & Controls */}
      <div className="mt-2 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex flex-col flex-1 mr-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Progress</span>
            <span className="text-[11px] font-black text-indigo-600">{Math.round(progress * 100)}%</span>
          </div>
          <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
            <div 
              className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out rounded-full ${isFinished ? 'bg-emerald-500' : 'bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)]'}`}
              style={{ width: `${progress * 100}%` }}
            ></div>
          </div>
        </div>
        
        {!isFinished && (
          <button 
            onClick={onStart}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 ${
              isTracking 
                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 shadow-amber-100' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
            }`}
          >
            {isTracking ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                Hold
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                {progress > 0 ? 'Resume' : 'Start'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
