对于 TypeScript 类型系统感兴趣的同学，估计都听过 [type-challenges](https://github.com/type-challenges/type-challenges) 项目，俗称类型体操。

本文是 TypeScript 类型体操系列的第二篇：[柯里化-1](https://github.com/type-challenges/type-challenges/tree/main/questions/00017-hard-currying-1)。

## 题目描述

[柯里化](https://en.wikipedia.org/wiki/Currying) 是一种将带有多个参数的函数转换为每个带有一个参数的函数序列的技术。

例如：

```ts
const add = (a: number, b: number) => a + b;
const three = add(1, 2);

const curriedAdd = Currying(add);
const five = curriedAdd(2)(3);
```

传递给 `Currying` 的函数可能有多个参数，您需要正确输入它的类型。

在此挑战中，**柯里化后的函数每次仅接受一个参数**。接受完所有参数后，它应返回其结果。

## 什么是柯里化

首先对这道题感兴趣的同学，大概率知道柯里化是什么，以及用途是什么了，我们简单回顾下。

柯里化是一种关于函数的高阶技术，它不仅被用于 JavaScript，也被用于其他编程语言。

柯里化是一种函数的转换，它是指将一个函数从可调用的 `f(a, b, c)` 转换为可调用的 `f(a)(b)(c)`。

柯里化不会调用函数，它只是对函数进行转换。

来看一下函数版本的实现：

```js
function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}
```

> 如果想详细了解什么是柯里化可以点[这里](https://github.com/javascript-tutorial/zh.javascript.info/blob/master/1-js/99-js-misc/03-currying-partials/article.md)

核心就两点，也就是函数的两个 if 执行分支：

- 如果传入的 `args` 长度与原始函数所定义的`（func.length`）相同或者更长，那么只需要使用 `func.apply` 将调用传递给它即可。
- 否则，获取一个部分应用函数：我们目前还没调用 `func`。取而代之的是，返回另一个包装器 `pass`，它将重新应用 `curried`，将之前传入的参数与新的参数一起传入。

然后，如果我们再次调用它，我们将得到一个新的部分应用函数（如果没有足够的参数），或者最终的结果。

## 解题过程

上面函数版本的柯里化，每次调用可以传入多个参数，但注意我在题目描述中加粗的那句话：**柯里化后的函数每次仅接受一个参数**。这也是为什么这道题叫 `柯里化-1`，因为我们只需要实现简单版本的柯里化。

来看一下测试用例：

```ts
const curried1 = Currying((a: string, b: number, c: boolean) => true);

Equal<typeof curried1, (a: string) => (b: number) => (c: boolean) => true>;
```

根据测试用例和函数版本的柯里化实现，我们就应该有思路了：**使用 `infer` + 递归，每次只柯里化第一个参数**。

首先我们声明一个类型叫 `Curried`，并且给函数加上泛型。

```ts
type Curried<F> = any;

declare function Currying<F>(fn: F): Curried<F>;
```

接下来使用递归，每次柯里化第一个参数。

```ts
type Curried<F> = F extends (...args: infer A) => infer R
  ? A extends [infer First, ...infer Rest]
    ? (arg: First) => Curried<(...args: Rest) => R>
    : R
  : never;

declare function Currying<F>(fn: F): Curried<F>;
```

解释：

- `F extends (...args: infer A) => infer R` 用来拿到函数的参数 `A` 和返回值 `R`。
- `A extends [infer First, ...infer Rest]` 用来判断还有没有参数，有的话取出第一个参数，并且将剩余的参数 `Rest` 和返回值 `R` 组成新的函数；没有参数的话直接返回 `R`。

现在第一个和第二个测试用例都过了，但是第三个用例还是报错。

```ts
const curried3 = Currying(() => true);
Equal<typeof curried3, () => true>;
```

只需要再加一层判断，如果参数长度为 0 或者 1，只需要返回函数 `F`。

所以最终实现为：

```ts
type Curried<F> = F extends (...args: infer A) => infer R
  ? A['length'] extends 0 | 1
    ? F
    : A extends [infer First, ...infer Rest]
    ? (arg: First) => Curried<(...args: Rest) => R>
    : R
  : never;

declare function Currying<F>(fn: F): Curried<F>;
```

到此为止，三个测试用例都通过了。本来以为到这里就结束了。。。

但是。。。

我们来看一下第一个测试用例经过柯里化之后的类型：

![Curried1](/images/00017-hard-currying-1/curried1.png)

可以看到参数都变成了 `arg`，这也是我逛答案区的时候偶然看到的，当前的解决方案会丢失参数名。

### 进阶版

这里直接给出网上进阶版的答案：

```ts
// See https://stackoverflow.com/a/72244704/388951
type FirstAsTuple<T extends any[]> = T extends [any, ...infer R]
  ? T extends [...infer F, ...R]
    ? F
    : never
  : never;

type Curried<F> = F extends (...args: infer Args) => infer Return
  ? Args['length'] extends 0 | 1
    ? F
    : Args extends [any, ...infer Rest]
    ? (...args: FirstAsTuple<Args>) => Curried<(...rest: Rest) => Return>
    : never
  : never;

declare function Currying<T extends Function>(fn: T): Curried<T>;
```

和之前的答案区别在于多了一个 `FirstAsTuple` 类型，用于获取元组的第一个元素。

比如：

![FirstAsTuple](/images/00017-hard-currying-1/FirstAsTuple.png)

这样我们就能在柯里化的同时，保留每个参数的名字。

第一个测试用例柯里化之后的类型就变成了这样：

![Curried2](/images/00017-hard-currying-1/curried2.png)

## 总结

在 TypeScript 类型体操中实现柯里化是一个有趣的挑战，对熟悉柯里化概念的同学这道题应该比较容易。主要通过利用 TypeScript 的条件类型、泛型和递归，可以实现对柯里化的类型定义。

在实现中，保留参数名的问题可以通过额外引入 `FirstAsTuple` 类型来解决。这样，通过柯里化，每个参数的名称都能被正确地保留。
