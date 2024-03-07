// ============= Test Cases =============
import type { Equal, Expect } from './test-utils';

type cases = [
  Expect<Equal<ToNumber<'0'>, 0>>,
  Expect<Equal<ToNumber<'5'>, 5>>,
  Expect<Equal<ToNumber<'12'>, 12>>,
  Expect<Equal<ToNumber<'27'>, 27>>,
  Expect<Equal<ToNumber<'18@7_$%'>, never>>
];

// ============= Your Code Here =============

// 思路：直接判断字符串是不是数字
type ToNumber<S extends string> = S extends `${infer N extends number}`
  ? N
  : never;

// 思路1: 使用递归，创建一个空数组，每次长度加一。终止条件：数组长度等于字符串里的数字长度
// 但是无法判断有非数字字符存在的 case
// type ToNumber<
//   S extends string,
//   T extends any[] = []
// > = S extends `${T['length']}` ? T['length'] : ToNumber<S, [...T, '']>;
