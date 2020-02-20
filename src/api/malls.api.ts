import { Mall } from '../types/Mall';
import { addMallHeader, CustomHeaders, HttpService } from '../utils/request';

const fetchMall = (
  mallId: number,
  customHeaders: CustomHeaders = {}
): Promise<Mall> => {
  const mallHeader = { ...addMallHeader(mallId), ...customHeaders };
  return HttpService.get<Mall>(`malls/${mallId}`, {}, mallHeader);
};

const createMall = (userId: number, mallData: Mall) => {
  const requestBody = mallData;
  return HttpService.post<Mall>('malls', requestBody, {});
};

const updateMall = (
  mallId: number,
  mallData: Partial<Mall>,
  customHeaders: CustomHeaders = {}
) => {
  const mallHeader = { ...addMallHeader(mallId), ...customHeaders };

  const requestBody = mallData;
  return HttpService.patch<Mall>(
    `malls/${mallId}`,
    requestBody,
    {},
    mallHeader
  );
};

const fetchMalls = () => {
  return HttpService.get<Mall[]>('malls', {});
};

const fetchMallsThroughUser = (userId: number) => {
  return HttpService.get<Mall[]>(`users/${userId}/malls`, {});
};

export const mall = {
  fetchMall,
  create: createMall,
  fetchAll: fetchMalls,
  update: updateMall,
  fetchAllThroughUser: fetchMallsThroughUser,
};
