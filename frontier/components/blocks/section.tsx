import Signature from './signature';

import { EKind, type TDocsDataData } from '@/types';
import SectionHeading from './section-heading';
import Parameter from './parameter';
import Details from './details';
import Example from './example';

export type SectionProps = {
  data: TDocsDataData[];
  heading: string;
  id: string;
};

export default function Section(props: SectionProps) {
  const { data, heading, id } = props;

  if (data.length === 0) return;

  return (
    <div>
      <SectionHeading id={id}>{heading}</SectionHeading>
      {data.map((datum) => (
        <div key={datum.id}>
          <Signature data={datum} />
          <div>{datum.summary}</div>
          <div>{datum.description}</div>
          <Parameter data={datum} />
          <Details data={datum} />
          <Example examples={datum.examples} />
        </div>
      ))}
    </div>
  );
}
