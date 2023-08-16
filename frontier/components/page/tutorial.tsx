import HTMLPage from './html';

export type TTutorialPageProps = {
  title: string;
  header: string;
  content: string;
};

export default function TutorialPage(props: TTutorialPageProps) {
  const { title, header, content } = props;

  return (
    <div>
      {header}
      <HTMLPage htmlString={content} />
    </div>
  );
}
