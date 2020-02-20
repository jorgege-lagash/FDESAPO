import { Dropdown, Icon, Menu } from 'antd';
import classNames from 'classnames';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { actions, SelectLocaleActionCreator } from 'src/actions/locale.action';
import { LanguageContext } from 'src/layouts/LanguageContext';
import { ApplicationState } from 'src/reducers';
import styles from './index.less';

export interface OwnProps {
  className: string;
}

interface StateProps {
  selectedLang: string;
}

interface DispatchProps {
  actions: {
    selectLocale: SelectLocaleActionCreator;
  };
}

type Props = OwnProps & StateProps & DispatchProps;

class SelectLang extends PureComponent<Props> {
  public changLang = ({ key }: any) => {
    this.props.actions.selectLocale(key);
  };

  public render() {
    const { className, selectedLang } = this.props;
    const langMenu = (
      <LanguageContext.Provider value={{ language: selectedLang }}>
        <Menu
          className={styles.menu}
          selectedKeys={[selectedLang]}
          onClick={this.changLang}>
          <Menu.Item key="es">
            <span role="img" aria-label="Espanol">
              Es
            </span>{' '}
            Espanol
          </Menu.Item>
          <Menu.Item key="en">
            <span role="img" aria-label="English">
              En
            </span>{' '}
            English
          </Menu.Item>
          <Menu.Item key="pt">
            <span role="img" aria-label="Português">
              🇵🇹
            </span>{' '}
            Português
          </Menu.Item>
        </Menu>
      </LanguageContext.Provider>
    );
    return (
      <Dropdown overlay={langMenu} placement="bottomRight">
        <Icon
          type="global"
          className={classNames(styles.dropDown, className)}
          title={'Idioma'}
        />
      </Dropdown>
    );
  }
}

function mapStateToProps(state: ApplicationState): StateProps {
  return {
    selectedLang: state.locale.lang,
  };
}
function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  const { selectLocale } = actions;
  return {
    actions: bindActionCreators({ selectLocale }, dispatch),
  };
}

export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(SelectLang);
