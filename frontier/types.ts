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

export type TDocsMeta = {
  range: number[];
  filename: string;
  lineno: number;
  columnno: number;
  path: string;
  code: TDocsCode;
  shortpath: string;
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
  augments: string[];
  name: string;
  longname: string;
  scope: string;
  params: TParamsEntity[];
  attribs: string;
  id: string;
  signature: {
    fn: { name: string; params: TParamsEntity[] };
    returnTypes: string[];
    attribs: string[];
  };
  ancestors: string[];
  hideconstructor?: boolean;
  summary?: string;
  description?: string;
  see?: string[];
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

export type TParamsEntityType = {
  names: { name: string; url?: string }[];
};

export type TParamsEntity = {
  type: TParamsEntityType;
  description: string;
  name: string;
};

export type TMethodEntity = {
  comment: string;
  meta: TEntityMetadata;
  description: string;
  params?: TParamsEntity[];
  see?: string[] | null;
  name: string;
  longname: string;
  kind: EKind;
  memberof: string;
  scope: string;
  attribs: string;
  id: string;
  signature: string;
  ancestors?: string[] | null;
  overrides?: string | null;
};

export type TClassEntity = any[];
export type TInterfaceEntity = any[];
export type TMixinEntity = any[];
export type TNamespaceEntity = any[];
export type TMemberEntity = any[];
export type TTypedefEntity = any[];
export type TEventEntity = any[];

export interface TDocsDataAdditionalData {
  classes: TClassEntity[];
  interfaces: TInterfaceEntity[];
  mixins: TMixinEntity[];
  namespaces: TNamespaceEntity[];
  members: TMemberEntity[];
  methods: TMethodEntity[];
  typedefs: TTypedefEntity[];
  events: TEventEntity[];
}

export type TDocsData = {
  data: TDocsDataData;
  additional: TDocsDataAdditionalData;
};
