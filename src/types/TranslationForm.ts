export interface FormFieldValue<T> {
  dirty?: boolean;
  errors?: any;
  name?: string;
  touched?: boolean;
  validating?: boolean;
  url?: string;
  value: T;
}

export interface PoiTranslationFormProps
  extends TravelerDiscountTranslationFormProps {
  name: FormFieldValue<string>;
  tags: FormFieldValue<string>;
  description: FormFieldValue<string>;
}

export interface TagTranslationFormProps {
  tags: FormFieldValue<any>;
}

export interface MallTranslationFormProps {
  description: FormFieldValue<string>;
  information: FormFieldValue<string>;
}

export interface CategoryTranslationFormProps {
  name: FormFieldValue<string>;
}

export interface DealTranslationFormProps {
  title: FormFieldValue<string>;
  description: FormFieldValue<string>;
  pictureFile: FormFieldValue<File | null>;
}

export interface FeaturedSpaceTranslationFormProps {
  pictureFile: FormFieldValue<File | null>;
}

export interface TravelerDiscountTranslationFormProps {
  discountPicture: FormFieldValue<File | null>;
  discountDescription: FormFieldValue<string>;
}

export interface TravelerDiscountTranslationProps {
  discountPicture: FormFieldValue<File | null>;
  description: FormFieldValue<string>;
}

export interface EventDirectoryTranslationFormProps {
  name: FormFieldValue<string>;
  description: FormFieldValue<string>;
  pictureFile: FormFieldValue<File | null>;
}
export interface PoiMallZoneTranslationFormProps {
  name: FormFieldValue<string>;
  description: FormFieldValue<string>;
}
