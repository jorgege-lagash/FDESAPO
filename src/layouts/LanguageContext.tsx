import React from 'react';
import { APPCONFIG } from 'src/constants/config';

export const LanguageContext = React.createContext({
  language: APPCONFIG.env.defaultLocale,
});
