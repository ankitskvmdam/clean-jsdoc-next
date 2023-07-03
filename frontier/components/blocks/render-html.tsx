export type TRenderHTMLProps = React.HTMLProps<HTMLParagraphElement>;

export default function RenderHTML(props: TRenderHTMLProps) {
  const { children, ...rest } = props;

  if (!children) return null;

  return (
    <div dangerouslySetInnerHTML={{ __html: children.toString() }} {...rest} />
  );
}
