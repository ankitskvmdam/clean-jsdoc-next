'use client';
import Link from 'next/link';
import Signature from './signature';
import SectionHeading from './section-heading';
import Parameter from './parameter';

import VersionIcon from '@/icons/git-merge-icon.svg';
import InheritanceIcon from '@/icons/git-branch-icon.svg';
import SourceIcon from '@/icons/code-icon.svg';
import SinceIcon from '@/icons/history-icon.svg';
import OverrideIcon from '@/icons/override-icon.svg';
import ImplementIcon from '@/icons/implement-icon.svg';
import MixesIcon from '@/icons/shuffle-icon.svg';
import DeprecatedIcon from '@/icons/error-icon.svg';
import AuthorIcon from '@/icons/user-icon.svg';
import CopyrightIcon from '@/icons/copyright-icon.svg';
import LicenseIcon from '@/icons/badge-icon.svg';
import DefaultIcon from '@/icons/compass-icon.svg';
import TutorialIcon from '@/icons/tutorial-icon.svg';
import SeeIcon from '@/icons/link-icon.svg';
import TodoIcon from '@/icons/todo-icon.svg';

import { EKind, type TDocsDataData } from '@/types';

export type TDetailsProps = {
  data: TDocsDataData;
};

type TDetailsItemProps = React.HTMLProps<HTMLTableCellElement> & {
  icon: any;
  title: string;
};

function DetailsItem(props: TDetailsItemProps) {
  const { icon, title, children, ...rest } = props;

  if (!children) return null;

  return (
    <tr>
      <td className="w-8">
        <div>{icon}</div>
      </td>
      <td className="w-40">
        <div>{title}</div>
      </td>
      <td {...rest}>{children}</td>
    </tr>
  );
}

export default function Details(props: TDetailsProps) {
  const {
    version,
    since,
    inherits,
    inherited,
    override,
    implementations,
    meta,
    see,
  } = props.data;

  return (
    <table className="details">
      <tbody>
        <DetailsItem icon={<VersionIcon />} title="Version">
          {version}
        </DetailsItem>
        <DetailsItem icon={<SinceIcon />} title="Since">
          {since}
        </DetailsItem>

        {inherits && inherited && !override && (
          <DetailsItem icon={<InheritanceIcon />} title="Inherited From">
            {inherits}
          </DetailsItem>
        )}

        {override && (
          <DetailsItem icon={<OverrideIcon />} title="Overrides">
            {override}
          </DetailsItem>
        )}

        {implementations && implementations.length > 0 && (
          <DetailsItem icon={<ImplementIcon />} title="Implementations">
            {implementations}
          </DetailsItem>
        )}

        {props.data.implements && props.data.implements.length > 0 && (
          <DetailsItem icon={<ImplementIcon />} title="Implements">
            {props.data.implements}
          </DetailsItem>
        )}

        {/* <DetailsItem icon={<MixesIcon />} title="Mixes In" />
        <DetailsItem icon={<DeprecatedIcon />} title="Deprecated" />
        <DetailsItem icon={<AuthorIcon />} title="Author" />
        <DetailsItem icon={<CopyrightIcon />} title="Copyright" />
        <DetailsItem icon={<LicenseIcon />} title="License" />
        <DetailsItem icon={<DefaultIcon />} title="Default Value" /> */}

        <DetailsItem icon={<SourceIcon />} title="Source">
          <Link href={`${meta.sourceOutFile}`}>{meta.filename}</Link>,&nbsp;
          <Link href={`${meta.sourceOutFile}#${meta.lineno}`}>
            {meta.lineno}
          </Link>
        </DetailsItem>

        {see && see.length > 0 && (
          <DetailsItem icon={<SeeIcon />} title="See">
            {see.map((link) => (
              <Link href={link} key={link} className="block">
                {link}
              </Link>
            ))}
          </DetailsItem>
        )}
        {/* <DetailsItem icon={<TutorialIcon />} title="Tutorial" />
        <DetailsItem icon={<TodoIcon />} title="To Do" /> */}
      </tbody>
    </table>
  );
}
