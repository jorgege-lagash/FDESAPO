import { Button } from 'antd';
import classNames from 'classnames';
import * as React from 'react';
import { createElement, PureComponent } from 'react';
import * as styles from './Exception.less';
import config from './typeConfig';

interface ExceptionProps {
  className?: string;
  backText: string;
  linkElement?: string;
  type: string;
  title?: string;
  desc?: string;
  img?: string;
  actions?: string;
  redirect?: string;
}

const defaultProps = {
  backText: 'Volver a inicio',
  redirect: '/',
};
class Exception extends PureComponent<ExceptionProps> {
  // tslint:disable-next-line:no-unused-variable
  private static defaultProps = defaultProps;

  constructor(props: ExceptionProps) {
    super(props);
    this.state = {};
  }

  public render() {
    const {
      className,
      backText,
      linkElement = 'a',
      type,
      title,
      desc,
      img,
      actions,
      redirect,
      ...rest
    } = this.props;
    const pageType = type in config ? type : '404';
    const clsString = classNames(styles.exception, className);
    return (
      <div className={clsString} {...rest}>
        <div className={styles.imgBlock}>
          <div
            className={styles.imgEle}
            style={{ backgroundImage: `url(${img || config[pageType].img})` }}
          />
        </div>
        <div className={styles.content}>
          <h1>{title || config[pageType].title}</h1>
          <div className={styles.desc}>{desc || config[pageType].desc}</div>
          <div className={styles.actions}>
            {actions ||
              createElement(
                linkElement,
                {
                  href: redirect,
                  to: redirect,
                },
                <Button type="primary">{backText}</Button>
              )}
          </div>
        </div>
      </div>
    );
  }
}

export default Exception;
