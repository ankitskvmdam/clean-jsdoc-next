import { type TParamsEntityType } from '@/types';

export type TTypesProps = {
  type: TParamsEntityType;
};

export default function Types(props: TTypesProps) {
  const {
    type: { names },
  } = props;

  if (names.length === 0) return null;

  return names;
}
