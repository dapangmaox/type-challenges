// ============= Test Cases =============
import type { Equal, Expect } from './test-utils';

type cases = [
  Expect<Equal<CapitalizeWords<'foobar'>, 'Foobar'>>,
  Expect<Equal<CapitalizeWords<'FOOBAR'>, 'FOOBAR'>>,
  Expect<Equal<CapitalizeWords<'foo bar'>, 'Foo Bar'>>,
  Expect<Equal<CapitalizeWords<'foo bar hello world'>, 'Foo Bar Hello World'>>,
  Expect<Equal<CapitalizeWords<'foo bar.hello,world'>, 'Foo Bar.Hello,World'>>,
  Expect<
    Equal<
      CapitalizeWords<'aa!bb@cc#dd$ee%ff^gg&hh*ii(jj)kk_ll+mm{nn}oo|pp🤣qq'>,
      'Aa!Bb@Cc#Dd$Ee%Ff^Gg&Hh*Ii(Jj)Kk_Ll+Mm{Nn}Oo|Pp🤣Qq'
    >
  >,
  Expect<Equal<CapitalizeWords<''>, ''>>
];

// ============= Your Code Here =============

// 思路：判断第一个字符是不是字母，是的话暂存到 Word，直到第一个字符不是字母，把 Word 的第一个字符大写；重新操作，直到取完字符串

type CapitalizeWords<
  S extends string,
  Word extends string = ''
> = S extends `${infer First}${infer Rest}`
  ? Uppercase<First> extends Lowercase<First>
    ? `${Capitalize<Word>}${First}${CapitalizeWords<Rest>}`
    : CapitalizeWords<Rest, `${Word}${First}`>
  : Capitalize<Word>;
