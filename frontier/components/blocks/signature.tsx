'use client';
import { ptMono } from '@/app/fonts';
import { EKind, type TDocsDataData } from '@/types';
import React from 'react';
import Heading from './heading';

export type TSignatureProps = {
  data: TDocsDataData;
};

export default function Signature(props: TSignatureProps) {
  const {
    data: { name, signature, kind },
  } = props;

  const _signature = {
    fn: { name, params: [], ...signature?.fn },
    ...signature,
  };

  const { fn, attribs, returnTypes } = _signature;

  return (
    <Heading Component="h4" className="my-4">
      <span className={ptMono.className}>
        {(kind === EKind.Class ? 'new ' : '') + fn.name}(
        {fn.params.map((param) => param.name).join(',')})
      </span>
    </Heading>
  );
}
