import RenderHTML from './render-html';

import { type TDocsDataData } from '@/types';
import Types from './types';

export type TParameterProps = Omit<
  React.HTMLProps<HTMLTableElement>,
  'data'
> & {
  data: TDocsDataData;
};

enum Columns {
  name = 'name',
  type = 'type',
  attributes = 'attributes',
  default = 'default',
  description = 'description',
}

type ColumnsObject = Partial<Record<Columns, string>>;

function getColumnsToShow(params: TDocsDataData['params']): ColumnsObject {
  const keys: string[] = [];

  for (const param of params) {
    keys.push(...Object.keys(param));
  }

  const columns: ColumnsObject = {};

  for (const key of keys) {
    switch (key) {
      case 'name':
        columns['name'] = 'Name';
        break;
      case 'type':
        columns['type'] = 'Type';
        break;
      case 'defaultvalue':
        columns['default'] = 'Default';
        break;
      case 'description':
        columns['description'] = 'Description';
        break;
      case 'optional':
      case 'nullable':
      case 'variable':
        columns['attributes'] = 'Attributes';
        break;
    }
  }

  return columns;
}

export default function Parameter(props: TParameterProps) {
  const {
    data: { params },
    ...rest
  } = props;

  if (params.length === 0) return null;

  const columns = getColumnsToShow(params);

  return (
    <table {...rest}>
      <caption>Parameters</caption>
      <thead>
        {columns.name && <th>Name</th>}
        {columns.type && <th>Type</th>}
        {columns.attributes && <th>Attributes</th>}
        {columns.default && <th>Default</th>}
        {columns.description && <th>Description</th>}
      </thead>
      <tbody>
        {params.map((param) => (
          <tr key={param.name}>
            {columns.name && (
              <td>
                <RenderHTML>{param.name}</RenderHTML>
              </td>
            )}
            {columns.type && (
              <td>
                <Types type={param.type} />
              </td>
            )}
            {columns.attributes && <td>Attribute</td>}
            {columns.default && <td>Default</td>}
            {columns.description && (
              <td>
                <RenderHTML>{param.description}</RenderHTML>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
