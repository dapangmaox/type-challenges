// ============= Test Cases =============
import type { Equal, Expect } from './test-utils';

type cases = [
  Expect<Equal<Without<[1, 2], 1>, [2]>>,
  Expect<Equal<Without<[1, 2, 4, 1, 5], [1, 2]>, [4, 5]>>,
  Expect<Equal<Without<[2, 3, 2, 3, 2, 3, 2, 3], [2, 3]>, []>>
];

// ============= Your Code Here =============
type Without<T, U, R extends any[] = []> = T extends [
  infer First,
  ...infer Rest
]
  ? First extends (U extends any[] ? U[number] : U)
    ? Without<Rest, U, R>
    : Without<Rest, U, [...R, First]>
  : R;
