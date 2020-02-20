import { FeatureSpaceType } from './FeatureSpaceType';
import { FileDTO } from './FileDTO';

export interface FeaturedSpace {
  id: number;
  name: string;
  mallId: number;
  active: boolean;
  created: string;
  modified: string;
  featureSpaceTypeId?: number;
  featureSpaceType?: FeatureSpaceType;
  pictureFile?: File;
  picture?: FileDTO;
}
