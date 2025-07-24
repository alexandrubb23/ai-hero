The Future Of TypeScript

---

The Future Of TypeScript Is In The Browser

---

The Future Of TypeScript Is In The Browser
(why I don't like enums)

---

Why I Don't Like Enums

```ts
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}
```

---

Enums Are A TypeScript-Only Feature

```ts
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}
```

```js
var LogLevel;
(function (LogLevel) {
  LogLevel[(LogLevel["DEBUG"] = 0)] = "DEBUG";
  LogLevel[(LogLevel["INFO"] = 1)] = "INFO";
  LogLevel[(LogLevel["WARN"] = 2)] = "WARN";
  LogLevel[(LogLevel["ERROR"] = 3)] = "ERROR";
})(LogLevel || (LogLevel = {}));
```

---

Namespaces Are A TypeScript-Only Feature

```ts
export namespace Math {
  export const add = (a: number, b: number) => a + b;
}
```

```js
export var Math;
(function (Math) {
  Math.add = (a, b) => a + b;
})(Math || (Math = {}));
```

---

Class Parameter Properties Are A TypeScript-Only Feature

```ts
class Square {
  constructor(
    public height: number,
    public width: number,
  ) {}
}
```

---

Class Parameter Properties Are A TypeScript-Only Feature

```ts
class Square {
  constructor(
    public height: number,
    public width: number,
  ) {}
}
```

```js
class Square {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
}
```

---

TypeScript Is A Fork Of JavaScript

---

We can't run TypeScript in the browser

---

Source maps

<!-- Show links between DEBUG and DEBUG -->

```ts
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}
```

```js
var LogLevel;
(function (LogLevel) {
  LogLevel[(LogLevel["DEBUG"] = 0)] = "DEBUG";
  LogLevel[(LogLevel["INFO"] = 1)] = "INFO";
  LogLevel[(LogLevel["WARN"] = 2)] = "WARN";
  LogLevel[(LogLevel["ERROR"] = 3)] = "ERROR";
})(LogLevel || (LogLevel = {}));
```

---

Source maps

```js
// example.js

var LogLevel;
(function (LogLevel) {
  LogLevel[(LogLevel["DEBUG"] = 0)] = "DEBUG";
  LogLevel[(LogLevel["INFO"] = 1)] = "INFO";
  LogLevel[(LogLevel["WARN"] = 2)] = "WARN";
  LogLevel[(LogLevel["ERROR"] = 3)] = "ERROR";
})(LogLevel || (LogLevel = {}));
//# sourceMappingURL=example.js.map
```

```json
// example.js.map

{
  "version": 3,
  "file": "example.js",
  "sourceRoot": "",
  "sources": ["example.ts"],
  "names": [],
  "mappings": "AAAA,IAAK,QAKJ;AALD,WAAK,QAAQ;IACX,yCAAS,CAAA;IACT,uCAAQ,CAAA;IACR,uCAAQ,CAAA;IACR,yCAAS,CAAA;AACX,CAAC,EALI,QAAQ,KAAR,QAAQ,QAKZ"
}
```

---

TypeScript Is A Fork Of JavaScript

---

Will It Get Forkier?

---

Will It Get Forkier? No.

---

TC39 Stage 3 -> TypeScript

---

TC39 Stage 3 -> TypeScript

```ts
using fileHandle = getFileHandle();

const contents = await fileHandle.read();
```

---

TypeScript Is A Teeny Fork Of JavaScript

---

"Modern TypeScript"

---

"Modern TypeScript"

- No Enums
- No Namespaces
- No Parameter Properties

---

"Modern TypeScript"

JavaScript With Types

---

Writing Source Maps Is Trivial

```ts
const add = (a: number, b: number) => a + b;
```

```js
// prettier-ignore
const add = (a        , b        ) => a + b;
```

---

"Erasable Syntax"

```ts
const add = (a: number, b: number) => a + b;
```

```js
// prettier-ignore
const add = (a        , b        ) => a + b;
```

---

Bloomberg's `ts-blank-space`

---

Enums Are Not Erasable

```ts
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}
```

```js
var LogLevel;
(function (LogLevel) {
  LogLevel[(LogLevel["DEBUG"] = 0)] = "DEBUG";
  LogLevel[(LogLevel["INFO"] = 1)] = "INFO";
  LogLevel[(LogLevel["WARN"] = 2)] = "WARN";
  LogLevel[(LogLevel["ERROR"] = 3)] = "ERROR";
})(LogLevel || (LogLevel = {}));
```

---

Node 23 Supports TypeScript

---

"[By] supporting syntax that requires code generation we would lose the ability to replace with blank space and therefore not need sourcemaps. [...] the goal was to have a real experience of js + types." - Marco Ippolito

---

What Did The TypeScript Team Think?

---

"Ugh, you're supporting erasable syntax only? Lame"

---

`erasableSyntaxOnly` coming in 5.8

- Errors when enums, namespaces or parameter properties are used

---

The Future Of TypeScript Is "Modern TypeScript"

---

"Modern TypeScript" is still a fork

- .ts files instead of .js files
- Still need to compile to JavaScript

---

How Do We De-Fork TypeScript?

---

"Modern TypeScript"

JavaScript + Types

---

"Runtime types in JavaScript? That'll never happen."

---

"Runtime types in JavaScript? That'll never happen."

CORRECT

---

Types Ignored At Runtime

---

Types Ignored At Runtime

```ts
const add = (a: number, b: number) => a + b;
```

```js
// prettier-ignore
const add = (a        , b        ) => a + b;
```

---

Types As Comments Proposal

- Opens syntactical spaces in JavaScript for types to be added
- Types would be ignored by the engine
- Only "Modern TypeScript" syntax supported

---

Types As Comments Wrinkles

Turbofish Syntax

```ts
const set = new Set<number>();
```

```ts
const set = new Set::<number>();
```

---

Why Isn't Types As Comments In JavaScript Yet?

---

"It's dead in the water" - Gil Tayer

---

Types As Comments Needs A Champion

---

The Status Quo Is Fine (ish)

- We can continue bundling in development
- We can continue generating source maps
- We're always going to need _some_ bundling

---

"Modern TypeScript"

---

"Modern JavaScript"

---

Enums are holding back the future of JavaScript
