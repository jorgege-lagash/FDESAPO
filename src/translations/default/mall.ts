export default {
  label: {
    name: {
      id: 'mall.label.name',
      defaultMessage: 'Nombre',
    },
    description: {
      id: 'mall.label.description',
      defaultMessage: 'Descripción',
    },
    buildingId: {
      id: 'mall.label.buildingId',
      defaultMessage: 'ID de edificio',
    },
    stringId: {
      id: 'mall.label.stringId',
      defaultMessage: 'Código de edificio',
    },
    information: {
      id: 'mall.label.information',
      defaultMessage: 'Informacion',
    },
    timezone: {
      id: 'mall.label.timezone',
      defaultMessage: 'Zona Horaria',
    },
  },
  validation: {
    name: {
      required: {
        id: 'mall.validation.name.required',
        defaultMessage: 'por favor digite un nombre de mall',
      },
    },
    buildingId: {
      required: {
        id: 'mall.validation.buildingId.required',
        defaultMessage: 'Escriba el id externo del edificio.',
      },
      integer: {
        id: 'mall.validation.buildingId.integer',
        defaultMessage: 'Debe ser numérico.',
      },
    },
    stringId: {
      required: {
        id: 'mall.validation.stringId.required',
        defaultMessage: 'Escriba el Código del edificio.',
      },
      length: {
        id: 'mall.validation.stringId.length',
        defaultMessage: 'El Código debe ser de 3 caracteres.',
      },
    },
  },
  placeholder: {
    name: {
      id: 'mall.placeholder.name',
      defaultMessage: 'Nombre de Mall',
    },
    description: {
      id: 'mall.placeholder.description',
      defaultMessage: 'Descripción del Mall',
    },
    stringId: {
      id: 'mall.placeholder.stringId',
      defaultMessage: 'Código de edificio.',
    },
  },
};
