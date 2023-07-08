import { type TParamsEntityType } from '@/types';

export type TTypesProps = {
  type: TParamsEntityType;
};

export default function Types(props: TTypesProps) {
  const {
    type: { names },
  } = props;

  return names.map((name, idx) => (
    <>
      <div key={idx} className="inline-block">
        {name}
      </div>
      {idx !== names.length - 1 && (
        <>
          <br />
          |&nbsp;
        </>
      )}
    </>
  ));
}
