import React from 'react';

import { LocaleProvider } from 'antd';
import esES from 'antd/lib/locale-provider/es_ES';
import { History } from 'history';
import { set } from 'lodash';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import { APPCONFIG } from './constants/config';
import { PermissionContext } from './layouts/PermissionContext';
import { ApplicationState } from './reducers';
import AppRoutes from './routes/AppRoutes';
import translationMessages from './translations';
import { MallPermission } from './types/response/MallPermission';

const defaultLocale: string = `${APPCONFIG.env.defaultLocale}` || 'es';

interface OwnProps {
  initialHistory: History;
}
interface StateProps {
  lang: string;
  permissions: any;
}

interface OwnState {
  permissions: any;
  setPermissions: (permissions: any) => void;
}
export type Props = OwnProps & StateProps;
class App extends React.Component<Props, OwnState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      permissions: props.permissions || {},
      setPermissions: this.setPermissions,
    };
  }
  public componentDidUpdate(prevProps: Props) {
    if (prevProps.permissions !== this.props.permissions) {
      this.state.setPermissions(this.props.permissions);
    }
  }
  public setPermissions = (permissionsObject: any = {}) => {
    const permissions: any = Object.keys(permissionsObject)
      .reduce<MallPermission[]>((acc, key) => {
        return [...acc, permissionsObject[key]];
      }, [])
      .reduce((acc, curr) => {
        return set(acc, curr.name, true);
      }, {});
    this.setState({
      permissions,
    });
  };

  public render() {
    const { lang, initialHistory } = this.props;
    return (
      <PermissionContext.Provider value={this.state}>
        <LocaleProvider locale={esES}>
          <IntlProvider
            locale={lang}
            defaultLocale={defaultLocale}
            messages={translationMessages[lang]}>
            <AppRoutes initialHistory={initialHistory} />
          </IntlProvider>
        </LocaleProvider>
      </PermissionContext.Provider>
    );
  }
}

const mapStateToProps = (state: ApplicationState): StateProps => {
  return {
    lang: state.locale.lang,
    permissions: state.entities.permissions,
  };
};

export default connect<StateProps>(mapStateToProps)(App);
