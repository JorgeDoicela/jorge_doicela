export type AtlasSubTab = 'map' | 'routes' | '3d';

export type MapLayerType = 'historical' | 'topographic' | 'satellite';

export type HistoricalEra =
  | 'all'
  | 'patriarchs'
  | 'exodus_conquest'
  | 'monarchy'
  | 'exile_restoration'
  | 'second_temple'
  | 'apostolic';

export type PlaceCategory = 'city' | 'mountain' | 'water' | 'region' | 'archaeological_site';

export interface GeoCoordinate {
  lat: number;
  lng: number;
}

export interface AncientPlace {
  id: string;
  name: string;
  originalName: {
    hebrew?: string;
    greek?: string;
    transliteration: string;
    meaning: string;
  };
  coordinates: GeoCoordinate;
  category: PlaceCategory;
  era: HistoricalEra[];
  modernName: string;
  country: string;
  elevationMeters?: number;
  description: string;
  biblicalReferences: {
    reference: string;
    context: string;
  }[];
  archaeologicalNotes?: {
    discoveries: string[];
    excavationStatus: string;
    verifiedByBiblicalArchaeology: boolean;
  };
}

export interface RouteStop {
  id: string;
  stepNumber: number;
  placeName: string;
  coordinates: GeoCoordinate;
  eventDescription: string;
  biblicalReference: string;
  durationOrYear?: string;
  significance: string;
}

export interface HistoricalRoute {
  id: string;
  title: string;
  subtitle: string;
  category: 'exodus' | 'paul' | 'conquest' | 'jesus';
  era: HistoricalEra;
  color: string;
  totalDistanceKm: number;
  stops: RouteStop[];
  historicalContext: string;
  overviewBiblicalPassages: string[];
}

export type AncientStructureId = 'tabernacle' | 'solomon_temple' | 'herod_temple' | 'jerusalem_1st_century';

export interface StructureHotspot {
  id: string;
  label: string;
  originalName?: string;
  position3D: [number, number, number]; // [x, y, z] en espacio 3D normalizado
  category: 'exterior' | 'holy_place' | 'most_holy_place' | 'furniture' | 'defense';
  description: string;
  dimensionsCubits?: string;
  materials?: string[];
  scriptureReferences: string[];
}

export interface AncientStructure3D {
  id: AncientStructureId;
  title: string;
  originalName: string;
  historicalPeriod: string;
  approximateDate: string;
  location: string;
  description: string;
  dimensionsOverview: string;
  keySignificance: string;
  hotspots: StructureHotspot[];
}
