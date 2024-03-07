// ============= Test Cases =============
import type { Equal, Expect } from './test-utils';

type cases = [
  Expect<Equal<GreaterThan<1, 0>, true>>,
  Expect<Equal<GreaterThan<5, 4>, true>>,
  Expect<Equal<GreaterThan<4, 5>, false>>,
  Expect<Equal<GreaterThan<0, 0>, false>>,
  Expect<Equal<GreaterThan<10, 9>, true>>,
  Expect<Equal<GreaterThan<20, 20>, false>>,
  Expect<Equal<GreaterThan<10, 100>, false>>,
  Expect<Equal<GreaterThan<111, 11>, true>>
];

// ============= Your Code Here =============
type Number2Array<
  T extends number,
  U extends any[] = []
> = U['length'] extends T ? U : Number2Array<T, ['', ...U]>;

type GreaterThan<T extends number, U extends number> = Number2Array<U> extends [
  ...Number2Array<T>,
  ...infer _
]
  ? false
  : true;
