import {
  createGetById,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { PO_LINES_API } from '../../../../src/common/constants';

const SCHEMA_NAME = 'lines';

export const configLines = server => {
  server.get(`${PO_LINES_API}/:id`, createGetById(SCHEMA_NAME));
  server.get(PO_LINES_API, () => ({ poLines: [] }));
};

export default configLines;
