import { TermsOfService } from 'src/types/response/TermsOfService';
import { addMallHeader, HttpService } from '../utils/request';

const getTermsOfServices = (mallId: number): Promise<TermsOfService[]> => {
  const mallHeader = addMallHeader(mallId);
  return HttpService.get<TermsOfService[]>('terms-of-service', {}, mallHeader);
};

const createTermsOfService = (
  mallId: number,
  data: TermsOfService
): Promise<TermsOfService> => {
  const mallHeader = addMallHeader(mallId);
  return HttpService.post<TermsOfService>(
    'terms-of-service',
    data,
    {},
    mallHeader
  );
};

const updateTermsOfService = (
  mallId: number,
  termId: number,
  data: TermsOfService
): Promise<TermsOfService> => {
  const mallHeader = addMallHeader(mallId);
  return HttpService.patch<TermsOfService>(
    `terms-of-service/${termId}`,
    data,
    {},
    mallHeader
  );
};

export const termsOfService = {
  fetch: getTermsOfServices,
  create: createTermsOfService,
  update: updateTermsOfService,
};
