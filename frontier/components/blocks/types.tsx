import React from 'react';
import Link from 'next/link';

import { type TParamsEntityType } from '@/types';

export type TTypesProps = {
  type: TParamsEntityType;
};

export default function Types(props: TTypesProps) {
  const {
    type: { names },
  } = props;

  if (names.length === 0) return null;

  return names.map((type) => {
    if (type.url) {
      return (
        <Link key={type.url} href={type.url}>
          {type.name}
        </Link>
      );
    }

    return <React.Fragment key={type.name}>{type.name}</React.Fragment>;
  });
}
