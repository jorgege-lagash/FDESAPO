import React from 'react';

import { Button, Modal, Select, Spin } from 'antd';
import MapController, {
  FloorMapController,
} from 'src/components/FloorMap/FloorMapController';
import ImageLightbox from 'src/components/ImageLightbox/ImageLightbox';
import { PwPoi } from 'src/types/response/PwPoi';
import { urltoFile } from 'src/utils/image.utils';
import { poiToCompleteName } from 'src/utils/map.utils';

interface OwnProps {
  pois: PwPoi[];
  defaultImage: string | null;
  onChange: (file: File) => void;
}

interface OwnState {
  visible: boolean;
  confirmLoading: boolean;
  imageUrl: string;
  loading: boolean;
  id: number;
}
const defaultProps = {
  onChange: () => {
    return;
  },
};
type Props = OwnProps;
export class MapImageGenerator extends React.Component<Props, OwnState> {
  public static defaultProps = defaultProps;

  public mapControllerRef = React.createRef<any>();

  public state = {
    visible: false,
    confirmLoading: false,
    imageUrl: '',
    id: 0,
    loading: false,
  };

  public handleCancel = () => {
    this.setState({ visible: false, loading: false, imageUrl: '' });
  };

  public handleOk = async () => {
    setTimeout(() => this.setState({ loading: true }), 100);
    const map: FloorMapController = this.mapControllerRef.current.getWrappedInstance();
    map
      .getBase64Image()
      .then(async (base64Image) => {
        this.setState({
          visible: false,
          imageUrl: base64Image,
          loading: false,
        });
        const file = await urltoFile(
          base64Image,
          'map-image',
          'image/png;base64'
        );
        this.props.onChange(file);
      })
      .catch(() => {
        this.setState({ visible: false, imageUrl: '', loading: false });
      });
  };
  public openModal = () => {
    this.setState({ visible: true });
  };

  public getImageUrl() {
    const { defaultImage } = this.props;
    const { imageUrl } = this.state;
    if (imageUrl && imageUrl !== '') {
      return <ImageLightbox images={[imageUrl]} />;
    } else if (defaultImage && defaultImage !== '') {
      return <ImageLightbox images={[defaultImage]} />;
    }
    return null;
  }

  public render() {
    const { pois } = this.props;
    const { visible, confirmLoading, id, loading } = this.state;
    return (
      <>
        <div style={{ marginTop: '12px', marginBottom: '12px' }}>
          {this.getImageUrl()}
        </div>
        Seleccione el POI que desea mostrar en el mapa. <br />
        <Select
          style={{ width: '200px', marginTop: '15px', marginBottom: '11px' }}
          onChange={this.handleChange}>
          {pois.map((point) => (
            <Select.Option key={`${point.id}`} value={point.id}>
              {poiToCompleteName(point)}
            </Select.Option>
          ))}
        </Select>
        <br />
        <Button title="" onClick={this.openModal}>
          Generar Imagen
        </Button>
        <Modal
          title="Generar Imagen de Mapa"
          okText="Generar"
          style={{ top: 10 }}
          width={650}
          visible={visible}
          closable={!loading}
          maskClosable={!loading}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          bodyStyle={{ overflowY: 'auto', maxHeight: '80vh' }}>
          <h3>Instrucciones</h3>
          <br />
          1 - Arrastre el mapa para cambiar la posición de la imagen.
          <br />
          2 - Haga scroll sobre el mapa para cambiar el zoom.
          <br />
          3 - Haga click en el botón generar para generar la imagen.
          <br />
          <Spin spinning={loading} tip="Cargando...">
            {loading && (
              <div
                style={{
                  width: '600px',
                  height: '600px',
                  backgroundColor: '#001529',
                }}>
                -
              </div>
            )}
            <MapController
              ref={this.mapControllerRef}
              poiId={id}
              style={{
                width: '600px',
                height: '600px',
                overflow: 'hidden',
              }}
            />
          </Spin>
        </Modal>
      </>
    );
  }

  private handleChange = (id: number) => {
    this.setState({ id });
  };
}
