import { FileDTO } from './FileDTO';

export interface EventDirectory {
  id: number;
  mallId: number;
  startDate: string;
  endDate: string;
  displayEndDate?: string;
  displayStartDate?: string;
  name: string;
  description: string;
  picture?: FileDTO;
  pictureFile?: File;
}

export interface FormatedEvent {
  description: string;
  state: string;
  id: number;
  mallId: number;
  name: string;
  displayStartDate?: string;
  displayEndDate?: string;
}
