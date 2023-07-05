export type TCodeProps = {
  code: string;
};

export default function Code(props: TCodeProps) {
  const { code } = props;
  return (
    <pre>
      <code dangerouslySetInnerHTML={{ __html: code }}></code>
    </pre>
  );
}
