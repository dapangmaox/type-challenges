// ============= Test Cases =============
import type { Equal, Expect } from './test-utils';

type cases = [
  Expect<Equal<LastIndexOf<[1, 2, 3, 2, 1], 2>, 3>>,
  Expect<Equal<LastIndexOf<[2, 6, 3, 8, 4, 1, 7, 3, 9], 3>, 7>>,
  Expect<Equal<LastIndexOf<[0, 0, 0], 2>, -1>>,
  Expect<Equal<LastIndexOf<[string, 2, number, 'a', number, 1], number>, 4>>,
  Expect<Equal<LastIndexOf<[string, any, 1, number, 'a', any, 1], any>, 5>>
];

// ============= Your Code Here =============

type IsEqual<T, U> = T extends U ? (U extends T ? true : false) : false;

type LastIndexOf<T extends any[], U, Index extends any[] = T> = T extends [
  ...infer Left,
  infer Last
]
  ? IsEqual<Last, U> extends true
    ? Left['length']
    : LastIndexOf<Left, U, Left>
  : -1;

type T1 = LastIndexOf<[1, 2, 3, 2, 1], 2>;

// 从后往前遍历，如果当前元素等于目标元素，那么前面的元素的长度就是当前元素的索引。
