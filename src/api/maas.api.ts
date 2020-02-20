import { PwPageData } from 'src/types/response/PaginatedData';
import { PwBuildingDTO } from 'src/types/response/PwBuilding';
import { PwPoiDTO } from 'src/types/response/PwPoi';
import { addMallHeader, HttpService } from '../utils/request';

const fetchPois = (buildingId: number, limit: number, offset: number) => {
  const options = {
    query: {
      buildingId,
      limit,
      offset,
      poiOnly: true,
    },
  };
  return HttpService.get<PwPageData<PwPoiDTO>>('maas/points', options);
};

const fetchBuilding = (mallId: number) => {
  const options = {};
  const mallHeader = addMallHeader(mallId);
  return HttpService.get<PwPageData<PwBuildingDTO>>(
    'maas/buildings',
    options,
    mallHeader
  );
};
export const maas = {
  fetchPois,
  fetchBuilding,
};
