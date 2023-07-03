import RenderHTML from '../blocks/render-html';
import DocsPageData from '../blocks/docs-page-data';
import Heading from '../blocks/heading';
import type { TDocsData } from '@/types';
import Signature from '../blocks/signature';

export type TDocsPageProps = {
  data: TDocsData;
};

export default function DocsPage(props: TDocsPageProps) {
  const { data, additional } = props.data;
  const { name, longname, classdesc } = data;

  const pageName = name ? name : longname;

  return (
    <div>
      <Heading Component="h1">{pageName}</Heading>
      <RenderHTML className="text-base mt-6">{classdesc}</RenderHTML>
      <DocsPageData data={data} />
    </div>
  );
}
