import React from 'react';

import CKEditor from 'ckeditor4-react';
import { APPCONFIG } from 'src/constants/config';
interface OwnProps {
  placeholder?: string;
  value?: string;
  onChange: (val: string) => void;
}

interface OwnState {
  isLoadEventAttached: boolean;
}

type Props = OwnProps;
const defaultProps = {
  placeholder: '',
  // value: '',
  onChange: () => null,
};
export default class FormatedHtmlEditor extends React.Component<
  Props,
  OwnState
> {
  public static defaultProps = defaultProps;

  public state: OwnState = { isLoadEventAttached: false };

  public editorRef: React.RefObject<any>;

  constructor(props: Props) {
    super(props);
    this.editorRef = React.createRef();
  }

  public componentDidMount() {
    const interval = setInterval(() => {
      const { isLoadEventAttached } = this.state;
      if (isLoadEventAttached) {
        clearInterval(interval);
        return;
      }
      this.tryAttachLoadEvent();
    }, 100);
  }

  public tryAttachLoadEvent = () => {
    const { isLoadEventAttached } = this.state;
    const editor = this.editorRef.current && this.editorRef.current.editor;
    if (!isLoadEventAttached && editor && editor !== null) {
      editor.on('instanceReady', () => {
        const { value } = this.props;
        editor.setData(value);
      });
      this.setState({ isLoadEventAttached: true });
    }
  };

  public handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    this.triggerChange(value);
  };

  public handleEditorChange = (evt: any) => {
    if (evt && evt.editor !== null) {
      this.triggerChange(evt.editor.getData());
    }
  };

  public triggerChange = (value: string) => {
    this.props.onChange(value);
  };

  public render() {
    const { value } = this.props;
    return (
      <CKEditor
        scriptUrl="/assets/js/ckeditor/ckeditor.js"
        data={value}
        ref={this.editorRef}
        onChange={this.handleEditorChange}
        config={{
          extraPlugins: 'colorbutton,colordialog,font',
          contentsCss: `${APPCONFIG.env.publicUrl}/contents.css`,
          font_names:
            'Lato/Lato, sans-serif;' +
            'Roboto/Roboto, sans-serif;' +
            'Arial/Arial, Helvetica, sans-serif;' +
            'Times New Roman/Times New Roman, Times, serif;' +
            'Verdana;',
          toolbarGroups: [
            { name: 'document', groups: ['mode', 'document', 'doctools'] },
            { name: 'clipboard', groups: ['clipboard', 'undo'] },
            {
              name: 'editing',
              groups: ['find', 'selection', 'editing'],
            },

            {
              name: 'paragraph',
              groups: [
                'list',
                'indent',
                'blocks',
                'align',
                'bidi',
                'paragraph',
              ],
            },
            { name: 'links', groups: ['links'] },
            { name: 'insert', groups: ['insert'] },
            '/',
            { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
            { name: 'styles', groups: ['styles'] },
            { name: 'colors' },

            { name: 'colors', groups: ['colors'] },
            { name: 'tools', groups: ['tools'] },
            { name: 'others', groups: ['others'] },
          ],
          stylesSet: [
            {
              name: 'Lato Black',
              element: 'h1',
              styles: {
                'font-family': 'Lato, sans-serif;',
                'font-weight': '900',
              },
            },
            {
              name: 'Italic Title',
              element: 'h2',
              styles: { 'font-style': 'italic' },
            },
            {
              name: 'Subtitle',
              element: 'h3',
              styles: { color: '#aaa', 'font-style': 'italic' },
            },
            {
              name: 'Special Container',
              element: 'div',
              styles: {
                padding: '5px 10px',
                background: '#eee',
                border: '1px solid #ccc',
              },
            },
            {
              name: 'Marker',
              element: 'span',
              attributes: { class: 'marker' },
            },
            { name: 'Big', element: 'big' },
            { name: 'Small', element: 'small' },
            { name: 'Typewriter', element: 'tt' },
            { name: 'Computer Code', element: 'code' },
            { name: 'Keyboard Phrase', element: 'kbd' },
            { name: 'Sample Text', element: 'samp' },
            { name: 'Variable', element: 'var' },
            { name: 'Deleted Text', element: 'del' },
            { name: 'Inserted Text', element: 'ins' },
            { name: 'Cited Work', element: 'cite' },
            { name: 'Inline Quotation', element: 'q' },
            {
              name: 'Language: RTL',
              element: 'span',
              attributes: { dir: 'rtl' },
            },
            {
              name: 'Language: LTR',
              element: 'span',
              attributes: { dir: 'ltr' },
            },
          ],
          removeButtons:
            'Form,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Checkbox,Scayt,Image,Flash,Iframe,About,Maximize',
        }}
      />
    );
  }
}
