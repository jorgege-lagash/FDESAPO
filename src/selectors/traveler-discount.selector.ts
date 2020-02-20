import { travelerDiscountListSchema } from 'src/schemas/traveler-discount.schema';
import { TravelerDiscount } from 'src/types/response/TravelerDiscount';
import {
  getDenormalizedEntities,
  getEntitiesByMallId,
  getEntityArray,
  getEntityById,
  getEntityIdsByMallId,
  getGlobalEntityIds,
  getTranslatedEntityById,
} from 'src/utils/selector.utils';

const entityName = 'travelerDiscount';

export const getTravelerDiscountArray = getEntityArray<TravelerDiscount>(
  entityName
);

export const getGlobalTravelerDiscountIds = getGlobalEntityIds(entityName);

export const getTravelerDiscountsByMallId = getEntitiesByMallId<
  TravelerDiscount
>(entityName);

export const getTravelerDiscountIdsByMallId = getEntityIdsByMallId<
  TravelerDiscount
>(entityName);

export const getTravelerDiscountById = getEntityById<TravelerDiscount>(
  entityName
);

export const getDenormalizedTravelerDiscounts = getDenormalizedEntities<
  TravelerDiscount
>(entityName, travelerDiscountListSchema);

export const getTranslatedTravelerDiscountById = getTranslatedEntityById<
  TravelerDiscount
>(entityName);
