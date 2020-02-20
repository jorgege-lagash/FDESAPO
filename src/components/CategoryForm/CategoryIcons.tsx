import React from 'react';
import style from './Category.less';

import icons from './icons';
import { Modal, Button } from 'antd';
import CategoryIcon from './CategoryIcon';

interface Props {
  value?: string;
  onChange?: (args: any) => any;
}

interface State {
  open: boolean;
}

const defaultProps = {};

class CategoryIcons extends React.PureComponent<Props, State> {
  public static defaultProps = defaultProps;

  constructor(props: Props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  public handleClick = (name: string) => () => {
    if (this.props.onChange) {
      this.props.onChange(name);
    }
  };

  public handleOpen = () => {
    this.setState({ open: true });
  };

  public handleClose = () => {
    this.setState({ open: false });
  };

  public renderIconButton = (iconName: string) => {
    const isActive: boolean = this.props.value === iconName;
    return (
      <div
        key={iconName}
        onClickCapture={this.handleClick(iconName)}
        className={`${style.iconButton} ${isActive ? style.active : {}}`}>
        <i className={style[iconName]} />
      </div>
    );
  };

  public render() {
    return (
      <React.Fragment>
        <div className={style.inputIconWrapper}>
          <Button onClick={this.handleOpen} type="primary">
            {this.props.value ? 'Cambiar icono' : 'Seleccionar icono'}
          </Button>
          {this.props.value && <CategoryIcon iconName={this.props.value} />}
        </div>
        <Modal
          title="Seleccione un icono para la categoria"
          visible={this.state.open}
          onCancel={this.handleClose}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleClose}>
              Aceptar
            </Button>,
          ]}>
          <div className={style.iconWrapper}>
            <div
              className={`${style.demoIcon} ${style.iconContainer}`}
              id="icons">
              {icons.map((icon) => this.renderIconButton(icon))}
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default CategoryIcons;
