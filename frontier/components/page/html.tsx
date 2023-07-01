export type T_HTMLPageProps = {
  htmlString: string;
};

export default function HTMLPage(props: T_HTMLPageProps) {
  return <div dangerouslySetInnerHTML={{ __html: props.htmlString }} />;
}
