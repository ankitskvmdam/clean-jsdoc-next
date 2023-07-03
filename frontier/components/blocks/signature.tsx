'use client';
import { ptMono } from '@/app/fonts';
import { EKind, type TDocsDataData } from '@/types';
import React from 'react';

export type TSignatureProps = {
  data: TDocsDataData;
};

export default function Signature(props: TSignatureProps) {
  const { data } = props;
  const { fn, attribs, returnTypes } = data.signature;

  return (
    <span className={ptMono.className}>
      {(data.kind === EKind.Class ? 'new ' : '') + fn.name}(
      {fn.params.map((param) => param.name).join(',')})
    </span>
  );
}
