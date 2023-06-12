export type TReadmePageProps = {
  htmlString: string;
};

export default function ReadmePage(props: TReadmePageProps) {
  return <div dangerouslySetInnerHTML={{ __html: props.htmlString }} />;
}
