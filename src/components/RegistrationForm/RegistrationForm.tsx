import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  Row,
  Select,
  Tooltip,
} from 'antd';
import * as React from 'react';

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const { RangePicker } = DatePicker;
const residences = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];
const rangeConfig = {
  rules: [{ type: 'array', required: true, message: 'Please select time!' }],
};

class RegistrationForm extends React.Component<any, any> {
  public state: any = {
    confirmDirty: false,
    autoCompleteResult: [],
  };

  public handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        // tslint:disable-next-line:no-console
        console.log('Received values of form: ', values);
      }
    });
  };

  public handleConfirmBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  public compareToFirstPassword = (
    // tslint:disable-next-line:no-unused-variable
    rule: any,
    value: string,
    callback: (value?: any) => void
  ) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };
  public validateToNextPassword = (
    // tslint:disable-next-line:no-unused-variable
    rule: any,
    value: string,
    callback: (value?: any) => void
  ) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  public handleWebsiteChange = (value: string) => {
    let autoCompleteResult: string[];
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(
        (domain) => `${value}${domain}`
      );
    }
    this.setState({ autoCompleteResult });
  };

  public render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    );

    const websiteOptions = autoCompleteResult.map((website: string) => (
      <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ));

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="E-mail">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Password">
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(<Input type="password" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Confirm Password">
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: 'Please confirm your password!',
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={
            <span>
              Nickname&nbsp;
              <Tooltip title="What do you want others to call you?">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }>
          {getFieldDecorator('nickname', {
            rules: [
              {
                required: true,
                message: 'Please input your nickname!',
                whitespace: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Habitual Residence">
          {getFieldDecorator('residence', {
            initialValue: ['zhejiang', 'hangzhou', 'xihu'],
            rules: [
              {
                type: 'array',
                required: true,
                message: 'Please select your habitual residence!',
              },
            ],
          })(<Cascader options={residences} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="RangePicker[showTime]">
          {getFieldDecorator('range-time-picker', rangeConfig)(
            <RangePicker showTime={true} format="YYYY-MM-DD HH:mm:ss" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Phone Number">
          {getFieldDecorator('phone', {
            rules: [
              { required: true, message: 'Please input your phone number!' },
            ],
          })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Website">
          {getFieldDecorator('website', {
            rules: [{ required: true, message: 'Please input website!' }],
          })(
            <AutoComplete
              dataSource={websiteOptions}
              onChange={this.handleWebsiteChange}
              placeholder="website">
              <Input />
            </AutoComplete>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Captcha"
          extra="We must make sure that your are a human.">
          <Row gutter={8}>
            <Col span={12}>
              {getFieldDecorator('captcha', {
                rules: [
                  {
                    required: true,
                    message: 'Please input the captcha you got!',
                  },
                ],
              })(<Input />)}
            </Col>
            <Col span={12}>
              <Button>Get captcha</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          {getFieldDecorator('agreement', {
            valuePropName: 'checked',
          })(
            <Checkbox>
              I have read the <a href="">agreement</a>
            </Checkbox>
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);
export default WrappedRegistrationForm;
