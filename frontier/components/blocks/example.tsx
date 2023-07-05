import { TDocsDataData } from '@/types';
import Code from './code';

export type TExampleProps = {
  examples: TDocsDataData['examples'];
};

export default function Example(props: TExampleProps) {
  const { examples } = props;

  if (!Array.isArray(examples) || examples.length === 0) return null;

  return (
    <div>
      <div className="text-xs uppercase font-bold py-2">Example</div>
      {examples.map((example) => (
        <div key={example.id}>
          <p>{example.caption}</p>
          <Code code={example.code} />
        </div>
      ))}
    </div>
  );
}
