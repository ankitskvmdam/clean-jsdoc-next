export type TSourcePageProps = {
  data: {
    code: string;
    title: string;
    outPath: string;
  };
};

export default function SourcePage(props: TSourcePageProps) {
  const {
    data: { code, title },
  } = props;

  return (
    <div>
      {title}
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
