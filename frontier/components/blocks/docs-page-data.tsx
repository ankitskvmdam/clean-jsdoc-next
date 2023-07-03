import type { TDocsDataData } from '@/types';
import Constructor from './constructor';

export type TDocsPageDataProps = {
  data: TDocsDataData;
};

export default function DocsPageData(props: TDocsPageDataProps) {
  const { data } = props;

  return (
    <div>
      <Constructor data={data} />
    </div>
  );
}
