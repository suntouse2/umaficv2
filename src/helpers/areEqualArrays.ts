import { areEqualStringsArray } from '@helpers/areEqualStringsArray';

export function areEqualArrays(a1: string[] | undefined, a2: string[] | undefined): boolean {
  if (a1 === a2) return true;
  if (a1 == null || a2 == null) return false;
  if (a1.length !== a2.length) return false;
  if (!areEqualStringsArray(a1, a2)) return false;
  return true;
}
