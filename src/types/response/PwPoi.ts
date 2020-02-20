import { PwLocation } from './PwBuilding';

export interface PwPoiMetadata {
  category?: string;
  pin_id?: string;
  local_id?: string;
  poi_type_id?: string;
}

export interface PwPoiDTO {
  zoomLevel: number;
  description: string;
  isExit: boolean;
  isActive: boolean;
  floorId: number;
  metaData: PwPoiMetadata;
  createdAt: string;
  customIconImageUrl: string;
  imageUrl: string | null;
  portalId: string;
  id: number;
  updatedAt: string;
  annotation: null;
  isAccessible: boolean;
  level: number;
  externalId: number;
  buildingId: number;
  maxZoomLevel: number;
  poiType: number;
  name: string;
  x: number;
  y: number;
  location: PwLocation;
  category: null;
}
export const createPwPoiFromPwPoiDTO = (poi: PwPoiDTO): PwPoi => {
  const {
    id,
    floorId,
    metaData,
    level,
    externalId,
    buildingId,
    name,
    location,
    customIconImageUrl,
  } = poi;
  return {
    id,
    floorId,
    suc: metaData.local_id || '',
    poiTypeId: Number(metaData.poi_type_id) || undefined,
    level,
    externalId,
    buildingId,
    name,
    location,
    customIconImageUrl: customIconImageUrl || '',
  };
};

export interface PwPoi {
  id: number;
  floorId: number;
  poiTypeId?: number;
  suc: string;
  level: number;
  externalId: number;
  buildingId: number;
  name: string;
  location: PwLocation;
  customIconImageUrl: string;
}
