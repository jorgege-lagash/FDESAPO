import * as React from 'react';
import Exception from '../../components/Exception/Exception';

const Exception403 = () => (
  <Exception
    type="403"
    desc={'Lo sentimos, usted no tiene acceso a esta pagina'}
    // linkElement={Link}
    backText={'Volver a inicio'}
  />
);

export default Exception403;
