import { types } from 'src/actions/locale.action';
import { APPCONFIG } from '../constants/config';
import { Action } from '../types/Action';

export interface LocaleState {
  lang: string;
}

export const initialLocale: LocaleState = {
  lang: `${APPCONFIG.env.defaultLocale}`,
};

export default function locale(
  state = initialLocale,
  action: Action
): LocaleState {
  const { type, payload } = action;
  if (type === types.SELECT_LOCALE) {
    return {
      lang: payload.locale,
    };
  }
  return state;
}
