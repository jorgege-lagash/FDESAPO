import React from 'react';
import { getBase64 } from 'src/utils';
import ImageLightbox from '../ImageLightbox/ImageLightbox';
import styles from './ImageInput.less';
interface OwnProps {
  defautlImagePreviewUrl: string;
  onChange: (value: File | null) => void;
  maxSize?: number;
  dimesion?: { width?: number; height?: number };
  messageSize?: string;
  messageDimension?: string;
  square?: boolean;
  messageSquare?: string;
}

interface OwnState {
  file: File | null;
  dataURI: string;
  error: any[];
}
const defaultProps = {
  defautlImagePreviewUrl: '',
  messageSize: 'Unsupported image size',
  messageDimension: 'Unsuppored image dimensions',
  onChange: () => {
    return;
  },
};

export class ImageInput extends React.Component<OwnProps, OwnState> {
  public static defaultProps = defaultProps;
  public state: OwnState = {
    file: null,
    dataURI: '',
    error: [],
  };
  constructor(props: OwnProps) {
    super(props);
  }

  public render() {
    const { dataURI, error } = this.state;
    const { defautlImagePreviewUrl } = this.props;
    return (
      <div>
        {(dataURI || defautlImagePreviewUrl) && (
          <ImageLightbox images={[dataURI || defautlImagePreviewUrl]} />
        )}
        <input
          style={{ marginTop: '10px' }}
          type="file"
          lang="es"
          accept=".png, .jpg, .jpeg"
          onChange={this.handleFileChange}
        />
        {error.length > 0 ? (
          <ul className={styles.errorsinput}>
            {error.map((item, i) => {
              return <li key={i}>{item}</li>;
            })}
          </ul>
        ) : (
          ''
        )}
      </div>
    );
  }

  private handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file: File | null = e.target.files![0];
    if (!file) {
      this.triggerChange(null);
      this.setState({ file: null, dataURI: '' });
      return;
    }
    const dataURIPromise = file ? getBase64(file) : Promise.resolve('');
    dataURIPromise
      .then((data) => {
        const img = new Image();
        img.onload = () => {
          file =
            this.checkSize(file!) &&
            this.checkDimesion(img.width, img.height) &&
            this.checkSquare(img.width, img.height)
              ? file
              : null;
          this.setState({ dataURI: file !== null ? data : '', file });
          this.triggerChange(file);
        };
        img.src = data;
      })
      .catch(() => {
        this.setState({ dataURI: '', file: null });
        this.triggerChange(null);
      });
  };

  private triggerChange = (file: File | null) => {
    this.props.onChange(file);
  };

  private checkSize = (file: File) => {
    const { maxSize, messageSize } = this.props;
    const { size } = file;
    const error: any[] = [];
    let validFile = true;
    if (maxSize !== undefined) {
      validFile = maxSize * 1000000 >= size;
    }
    if (!validFile) {
      error.push(messageSize);
    }
    this.setState({ error });
    return validFile;
  };

  private checkDimesion = (imgWidth?: number, imgHeight?: number) => {
    let validDimesion = true; // flag var
    const { square } = this.props;
    const { dimesion, messageDimension } = this.props;
    if (imgWidth === undefined || imgHeight === undefined || square === true) {
      return true;
    }
    if (dimesion !== undefined) {
      const error: any[] = this.state.error;
      validDimesion =
        dimesion.width === imgWidth && dimesion.height === imgHeight;
      if (!validDimesion) {
        error.push(messageDimension);
      }
      this.setState({ error });
    }
    return validDimesion;
  };

  private checkSquare = (imgWidth?: number, imgHeight?: number) => {
    let validSquare = true;
    const { dimesion, messageSquare, square } = this.props;
    if (square === undefined) {
      return validSquare;
    }
    if (imgWidth === undefined) {
      return validSquare;
    }
    if (dimesion !== undefined) {
      if (dimesion.width === undefined) {
        return validSquare;
      }
      validSquare = dimesion.width <= imgWidth && imgWidth === imgHeight;
      if (!validSquare) {
        const error: any[] = this.state.error;
        error.push(messageSquare);
        this.setState({ error });
      }
    }
    return validSquare;
  };
}
