import { TDocsDataData } from '@/types';
import SectionHeading from './section-heading';
import Link from 'next/link';

export type TAugmentsProps = {
  augments: TDocsDataData['augments'];
  heading: string;
  id: string;
};

export default function Augments(props: TAugmentsProps) {
  const { heading, id, augments } = props;

  if (!Array.isArray(augments) || augments.length === 0) return null;

  return (
    <div>
      <SectionHeading id={id}>{heading}</SectionHeading>
      <ul>
        {augments.map((augment) => (
          <li key={augment.url}>
            <Link href={augment.url}>{augment.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
