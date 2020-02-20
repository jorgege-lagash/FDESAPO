import { LatLngTuple } from 'leaflet';

export interface PwBuildingDTO {
  id: number;
  campusId: number;
  name: string;
  latitude: number;
  longitude: number;
  streetAddress: string;
  createdAt: string;
  updatedAt: string;
  floors: PwFloorDTO[];
  venueGuid: string;
  location: PwLocation;
  externalId: number;
}

export interface PwBuilding extends PwBuildingDTO {
  floors: PwFloor[];
}

export interface PwFloorDTO {
  id: number;
  name: string;
  originalMapUrl: null;
  level: number;
  isOutdoor: boolean;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  locationMapHierarchy: null;
  createdAt: string;
  updatedAt: string;
  buildingId: number;
  resources: PwResource[];
  venueGuid: string;
  maxZoomLevel: number;
  referencePoints: PwReferencePoints;
  externalId: number;
  scalePct: number;
}

export interface PwFloor extends PwFloorDTO {
  buildingSvg: string;
  floorPosition: LatLngTuple[];
}

export interface PwReferencePoints {
  rotation: number;
  topLeft: PwLocation;
  topRight: PwLocation;
  bottomLeft: PwLocation;
  bottomRight: PwLocation;
  portal: PwPortal;
}

export interface PwLocation {
  latitude: number;
  longitude: number;
}

export interface PwPortal {
  topRight: PwLocation;
  bottomLeft: PwLocation;
}

export interface PwResource {
  id: number;
  floorId: number;
  pdfUrl: string;
  svgUrl: string;
  zoomLevel: number;
  createdAt: string;
  updatedAt: string;
  externalId: number;
}
