import React from 'react';

import { Col, Form, Icon, Row, Select, Spin } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import messages from 'src/translations/default/messages';
import { Tag } from 'src/types/response/Tag';
import { TagTranslationFormProps } from 'src/types/TranslationForm';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';

interface OwnProps extends FormComponentProps {
  renderSearchText: (name: string, text: string) => any;
  onSearch: (tagText: string) => void;
  onBlur: () => void;
  onChange: () => void;
  onDeselect: (data: any) => void;
  onInputKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  isLoadingCategories: boolean;
  refTags: any;
  filteredTags: Tag[];
  tagText: string;
}

const FormItem = Form.Item;

type Props = OwnProps & TagTranslationFormProps & InjectedIntlProps;
class CustomForm extends React.Component<Props> {
  public render() {
    const {
      intl,
      isLoadingCategories,
      filteredTags,
      refTags,
      tagText,
      renderSearchText,
      onSearch,
      onBlur,
      onChange,
      onDeselect,
      onInputKeyDown,
    } = this.props;

    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Row gutter={16}>
          <Col span={12} offset={6}>
            <ErrorBoundary>
              <Spin
                spinning={isLoadingCategories}
                indicator={
                  <Icon type="loading" style={{ fontSize: 24 }} spin={true} />
                }>
                <FormItem
                  label={intl.formatMessage(messages.store.label.tags)}
                  extra={
                    <span>
                      Para crear un nuevo tag, digite el nombre añadiendo una
                      coma. Ejemplo:{' '}
                      <i>
                        <b>Zapatillas,</b>
                      </i>
                      .
                    </span>
                  }>
                  {getFieldDecorator('filteredTags', {
                    rules: [],
                  })(
                    <Select
                      style={{
                        display: 'block',
                      }}
                      mode="multiple"
                      onSearch={onSearch}
                      onBlur={onBlur}
                      onChange={onChange}
                      onDeselect={onDeselect}
                      onInputKeyDown={onInputKeyDown}
                      ref={refTags}
                      placeholder={intl.formatMessage(
                        messages.store.placeholder.tags
                      )}
                      filterOption={false}>
                      {filteredTags.map((tag) => {
                        return (
                          <Select.Option key={`${tag.id}`} value={tag.id}>
                            {renderSearchText(tag.name, tagText)}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>
              </Spin>
            </ErrorBoundary>
          </Col>
        </Row>
      </Form>
    );
  }
}
const TranslationForm = injectIntl(CustomForm, {
  withRef: true,
});
export const TagTranslationForm = Form.create<Props>({
  mapPropsToFields(props) {
    return {
      filteredTags: Form.createFormField({
        ...props.filteredTags,
      }),
    };
  },
})(TranslationForm);
