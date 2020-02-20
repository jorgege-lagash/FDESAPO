import React from 'react';

import { Button } from 'antd';
import FormatedHtmlEditor from '../FormatedHtmlEditor/FormatedHtmlEditor';

interface OwnProps {
  terms?: string;
  onSave: (text: string) => void;
}
export class TermsOfServiceForm extends React.PureComponent<OwnProps> {
  public state = { text: '' };

  constructor(props: OwnProps) {
    super(props);
    this.state = {
      text: props.terms || '',
    };
  }

  public componentDidUpdate(prevProps: OwnProps) {
    const { terms } = this.props;
    if (prevProps.terms !== terms) {
      this.setState({
        text: terms,
      });
    }
  }

  public handleChange = (text: string) => {
    this.setState({ text });
  };

  public setHTMLContent = (value: string) => {
    this.setState({
      text: value,
    });
  };

  public handleSave = () => {
    const htmlText = this.state.text;
    this.props.onSave(htmlText);
  };
  public isEmpty = () => {
    const commentText = this.state.text.trim();
    const re = /^(<p>(<br>|<br\/>|<br\s\/>|\s+|)<\/p>)+$/gm;
    return !commentText || re.test(commentText);
  };
  public render() {
    const { text } = this.state;
    return (
      <>
        <FormatedHtmlEditor
          placeholder="Información"
          value={text}
          onChange={this.handleChange}
        />
        <br />
        <Button
          type="primary"
          disabled={this.isEmpty()}
          onClick={this.handleSave}>
          Guardar
        </Button>
      </>
    );
  }
}
