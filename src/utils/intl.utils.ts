import { get } from 'lodash';
import { InjectedIntl } from 'react-intl';
import messages from 'src/translations/default/messages';

let intl: InjectedIntl;

export const setIntl = (injectedIntl: InjectedIntl) => {
  intl = injectedIntl;
};

export const formatMessage = (messageId: string) => {
  return intl.formatMessage(get(messages, messageId, {}));
};
