import { FileDTO } from './FileDTO';
import { Poi } from './POI';

export interface Deal {
  id: number;
  mallId: number;
  poiId: number;
  poi?: Poi;
  title: string;
  description: string;
  pictureId?: number;
  pictureFile?: File;
  picture?: FileDTO;
  displayStartDate: string;
  displayEndDate: string;
  startDate: string;
  endDate: string;
}

export interface FormatedDeal {
  description: string;
  state: string;
  id: number;
  mallId: number;
  title: string;
  poi?: Poi;
  displayStartDate: string;
  displayEndDate: string;
}
