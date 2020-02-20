import { Zone } from 'src/types/response/Zone';
import {
  addMallHeader,
  CustomRequestOptions,
  HttpService,
} from '../utils/request';

const getMallZoneById = (mallId: number, zoneId: number): Promise<Zone> => {
  const options: CustomRequestOptions = {};
  const mallHeader = addMallHeader(mallId);
  return HttpService.get<Zone>(`zones/${zoneId}`, options, mallHeader);
};

const getMallZones = (mallId: number): Promise<Zone[]> => {
  const options: CustomRequestOptions = {};
  const mallHeader = addMallHeader(mallId);
  return HttpService.get<Zone[]>('zones', options, mallHeader);
};

const createMallZones = (mallId: number, data: Zone): Promise<Zone> => {
  const mallHeader = addMallHeader(mallId);
  return HttpService.post<Zone>('zones', data, {}, mallHeader);
};

const updateMallZone = (
  mallId: number,
  zoneId: number,
  data: Zone
): Promise<Zone> => {
  const mallHeader = addMallHeader(mallId);
  return HttpService.patch<Zone>(`zones/${zoneId}`, data, {}, mallHeader);
};

export const zone = {
  fetchById: getMallZoneById,
  fetch: getMallZones,
  create: createMallZones,
  update: updateMallZone,
};
