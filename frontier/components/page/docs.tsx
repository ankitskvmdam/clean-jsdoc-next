export type Meta = {
  range?: number[] | null;
  filename: string;
  lineno: number;
  columnno: number;
  path: string;
  code: Code;
  shortpath: string;
};

export type Code = {
  id: string;
  name: string;
  type: string;
  value: string;
};

export type TPageData = {
  comment: string;
  meta: Meta;
  classdesc: string;
  alias: string;
  kind: string;
  augments?: string[] | null;
  name: string;
  longname: string;
  scope: string;
  params?: null[] | null;
  attribs: string;
  id: string;
  signature: string;
  ancestors?: null[] | null;
};

export type TDocsPageProps = {
  data: TPageData;
};

export default function DocsPage(props: TDocsPageProps) {
  return (
    <div>This is docs page for: {props.data.name || props.data.longname}</div>
  );
}
