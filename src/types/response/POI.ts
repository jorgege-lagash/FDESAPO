import { PoiState } from 'src/types/response/PoiState';
import { Category } from './Category';
import { Deal } from './Deal';
import { FileDTO } from './FileDTO';
import { TravelerDiscount } from './TravelerDiscount';

export interface Poi {
  id: number;
  mallId: number;
  suc: string | null;
  active?: boolean;
  categories: Category[];
  name: string;
  tags: number[];
  facebook?: string;
  instagram?: string;
  website?: string;
  telephone?: string;
  created?: string;
  modified?: string;
  poisPhunware?: string[];
  channels?: string[];
  logoFile?: File;
  logo?: FileDTO;
  image?: FileDTO;
  screenshot?: FileDTO;
  poiTranslations?: PoiTranslation[];
  poiType?: PoiType;
  hasTouristDiscount?: boolean;
  hasDeals?: boolean;
  poiTypeId?: number;
  location?: string;
  description?: string;
  schedule?: string;
  travelerDiscounts?: TravelerDiscount[];
  deals?: Deal[];
  poiStateId?: number;
  poiState?: PoiState;
  floor?: number;
  slug?: string;
  urlMap?: string;
}

export interface PoiTranslation {
  poiId: number;
  // poi: Poi;
  languageId: number;
  language: string;
  name: string;
  tags: string;
  location: string;
  description: string;
  schedule: string;
  discountPicture?: File;
}

export interface PoiFormData extends Poi {
  hasDeal: boolean;
  dealTitle: string;
  dealDescription: string;
  dealPicture: File;
  discountId: number;
  dealId: number;
  discount: string;
  discountDescription: string;
  discountPicture: File;
  poiImage: File;
}

interface PoiType {
  id: number;
  name: string;
}
