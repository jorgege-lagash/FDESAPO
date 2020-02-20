import { get } from 'lodash';
import React from 'react';
import { FormattedMessage, InjectedIntl } from 'react-intl';
import messages from 'src/translations/default/messages';
import { TypedLooseObject } from 'src/types/LooseObject';
import { ApiError, ApiErrorDetail } from 'src/types/response/ApiError';

export const buildValidationErrorMessage = (
  detail: ApiErrorDetail[] = [],
  intl: InjectedIntl,
  propDefaultMessages: TypedLooseObject<FormattedMessage.MessageDescriptor>
) => {
  return (
    <>
      {detail.length > 0 && (
        <>
          <br />
          <strong>
            {intl.formatMessage(messages.default.validateFollowingFields)}
          </strong>
          <br />
          <ul>
            {detail.map((d, index) => {
              return (
                <li key={index}>
                  {intl.formatMessage(
                    propDefaultMessages[d.property] || {
                      id: `${d.property}`,
                      defaultMessage: `${d.property}`,
                    }
                  )}
                  :{buildConstraintMessage(d.constraints)}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
};

export const buildErrorMessageContent = (
  defaultMessage: string,
  error: ApiError,
  intl: InjectedIntl,
  propTranslationPath: string
) => {
  const detail = buildValidationErrorMessage(
    error.details,
    intl,
    get(messages, propTranslationPath, {})
  );
  return (
    <div>
      {error.message || defaultMessage}

      {detail}
    </div>
  );
};

const buildConstraintMessage = (constraints: TypedLooseObject<string> = {}) => {
  return (
    <ol>
      {Object.keys(constraints).map((k) => {
        return <li key={k}>{constraints[k]}</li>;
      })}
    </ol>
  );
};
