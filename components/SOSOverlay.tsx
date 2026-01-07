
import React, { useState, useEffect } from 'react';
import { Shield, X, Phone, Users, MapPin, AlertTriangle, Loader2 } from 'lucide-react';

interface SOSOverlayProps {
  onClose: () => void;
}

export const SOSOverlay: React.FC<SOSOverlayProps> = ({ onClose }) => {
  const [countdown, setCountdown] = useState(5);
  const [isAlerting, setIsAlerting] = useState(false);

  useEffect(() => {
    if (countdown > 0 && !isAlerting) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isAlerting) {
      setIsAlerting(true);
    }
  }, [countdown, isAlerting]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-red-950/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose}></div>
      
      {/* Content */}
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <div className="p-8 flex flex-col items-center text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${isAlerting ? 'bg-red-600 animate-ping' : 'bg-red-100'}`}>
            <Shield className={`w-12 h-12 ${isAlerting ? 'text-white' : 'text-red-600'}`} />
          </div>

          {!isAlerting ? (
            <>
              <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Emergency SOS</h2>
              <p className="text-slate-500 mb-8 px-4">Alerting emergency contacts and local authorities in...</p>
              
              <div className="text-7xl font-black text-red-600 mb-10 tabular-nums">
                {countdown}
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 border-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-2xl transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel Emergency Alert
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-black text-red-600 mb-2 uppercase tracking-tight">Help is on the way</h2>
              <p className="text-slate-600 mb-6 font-medium">Your live location and audio are being recorded and broadcasted to emergency responders.</p>
              
              <div className="w-full space-y-3 mb-8 text-left">
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                  <div className="p-2 bg-red-600 rounded-lg text-white">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-red-800 uppercase">Location Shared</div>
                    <div className="text-xs text-red-700">Coordinates: 40.7128° N, 74.0060° W</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="p-2 bg-slate-600 rounded-lg text-white">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 uppercase">Contacts Notified</div>
                    <div className="text-xs text-slate-600">3 emergency contacts received SMS</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                  <div className="p-2 bg-indigo-600 rounded-lg text-white">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-indigo-800 uppercase">911 Connection</div>
                    <div className="text-xs text-indigo-700">Line open - broadcasting live audio</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setIsAlerting(false)} 
                  className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  I'm Safe Now
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
