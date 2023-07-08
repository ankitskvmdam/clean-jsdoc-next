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

export type TURLObj = {
  prefix: string;
  suffix: string;
  url: string;
  linkText: string;
};

export type TParamsEntityType = {
  names: string[];
};

export type TParamsEntity = {
  type: TParamsEntityType;
  description?: string;
  name?: string;
  attrib?: string[];
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

export type TNameOrUrl = {
  id: string;
  nameOrUrl: string;
};

export type TDocsDataData = {
  comment: string;
  meta: TDocsMeta;
  classdesc: string;
  alias: string;
  kind: EKind;
  augments: TNameOrUrl[];
  name: string;
  longname: string;
  scope: string;
  params: TParamsEntity[];
  attribs: string;
  id: string;
  examples?: { caption: string; code: string; id: string }[];
  signature: string[];
  ancestors: string[];
  hideconstructor?: boolean;
  summary?: string;
  description?: string;
  see?: TNameOrUrl[];
  version?: string;
  since?: string;
  todo?: string[];
  mixes?: string[];
  author?: string[];
  license?: string;
  deprecated?: boolean;
  copyright?: string;
  defaultvalue?: string;
  inherits?: TNameOrUrl[];
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

export type TDocsNameAndSummary = TNameOrUrl & {
  summary: string;
};

export interface TDocsDataAdditionalData {
  classes: TDocsNameAndSummary[];
  interfaces: TDocsNameAndSummary[];
  mixins: TDocsNameAndSummary[];
  namespaces: TDocsNameAndSummary[];
  members: TDocsDataData[];
  methods: TDocsDataData[];
  typedefs: TDocsDataData[];
  events: TDocsDataData[];
}

export type TDocsData = {
  data: TDocsDataData;
  additional: TDocsDataAdditionalData;
};
