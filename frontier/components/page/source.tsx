import SourceCode from '../blocks/source-code';

export type TSourcePageProps = {
  data: {
    code: string;
    title: string;
    outPath: string;
  };
};

export default function SourcePage(props: TSourcePageProps) {
  const {
    data: { code },
  } = props;

  return (
    <div>
      <SourceCode code={code} />
    </div>
  );
}
