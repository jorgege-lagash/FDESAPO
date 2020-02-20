import { schema } from 'normalizr';

export const travelerDiscountSchema = new schema.Entity('travelerDiscount');
export const travelerDiscountListSchema = [travelerDiscountSchema];
