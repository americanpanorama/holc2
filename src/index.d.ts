import { Polygon, MultiPolygon } from '@types/geojson';

export type Grade = 'A' | 'B' | 'C' | 'D' | 'E';

export type FormId = 9675 | 19370203 | 19370601 | 19370826 | 19371001 | 1939 | 1;

export type Point = [number, number];

export type Bounds = [Point, Point];

export interface Boundary {
  ad_id: number;
  the_geojson: Polygon | MultiPolygon;
}

export interface RasterPolygon extends Boundary {
  map_id: number;
}

export interface HOLCPolygonPointer {
  adId: number;
  holcId: string;
}

export interface HOLCPolygon {
  id: string;
  ad_id: number;
  neighborhoodId: number;
  grade: Grade;
  area_geojson: Polygon | MultiPolygon;
  area: number;
  polygonBoundingBox: Bounds;
  labelCoords: Point;
}

export interface Raster {
  id: number;
  parent_id: number | null;
  overlaps: boolean;
  city: string;
  state: string;
  year: string | number;
  file_name: string;
  name: string;
  minZoom: number;
  maxZoom: number;
  bounds: Bounds,
  centerLat: number;
  centerLng: number;
  url: string;
}

export interface City {
  ad_id: number;
  name: string;
  state: string;
  year: string | number;
  searchName: string;
  slug: string;
  form_id: FormId;
  hasImages: boolean;
  hasADs: boolean;
  mapIds: number[];
  area: {
    total: number;
    a: number;
    b: number;
    c: number;
    d: number;
  };
  hasPolygons: boolean;
  bounds: Bounds;
  centerLat: number;
  centerLng: number;
  population:
  {
    total: number;
    AfricanAmerican: number;
    asianAmerican: number;
    nativeAmerican: number;
    other: number;
    fb_AfricanAmerican: number;
    fb_Chinese: number;
    fb_Japanese: number;
    fb_white: number;
    nativeWhite: number;
  };
}

export interface AppState {
  selectedArea: string | null;
  selectedCategory: string | null;
  selectedCity: number | null;
  selectedGrade: string | null;
  selectedText: string | null;
  showADScan: boolean;
  showADSelections: boolean;
  showContactUs: boolean;
  showCityStats: true;
  showFullHOLCMaps: boolean;
  showHOLCMaps: boolean;
  showNationalLegend: boolean;
  showDataViewerFull: boolean;
  adSelections: [];
  areaDescriptions: null;
  loadingCity: null;
  adScan;
  visibleCities: number[];
  map: {
    zoom: number;
    center: Point;
    bounds: Bounds;
    aboveThreshold: boolean;
    visibleRasters: Raster[];
    visibleRasterPolygons: RasterPolygon[];
    selectableRasterBoundaries: [];
    visibleBoundaries: Boundary[];
    visiblePolygons: HOLCPolygon[];
    highlightedPolygons: HOLCPolygonPointer[];
    loadingPolygonsFor: number[];
    userPosition: Point | null;
    geolocating: boolean;
    sorting: boolean;
    sortingPossibilities: [];
    sortingLatLng: Point;
  };
  searchingADsFor: string | null;
  adSearchHOLCIds: [];
  cities: City[];
  formsMetadata: FormsMetadata;
  dimensions: any;
  initialized: boolean;
  donutCityMarkers: boolean;
  edition: string;
};
