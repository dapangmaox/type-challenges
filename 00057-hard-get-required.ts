// ============= Test Cases =============
import type { Equal, Expect } from './test-utils';

type cases = [
  Expect<Equal<GetRequired<{ foo: number; bar?: string }>, { foo: number }>>,
  Expect<
    Equal<GetRequired<{ foo: undefined; bar?: undefined }>, { foo: undefined }>
  >
];

// ============= Your Code Here =============
// 先去掉某个属性，得到一个新类型。然后 extends 原来的类型，看是不是满足条件。
// 为 true 的话，说明去掉的属性，是 optional 的，否则是必需的
type GetRequired<T> = {
  [P in keyof T as Omit<T, P> extends T ? never : P]: T[P];
};

// Omit<T, P> extends 还有别的写法，比如 T[P] extends Required<T>[P]
