import { EKind, TDocsDataData } from '@/types';

export function getCanShowConstructor(data: TDocsDataData) {
  if (typeof data !== 'object') return false;

  if (data.kind === EKind.Class && data.classdesc) return true;
  return false;
}
