import { Layout } from 'antd';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import * as React from 'react';
import mobileLogo from '../assets/logo.png';
import logo from '../assets/parauco-main-logo.svg';
import Header from '../components/Header';
import SiderMenu from '../components/SiderMenu';

const { Content } = Layout;
interface BasicLayoutState {
  collapsed: boolean;
  isMobile: boolean;
}
export class BasicLayout extends React.Component<{}, BasicLayoutState> {
  public state = {
    collapsed: false,
    isMobile: false,
  };

  private enquireHandler: any;

  public toggle = () => {
    this.handleMenuCollapse(!this.state.collapsed);
  };

  public componentDidMount() {
    this.enquireHandler = enquireScreen((mobile) => {
      const { isMobile } = this.state;
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile,
          collapsed: mobile,
        });
      }
    });
  }

  public componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }
  public handleMenuCollapse = (collapsed: boolean) => {
    this.setState({
      collapsed,
    });
  };

  public render() {
    const { isMobile, collapsed } = this.state;
    return (
      <Layout
        style={{
          minHeight: '100vh',
        }}>
        <SiderMenu
          onCollapse={this.handleMenuCollapse}
          collapsed={collapsed}
          logo={logo}
          isMobile={isMobile}
        />
        <Layout>
          <Header
            collapsed={collapsed}
            mobileLogo={mobileLogo}
            isMobile={isMobile}
            toggle={this.toggle}
          />
          <Content
            style={{
              // background: '#fff',
              margin: '24px 16px',
              minHeight: 280,
              // padding: 24,
            }}>
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}
