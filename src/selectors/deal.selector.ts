import { Moment } from 'moment';
import { dealListSchema } from 'src/schemas/deal.schema';
import { Deal, FormatedDeal } from 'src/types/response/Deal';
import { checkState } from 'src/utils/event-directory.utils';
import {
  getDenormalizedEntities,
  getEntitiesByMallId,
  getEntityArray,
  getEntityById,
  getEntityIdsByMallId,
  getGlobalEntityIds,
  getTranslatedEntityById,
} from 'src/utils/selector.utils';

const entityName = 'deals';
const dateFormat = 'YYYY-MM-DD';

export const getDealArray = getEntityArray<Deal>(entityName);

export const getGlobalDealIds = getGlobalEntityIds(entityName);

export const getDealsByMallId = getEntitiesByMallId<Deal>(entityName);

export const getDealIdsByMallId = getEntityIdsByMallId<Deal>(entityName);

export const getDealById = getEntityById<Deal>(entityName);

export const getDenormalizedDeals = getDenormalizedEntities<Deal>(
  entityName,
  dealListSchema
);

export const getTranslatedDealById = getTranslatedEntityById<Deal>(entityName);

export const getFormatedDeals = (
  deals: Deal[],
  today: Moment
): FormatedDeal[] => {
  const todayFormated = today.format(dateFormat);
  return deals
    .filter((deal) => deal && deal.id)
    .map((deal) => {
      const formated = {} as FormatedDeal;
      formated.title = deal.title;
      formated.description = deal.description;
      formated.id = deal.id;
      formated.poi = deal.poi;
      formated.displayStartDate = deal.displayStartDate;
      formated.displayEndDate = deal.displayEndDate;
      formated.state = checkState(
        todayFormated,
        deal.displayStartDate,
        deal.displayEndDate
      );
      return formated;
    });
};
