import type { TDocsDataAdditionalData, TDocsDataData } from '@/types';
import Constructor from './constructor';
import Section from './section';
import Augments from './augments';

export type TDocsPageDataProps = {
  data: TDocsDataData;
  additional: TDocsDataAdditionalData;
};

export default function DocsPageData(props: TDocsPageDataProps) {
  const { data, additional } = props;

  return (
    <div>
      <Constructor data={data} />
      <Augments heading="Extends" id="extends" augments={data.augments} />
      <Section data={additional.members} id="members" heading="Members" />
      <Section data={additional.methods} id="methods" heading="Methods" />
      <Section
        data={additional.typedefs}
        id="typedef"
        heading="Type Definitions"
      />
      <Section data={additional.events} id="events" heading="Events" />
    </div>
  );
}
