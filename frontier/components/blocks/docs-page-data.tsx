import {
  EKind,
  type TDocsDataAdditionalData,
  type TDocsDataData,
} from '@/types';
import Section from './section';
import LinkList from './link-list';
import { getCanShowConstructor } from '@/utils/is';

export type TDocsPageDataProps = {
  data: TDocsDataData;
  additional: TDocsDataAdditionalData;
};

export default function DocsPageData(props: TDocsPageDataProps) {
  const { data, additional } = props;

  // console.log('Classes', data.ancestors, data.kind);

  const canShowConstructor = getCanShowConstructor(data);

  return (
    <div>
      <Section
        id={canShowConstructor ? 'constructor' : ''}
        heading={canShowConstructor ? 'Constructor' : ''}
        data={[data]}
      />
      {data.kind === EKind.Module && data.description}
      <LinkList heading="Extends" id="extends" linkList={data.augments} />
      <LinkList heading="Classes" id="classes" linkList={additional.classes} />
      <LinkList
        heading="Interfaces"
        id="interfaces"
        linkList={additional.interfaces}
      />
      <LinkList heading="Mixins" id="mixins" linkList={additional.mixins} />
      <LinkList
        heading="Namespaces"
        id="namespaces"
        linkList={additional.namespaces}
      />
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
