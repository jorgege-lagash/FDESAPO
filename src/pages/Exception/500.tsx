import * as React from 'react';
import Exception from '../../components/Exception/Exception';

const Exception500 = () => (
  <Exception
    type="500"
    desc={'Lo sentimos, el servidor esta reportando error'}
    // linkElement={Link}
    backText={'Volver a inicio'}
  />
);

export default Exception500;
