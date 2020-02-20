import * as React from 'react';
import Exception from '../../components/Exception/Exception';

const Exception404 = () => (
  <Exception
    type="404"
    desc={'Lo sentimos, la pagina que usted visito no existe'}
    // linkElement={Link}
    backText={'Volver a inicio'}
  />
);

export default Exception404;
