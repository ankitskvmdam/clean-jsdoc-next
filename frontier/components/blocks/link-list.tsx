import { isValidElement } from 'react';
import SectionHeading from './section-heading';

export type TLinkListProps = {
  linkList: { summary?: string; nameOrUrl: string; id: string }[];
  heading?: string;
  id?: string;
};

export default function LinkList(props: TLinkListProps) {
  const { heading, id, linkList } = props;

  if (!Array.isArray(linkList) || linkList.length === 0) return null;

  return (
    <div>
      {heading && <SectionHeading id={id}>{heading}</SectionHeading>}
      <ul>
        {linkList.map((item) => {
          return (
            <li key={item.id} className="mb-1">
              {item.nameOrUrl}
              {item.summary && <div>{item.summary}</div>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
