import Heading, { THeadingProps } from './heading';

export type TSectionHeadingProps = THeadingProps;

export default function SectionHeading(props: TSectionHeadingProps) {
  return <Heading Component="h3" className="my-4" {...props} />;
}
