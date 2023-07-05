export enum EKind {
  Class = 'class',
  Module = 'module',
  Namespace = 'namespace',
  Interface = 'interface',
  Mixin = 'mixin',
  External = 'external',
  Function = 'function',
  Members = 'members',
  Typedef = 'typedef',
  Event = 'event',
}

export type TNameURL = {
  name: string;
  url?: string;
};

export type TParamsEntityType = {
  names: TNameURL[];
};

export type TParamsEntity = {
  type: TParamsEntityType;
  description?: string;
  name?: string;
};

export type TDocsMeta = {
  range: number[];
  filename: string;
  lineno: number;
  columnno: number;
  path: string;
  code: TDocsCode;
  sourceOutFile: string;
  displayName: string;
};

export type TDocsCode = {
  id: string;
  name: string;
  type: string;
  value: string;
};

export type TDocsDataData = {
  comment: string;
  meta: TDocsMeta;
  classdesc: string;
  alias: string;
  kind: EKind;
  augments: TNameURL[];
  name: string;
  longname: string;
  scope: string;
  params: TParamsEntity[];
  attribs: string;
  id: string;
  examples?: { caption: string; code: string; id: string }[];
  signature: {
    fn?: { name?: string; params: TParamsEntity[] };
    returnTypes: string[];
    attribs: string[];
  };
  ancestors: string[];
  hideconstructor?: boolean;
  summary?: string;
  description?: string;
  see?: TNameURL[];
  version?: string;
  since?: string;
  todo?: string[];
  mixes?: string[];
  author?: string[];
  license?: string;
  deprecated?: boolean;
  copyright?: string;
  defaultvalue?: string;
  inherits?: string;
  override?: boolean;
  inherited?: boolean;
  implementations?: string[];
  implements?: string[];
};

export type TEntityCode = {
  id: string;
  name: string;
  type: string;
};

export type TEntityMetadata = {
  range?: number[] | null;
  filename: string;
  lineno: number;
  columnno: number;
  path: string;
  code: TEntityCode;
  vars?: any;
  shortpath: string;
};

export interface TDocsDataAdditionalData {
  classes: TDocsDataData[];
  interfaces: TDocsDataData[];
  mixins: TDocsDataData[];
  namespaces: TDocsDataData[];
  members: TDocsDataData[];
  methods: TDocsDataData[];
  typedefs: TDocsDataData[];
  events: TDocsDataData[];
}

export type TDocsData = {
  data: TDocsDataData;
  additional: TDocsDataAdditionalData;
};
