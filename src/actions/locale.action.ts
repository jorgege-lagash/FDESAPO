import { Language } from 'src/types/lang';

export const types = {
  SELECT_LOCALE: 'LOCALE/SELECT_LOCALE',
};
export interface SelectLocaleAction {
  type: string;
  payload: {
    locale: Language;
  };
}
export type SelectLocaleActionCreator = (
  locale: Language
) => SelectLocaleAction;

const selectLocale: SelectLocaleActionCreator = (locale: Language) => {
  return {
    type: types.SELECT_LOCALE,
    payload: {
      locale,
    },
  };
};

export const actions = {
  selectLocale,
};
