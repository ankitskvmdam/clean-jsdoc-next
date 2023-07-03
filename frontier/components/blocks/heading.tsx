'use client';

import clsx from 'clsx';

export type THeadingProps = React.HTMLProps<HTMLHeadingElement> & {
  /**
   * Heading level.
   *
   * @default 'h1'
   */
  Component?: 'h1' | 'h2' | 'h3' | 'h4' | 'h4' | 'h5' | 'h6';
};

function getHeadingClasses(
  component: THeadingProps['Component']
): THeadingProps['className'] {
  switch (component) {
    case 'h1':
      return 'text-4xl font-bold';
    case 'h2':
      return 'text-3xl font-bold';
    case 'h3':
      return 'text-2xl font-bold';
    case 'h4':
      return 'text-xl font-bold';
    case 'h5':
      return 'text-lg font-bold';
    case 'h6':
      return 'text-md font-bold';

    default:
      return '';
  }
}

export default function Heading(props: THeadingProps) {
  const { Component = 'h1', children, className, ...rest } = props;

  return (
    <Component
      className={`${getHeadingClasses(Component)} ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
}
