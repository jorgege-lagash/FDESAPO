import React from 'react';
import { LoadingComponentProps } from 'react-loadable';

export const LoadingComponent: React.SFC<LoadingComponentProps> = () => {
  const style: any = {
    position: 'absolute',
    top: '50%',
    right: '50%',
    transform: 'translate(-50%, -50%)',
  };
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div style={style}>
        {' '}
        Por favor espere <br /> cargando contenido...{' '}
      </div>
    </div>
  );
};
