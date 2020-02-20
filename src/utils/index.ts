import { difference, get, intersection } from 'lodash';
import { TypedLooseObject } from 'src/types/LooseObject';
import { FormFieldValue } from 'src/types/TranslationForm';
import { BaseResourceState } from '../types/BaseResourceState';

export const unique = <T>(array: T[]): T[] =>
  Array.from<T>(new Set<T>([...array]));

export const addUniqueValue = <T>(array: T[], newElement: T) =>
  unique<T>([...array, newElement]);

export const parseObjectListIds = (
  list?: any[] | number[] | null
): number[] => {
  if (!list || list.length === 0) {
    return [];
  }
  if (typeof list[0] === 'object') {
    return (list as any[]).map((c) => c.id);
  }
  return [...(list as number[])];
};

export const parseObjectId = (value?: any | number | null): number => {
  if (value !== 0 && !value) {
    return 0;
  }
  if (typeof value === 'object') {
    return Number(value.id);
  }
  return Number(value);
};

export const getIdListDiff = (
  oldIds?: number[] | any[],
  newIds?: number[] | any[]
) => {
  const newList = parseObjectListIds(newIds);
  const oldList = parseObjectListIds(oldIds);

  const removed = difference(oldList, newList);
  const added = difference(newList, oldList);
  const same = intersection(newList, oldList);
  return {
    added,
    removed,
    same,
  };
};

export const intitializeBaseResource = <TId>(): BaseResourceState<TId> => ({
  saved: false,
  isLoading: false,
  list: [],
  filtered: [],
  selected: [],
  total: 0,
  pages: {},
  page: 0,
  perPage: 0,
});

export const arrayToMap = <T extends { id: number }>(data: T[]) => {
  return data.reduce(
    (acc, curr) => ({ ...acc, [curr.id]: curr }),
    {} as TypedLooseObject<T>
  );
};

export const weekday = new Array(7);
weekday[0] = 'monday';
weekday[1] = 'tuesday';
weekday[2] = 'wednesday';
weekday[3] = 'thursday';
weekday[4] = 'friday';
weekday[5] = 'saturday';
weekday[6] = 'sunday';

export const createPaginationObject = (
  page?: number,
  limit?: number,
  skip?: number
) => {
  if (!page && !limit && !skip) {
    return null;
  }
  if (page && !limit) {
    return { page };
  }
  if (page && limit) {
    return {
      limit,
      skip: (page - 1) * limit,
    };
  }
  return { skip, limit };
};

export const getBase64 = (img: File) => {
  const reader = new FileReader();
  return new Promise<string>((resolve, reject) => {
    reader.addEventListener('load', () => resolve(reader.result as string));
    reader.readAsDataURL(img);
  });
};

export const createMallDependentUrl = (
  mallId: number,
  realtiveUrl: string
): string => {
  return `/cms/mall/${mallId}${realtiveUrl}`;
};

export const getTranslationValueObject = (
  data: TypedLooseObject<FormFieldValue<any>>
) => {
  return Object.keys(data).reduce(
    (acc, key) => {
      const value = data[key].value;
      const touched = data[key].touched;
      if (value === '' && touched) {
        return {
          ...acc,
          [key]: value,
        };
      }
      if (!value) {
        return acc;
      }
      return {
        ...acc,
        [key]: value,
      };
    },
    {} as TypedLooseObject<any>
  );
};

export const cleanTranslation = <T>(
  translation: TypedLooseObject<T> = {},
  currentLang: string
) =>
  Object.keys(translation)
    .filter((k) => k !== currentLang)
    .reduce(
      (acc, k) => ({
        ...acc,
        [k]: translation[k],
      }),
      {} as TypedLooseObject<T>
    );

export const createLanguageHeader = (language: string, headers: any = {}) => {
  return {
    ...headers,
    'accept-language': language,
  };
};

export const excludeVal = <T>(arr: T[], excludedVal: T): T[] =>
  arr.filter((e) => e !== excludedVal);

export const hasRequiredPermissions = (
  requiredPermissions: string[],
  permissions: any
): boolean => {
  return requiredPermissions.reduce((prev, curr) => {
    return prev && get(permissions, curr, false);
  }, true);
};

export const hasPermission = (
  requiredPermissions: string[],
  permissions: any
) => {
  if (get(permissions, 'everything', false)) {
    return true;
  }
  return hasRequiredPermissions(requiredPermissions, permissions);
};

export const getUrlFromData = <T>(
  data?: Partial<T> | null,
  filePropertyName: string = 'picture'
): string => {
  if (!data || !data[filePropertyName]) {
    return '';
  }
  return data[filePropertyName].url;
};
