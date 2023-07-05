import type { TDocsDataAdditionalData, TDocsDataData } from '@/types';
import Constructor from './constructor';
import Section from './section';

export type TDocsPageDataProps = {
  data: TDocsDataData;
  additional: TDocsDataAdditionalData;
};

export default function DocsPageData(props: TDocsPageDataProps) {
  const { data, additional } = props;

  return (
    <div>
      <Constructor data={data} />
      <Section data={additional.methods} id="methods" heading="Methods" />
    </div>
  );
}
