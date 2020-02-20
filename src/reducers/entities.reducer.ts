import { languages } from 'src/types/lang';
import { types } from '../actions/auth.action';
import { Action } from '../types/Action';

const baseState = {
  pois: {},
  pwpois: {},
  pwfloors: {},
  pwbuildings: {},
  channels: {},
  categories: {},
  files: {},
  permissions: {},
  malls: {},
  poiTypes: {},
  featuredSpaces: {},
  schedules: {},
  termsOfService: {},
  travelerDiscount: {},
  zones: {},
  tags: {},
  deals: {},
  events: {},
};

const cloneEmptyBaseState = () =>
  Object.keys(baseState).reduce((finalState, key) => {
    return {
      ...finalState,
      [key]: {},
    };
  }, {});

const initialTranslationState = languages.reduce((acc, lang) => {
  return {
    ...acc,
    [lang]: cloneEmptyBaseState(),
  };
}, {});

const initialState = {
  ...initialTranslationState,
  ...baseState,
};

export default (state: any = initialState, action: Action) => {
  if (action.type === types.LOGOUT_SUCCESS) {
    return { ...initialState };
  }
  if (action.payload && action.payload.entities) {
    const { entities, language } = action.payload;
    if (language) {
      return Object.keys(entities).reduce(
        (acc, currentKey) => {
          acc[language] = {
            ...acc[language],
            [currentKey]: {
              ...(acc[language] && acc[language][currentKey]),
              ...entities[currentKey],
            },
          };
          return acc;
        },
        { ...state }
      );
    }
    return Object.keys(entities).reduce(
      (acc, currentKey) => {
        acc[currentKey] = {
          ...acc[currentKey],
          ...entities[currentKey],
        };
        return acc;
      },
      { ...state }
    );
  }
  return state;
};
