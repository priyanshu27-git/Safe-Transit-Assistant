
import React from 'react';
import { TransitRoute } from '../types';
import { Sun, Users, ShieldAlert, Clock, ArrowRight, Pause, Play, CheckCircle2 } from 'lucide-react';

interface RouteDetailsProps {
  route: TransitRoute;
  isTracking: boolean;
  progress: number;
  onStart: () => void;
}

export const RouteDetails: React.FC<RouteDetailsProps> = ({ route, isTracking, progress, onStart }) => {
  const isFinished = progress >= 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800 text-lg">{route.name}</h3>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-600">
            {isFinished ? 'Arrived' : `${Math.round(route.estimatedTime * (1 - progress))} mins left`}
          </span>
        </div>
      </div>

      {!isFinished ? (
        <div className="grid grid-cols-2 gap-3">
          {route.segments.map((segment) => (
            <div key={segment.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">{segment.name}</span>
              <div className="flex items-center gap-3">
                <div title="Lighting Level">
                  <Sun className={`w-4 h-4 ${segment.lightingLevel === 'high' ? 'text-amber-500' : 'text-slate-300'}`} />
                </div>
                <div title="Crowd Density">
                  <Users className={`w-4 h-4 ${segment.crowdDensity === 'busy' ? 'text-blue-500' : 'text-slate-300'}`} />
                </div>
                <div title="Crime Risk">
                  <ShieldAlert className={`w-4 h-4 ${segment.crimeHistory === 'low' ? 'text-emerald-500' : 'text-red-500'}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-xl flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-bold text-emerald-900">Destination Reached</h4>
            <p className="text-xs text-emerald-700">You have safely arrived at your destination.</p>
          </div>
        </div>
      )}

      <div className="mt-2 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex flex-col flex-1 mr-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Trip Progress</span>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${isFinished ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                style={{ width: `${progress * 100}%` }}
              ></div>
            </div>
            <span className="text-sm font-bold text-slate-600 min-w-[3rem] text-right">{Math.round(progress * 100)}%</span>
          </div>
        </div>
        
        {!isFinished && (
          <button 
            onClick={onStart}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-sm shadow-md transition-all ${
              isTracking 
                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isTracking ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                {progress > 0 ? 'Resume' : 'Start'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
