import { FileDTO } from './FileDTO';

export interface TravelerDiscount {
  id: number;
  poiId: number;
  mallId: number;
  discount: string;
  description: string;
  picture?: FileDTO;
  pictureFile?: File;
  discountPicture?: File;
}
