
export interface Coordinate {
  lat: number;
  lng: number;
}

export interface RouteSegment {
  id: string;
  name: string;
  lightingLevel: 'high' | 'medium' | 'low';
  crowdDensity: 'busy' | 'moderate' | 'empty';
  crimeHistory: 'low' | 'moderate' | 'high';
  distance: number; // in meters
}

export interface TransitRoute {
  id: string;
  name: string;
  segments: RouteSegment[];
  totalDistance: number;
  estimatedTime: number; // in minutes
  safetyScore?: number; // 0-100
  riskAnalysis?: string;
  color: string;
}

export interface SafetyAlert {
  id: string;
  type: 'danger' | 'warning' | 'info';
  message: string;
  location: Coordinate;
  timestamp: Date;
}

export interface AppState {
  currentLocation: Coordinate | null;
  destination: string;
  origin: string;
  routes: TransitRoute[];
  selectedRouteId: string | null;
  isAnalyzing: boolean;
  alerts: SafetyAlert[];
  isTracking: boolean;
  trackingProgress: number; // 0 to 1
  sosActive: boolean;
}
