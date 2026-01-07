
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { SafeMap } from './components/SafeMap';
import { RouteDetails } from './components/RouteDetails';
import { SOSOverlay } from './components/SOSOverlay';
import { AppState, TransitRoute, SafetyAlert } from './types';
import { analyzeRouteSafety } from './services/geminiService';
import { Shield, Bell, Map as MapIcon, Navigation, AlertTriangle } from 'lucide-react';

const MOCK_ROUTES: TransitRoute[] = [
  {
    id: 'route-1',
    name: 'Shortest Path',
    color: '#ef4444',
    totalDistance: 1200,
    estimatedTime: 15,
    segments: [
      { id: 's1', name: 'Alleyway Shortcut', lightingLevel: 'low', crowdDensity: 'empty', crimeHistory: 'moderate', distance: 400 },
      { id: 's2', name: 'Main St', lightingLevel: 'high', crowdDensity: 'busy', crimeHistory: 'low', distance: 800 }
    ]
  },
  {
    id: 'route-2',
    name: 'Main Boulevard',
    color: '#10b981',
    totalDistance: 1800,
    estimatedTime: 22,
    segments: [
      { id: 's3', name: 'Broadway Ave', lightingLevel: 'high', crowdDensity: 'busy', crimeHistory: 'low', distance: 1000 },
      { id: 's4', name: 'Well-lit Plaza', lightingLevel: 'high', crowdDensity: 'moderate', crimeHistory: 'low', distance: 800 }
    ]
  },
  {
    id: 'route-3',
    name: 'The Park Path',
    color: '#3b82f6',
    totalDistance: 1500,
    estimatedTime: 18,
    segments: [
      { id: 's5', name: 'Park Perimeter', lightingLevel: 'medium', crowdDensity: 'moderate', crimeHistory: 'low', distance: 700 },
      { id: 's6', name: 'Residential St', lightingLevel: 'medium', crowdDensity: 'empty', crimeHistory: 'low', distance: 800 }
    ]
  }
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentLocation: null,
    origin: 'Home (Current)',
    destination: '',
    routes: [],
    selectedRouteId: null,
    isAnalyzing: false,
    alerts: [],
    isTracking: false,
    trackingProgress: 0,
    sosActive: false
  });

  const trackingIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Check geolocation permission on mount
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setState(prev => ({
          ...prev,
          currentLocation: { lat: pos.coords.latitude, lng: pos.coords.longitude }
        }));
      });
    }

    // Load initial alerts
    const initialAlerts: SafetyAlert[] = [
      { id: 'a1', type: 'warning', message: 'Street lamp outage reported on 5th Ave', location: { lat: 0, lng: 0 }, timestamp: new Date() },
      { id: 'a2', type: 'info', message: 'High police presence near Subway Station for event', location: { lat: 0, lng: 0 }, timestamp: new Date() }
    ];
    setState(prev => ({ ...prev, alerts: initialAlerts }));
  }, []);

  // Handle live tracking simulation
  useEffect(() => {
    if (state.isTracking && state.selectedRouteId) {
      trackingIntervalRef.current = window.setInterval(() => {
        setState(prev => {
          const newProgress = prev.trackingProgress + 0.005;
          if (newProgress >= 1) {
            if (trackingIntervalRef.current) clearInterval(trackingIntervalRef.current);
            return { ...prev, trackingProgress: 1, isTracking: false };
          }
          return { ...prev, trackingProgress: newProgress };
        });
      }, 100);
    } else {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
        trackingIntervalRef.current = null;
      }
    }

    return () => {
      if (trackingIntervalRef.current) clearInterval(trackingIntervalRef.current);
    };
  }, [state.isTracking, state.selectedRouteId]);

  const handleSearch = async () => {
    if (!state.destination) return;
    
    setState(prev => ({ ...prev, isAnalyzing: true, routes: [], trackingProgress: 0 }));
    
    const routesWithAnalysis = await analyzeRouteSafety(MOCK_ROUTES);
    
    setState(prev => ({
      ...prev,
      routes: routesWithAnalysis,
      isAnalyzing: false,
      selectedRouteId: routesWithAnalysis.sort((a, b) => (b.safetyScore || 0) - (a.safetyScore || 0))[0].id
    }));
  };

  const toggleTracking = () => {
    setState(prev => ({ 
      ...prev, 
      isTracking: !prev.isTracking,
      // Reset progress if starting fresh
      trackingProgress: prev.trackingProgress === 1 ? 0 : prev.trackingProgress
    }));
  };

  const triggerSOS = () => {
    setState(prev => ({ ...prev, sosActive: true }));
  };

  const selectedRoute = state.routes.find(r => r.id === state.selectedRouteId);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar - Route Planning */}
      <Sidebar 
        state={state} 
        onSearchChange={(val) => setState(p => ({ ...p, destination: val }))}
        onSearch={handleSearch}
        onSelectRoute={(id) => setState(p => ({ ...p, selectedRouteId: id, trackingProgress: 0, isTracking: false }))}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative bg-slate-200">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          {state.selectedRouteId && (
            <button 
              onClick={toggleTracking}
              className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-colors ${state.isTracking ? 'bg-blue-600 text-white' : 'bg-white text-slate-700'}`}
            >
              <Navigation className={`w-4 h-4 ${state.isTracking ? 'animate-pulse' : ''}`} />
              <span className="text-sm font-medium">
                {state.isTracking ? 'Tracking Live' : state.trackingProgress > 0 ? 'Resume Trip' : 'Start Journey'}
              </span>
            </button>
          )}
          
          <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-slate-700">
            <Bell className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium">{state.alerts.length} Nearby Alerts</span>
          </div>
        </div>

        <button 
          onClick={triggerSOS}
          className="absolute bottom-6 right-6 z-20 w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform active:scale-95"
          title="Emergency SOS"
        >
          <Shield className="w-8 h-8" />
        </button>

        {/* Map Visualization */}
        <div className="w-full h-full relative">
          <SafeMap 
            routes={state.routes} 
            selectedRouteId={state.selectedRouteId} 
            progress={state.trackingProgress} 
          />
          
          {selectedRoute && (
            <div className="absolute bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-96 glass p-4 rounded-xl shadow-xl border border-white/40">
              <RouteDetails 
                route={selectedRoute} 
                isTracking={state.isTracking} 
                progress={state.trackingProgress}
                onStart={toggleTracking}
              />
            </div>
          )}
        </div>
      </main>

      {/* SOS Modal */}
      {state.sosActive && <SOSOverlay onClose={() => setState(p => ({ ...p, sosActive: false }))} />}
    </div>
  );
};

export default App;
