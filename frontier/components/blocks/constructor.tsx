import Signature from './signature';

import { EKind, type TDocsDataData } from '@/types';
import SectionHeading from './section-heading';
import Parameter from './parameter';
import Details from './details';

export type TConstructorProps = {
  data: TDocsDataData;
};

export default function Constructor(props: TConstructorProps) {
  const { data } = props;

  if (data.kind === EKind.Module || data.hideconstructor) return null;

  return (
    <div>
      <SectionHeading id="constructor">Constructor</SectionHeading>
      <Signature data={data} />
      <div>{data.summary}</div>
      <div>{data.description}</div>
      <Parameter data={data} />
      <Details data={data} />
    </div>
  );
}
