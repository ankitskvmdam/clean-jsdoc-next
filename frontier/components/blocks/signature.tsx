'use client';
import { ptMono } from '@/app/fonts';
import { EKind, TParamsEntity, type TDocsDataData } from '@/types';
import React from 'react';
import Heading from './heading';

export type TSignatureProps = {
  data: TDocsDataData;
};

export default function Signature(props: TSignatureProps) {
  const {
    data: { name, signature, kind, attribs },
  } = props;

  return (
    <Heading Component="h4" className="my-4">
      <span className={ptMono.className}>
        {attribs}
        {(kind === EKind.Class ? 'new ' : '') + name}
        {signature}
      </span>
    </Heading>
  );
}
