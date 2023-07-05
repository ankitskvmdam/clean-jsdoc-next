import { EKind, type TDocsDataData } from '@/types';
import Section from './section';

export type TConstructorProps = {
  data: TDocsDataData;
};

export default function Constructor(props: TConstructorProps) {
  const { data } = props;

  if (!(data.kind === EKind.Class) || !data.classdesc) return null;

  return <Section id="constructor" heading="Constructor" data={[data]} />;
}
