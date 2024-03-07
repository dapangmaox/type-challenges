## 思路

联合类型是满足分配律的，例如有一个联合类型：

```ts
type Uni = 'foo' | 42 | true;
type T<U> = U;
type S = Equal<Uni, T<'foo'> | T<42> | T<true>>; // true
type S1 = Equal<T<Uni>, T<'foo'> | T<42> | T<true>>; // true
```

同理

```ts
type UniFn = ToUnionOfFunction<Uni>; // ((x: 'foo') => any) | ((x: 42) => any) | ((x: true) => any)
```

因为函数的参数在逆变位置上，而根据 ts 规范，在逆变位置上，同一个类型的多个候选会被推断成交叉类型，所以

```ts
type Bool = Equal<UnionToIntersection<Uni>, 'foo' & 42 & true>; // true
```
