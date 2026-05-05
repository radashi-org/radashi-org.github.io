Refactor this JavaScript/TypeScript repository by replacing hand-written local helpers with Radashi imports where behavior is compatible.

Primary candidate identifiers are the exact, case-sensitive "name" values in the Radashi export data below. Secondary candidate identifiers are the "aliases" values. The "category" value is context only; verify exact semantics from installed Radashi source/types or official docs before replacing.

Rules:
- Consider local hand-written helper declarations whose identifier exactly matches a candidate name or alias.
- Treat alias matches as lower-confidence candidates; replace them only with strong semantic evidence.
- Compare the local implementation, call sites, public exports, and Radashi semantics.
- Replace only when Radashi preserves observable behavior for current usage and does not change public API shape.
- Preserve exported module paths/names when applicable; prefer replacing the implementation or re-exporting over forcing downstream import changes.
- Use named imports from "radashi". Remove dead local implementation/types made obsolete by the replacement.
- Run relevant lint, typecheck, and tests for touched packages.

Final report:
- replacements made
- noteworthy skipped candidates with reasons
- verification commands and results

Radashi export data (153 entries):

```json
[
  {
    "name": "absoluteJitter",
    "category": "random",
    "aliases": []
  },
  {
    "name": "all",
    "category": "async",
    "aliases": []
  },
  {
    "name": "alphabetical",
    "category": "array",
    "aliases": []
  },
  {
    "name": "always",
    "category": "function",
    "aliases": []
  },
  {
    "name": "assert",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "assign",
    "category": "object",
    "aliases": []
  },
  {
    "name": "boil",
    "category": "array",
    "aliases": []
  },
  {
    "name": "camel",
    "category": "string",
    "aliases": []
  },
  {
    "name": "capitalize",
    "category": "string",
    "aliases": []
  },
  {
    "name": "cartesianProduct",
    "category": "array",
    "aliases": []
  },
  {
    "name": "castArray",
    "category": "array",
    "aliases": []
  },
  {
    "name": "castArrayIfExists",
    "category": "array",
    "aliases": []
  },
  {
    "name": "castComparator",
    "category": "function",
    "aliases": []
  },
  {
    "name": "castMapping",
    "category": "function",
    "aliases": []
  },
  {
    "name": "chain",
    "category": "curry",
    "aliases": []
  },
  {
    "name": "clamp",
    "category": "number",
    "aliases": []
  },
  {
    "name": "clone",
    "category": "object",
    "aliases": []
  },
  {
    "name": "cloneDeep",
    "category": "object",
    "aliases": []
  },
  {
    "name": "cluster",
    "category": "array",
    "aliases": []
  },
  {
    "name": "compose",
    "category": "curry",
    "aliases": []
  },
  {
    "name": "concat",
    "category": "array",
    "aliases": []
  },
  {
    "name": "construct",
    "category": "object",
    "aliases": []
  },
  {
    "name": "counting",
    "category": "array",
    "aliases": []
  },
  {
    "name": "crush",
    "category": "object",
    "aliases": []
  },
  {
    "name": "dash",
    "category": "string",
    "aliases": []
  },
  {
    "name": "debounce",
    "category": "curry",
    "aliases": []
  },
  {
    "name": "deburr",
    "category": "string",
    "aliases": []
  },
  {
    "name": "dedent",
    "category": "string",
    "aliases": []
  },
  {
    "name": "defer",
    "category": "async",
    "aliases": []
  },
  {
    "name": "diff",
    "category": "array",
    "aliases": []
  },
  {
    "name": "draw",
    "category": "random",
    "aliases": []
  },
  {
    "name": "escapeHTML",
    "category": "string",
    "aliases": []
  },
  {
    "name": "filterKey",
    "category": "object",
    "aliases": []
  },
  {
    "name": "first",
    "category": "array",
    "aliases": []
  },
  {
    "name": "flat",
    "category": "array",
    "aliases": []
  },
  {
    "name": "flip",
    "category": "curry",
    "aliases": []
  },
  {
    "name": "fork",
    "category": "array",
    "aliases": []
  },
  {
    "name": "get",
    "category": "object",
    "aliases": []
  },
  {
    "name": "getErrorMessage",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "getOrInsert",
    "category": "object",
    "aliases": []
  },
  {
    "name": "getOrInsertComputed",
    "category": "object",
    "aliases": []
  },
  {
    "name": "group",
    "category": "array",
    "aliases": []
  },
  {
    "name": "guard",
    "category": "async",
    "aliases": []
  },
  {
    "name": "identity",
    "category": "function",
    "aliases": []
  },
  {
    "name": "inRange",
    "category": "number",
    "aliases": []
  },
  {
    "name": "intersects",
    "category": "array",
    "aliases": []
  },
  {
    "name": "invert",
    "category": "object",
    "aliases": []
  },
  {
    "name": "isArray",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isArrayEqual",
    "category": "array",
    "aliases": []
  },
  {
    "name": "isAsyncIterable",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isBigInt",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isBoolean",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isClass",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isDate",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isEmpty",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isEqual",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isError",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isFloat",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isFunction",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isInt",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isIntString",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isMap",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isMapEqual",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isNullish",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isNumber",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isObject",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isPlainObject",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isPrimitive",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isPromise",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isRegExp",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isResult",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isResultErr",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isResultOk",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isSet",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isSetEqual",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isString",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isSymbol",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isUndefined",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isWeakMap",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "isWeakSet",
    "category": "typed",
    "aliases": []
  },
  {
    "name": "iterate",
    "category": "array",
    "aliases": []
  },
  {
    "name": "keys",
    "category": "object",
    "aliases": []
  },
  {
    "name": "last",
    "category": "array",
    "aliases": []
  },
  {
    "name": "lerp",
    "category": "number",
    "aliases": []
  },
  {
    "name": "list",
    "category": "array",
    "aliases": []
  },
  {
    "name": "listify",
    "category": "object",
    "aliases": []
  },
  {
    "name": "lowerize",
    "category": "object",
    "aliases": []
  },
  {
    "name": "map",
    "category": "async",
    "aliases": []
  },
  {
    "name": "mapEntries",
    "category": "object",
    "aliases": []
  },
  {
    "name": "mapify",
    "category": "array",
    "aliases": []
  },
  {
    "name": "mapKeys",
    "category": "object",
    "aliases": []
  },
  {
    "name": "mapValues",
    "category": "object",
    "aliases": []
  },
  {
    "name": "max",
    "category": "number",
    "aliases": []
  },
  {
    "name": "memo",
    "category": "curry",
    "aliases": []
  },
  {
    "name": "memoLastCall",
    "category": "curry",
    "aliases": []
  },
  {
    "name": "merge",
    "category": "array",
    "aliases": []
  },
  {
    "name": "min",
    "category": "number",
    "aliases": []
  },
  {
    "name": "noop",
    "category": "function",
    "aliases": []
  },
  {
    "name": "objectify",
    "category": "array",
    "aliases": []
  },
  {
    "name": "omit",
    "category": "object",
    "aliases": []
  },
  {
    "name": "once",
    "category": "curry",
    "aliases": []
  },
  {
    "name": "parallel",
    "category": "async",
    "aliases": []
  },
  {
    "name": "parseDuration",
    "category": "number",
    "aliases": []
  },
  {
    "name": "parseQuantity",
    "category": "number",
    "aliases": []
  },
  {
    "name": "partial",
    "category": "curry",
    "aliases": []
  },
  {
    "name": "partob",
    "category": "curry",
    "aliases": []
  },
  {
    "name": "pascal",
    "category": "string",
    "aliases": []
  },
  {
    "name": "pick",
    "category": "object",
    "aliases": []
  },
  {
    "name": "pluck",
    "category": "array",
    "aliases": []
  },
  {
    "name": "promiseChain",
    "category": "curry",
    "aliases": []
  },
  {
    "name": "proportionalJitter",
    "category": "random",
    "aliases": []
  },
  {
    "name": "proxied",
    "category": "curry",
    "aliases": []
  },
  {
    "name": "queueByKey",
    "category": "async",
    "aliases": []
  },
  {
    "name": "random",
    "category": "random",
    "aliases": []
  },
  {
    "name": "range",
    "category": "number",
    "aliases": []
  },
  {
    "name": "reduce",
    "category": "async",
    "aliases": []
  },
  {
    "name": "remove",
    "category": "array",
    "aliases": []
  },
  {
    "name": "replace",
    "category": "array",
    "aliases": []
  },
  {
    "name": "replaceOrAppend",
    "category": "array",
    "aliases": []
  },
  {
    "name": "retry",
    "category": "async",
    "aliases": []
  },
  {
    "name": "round",
    "category": "number",
    "aliases": []
  },
  {
    "name": "select",
    "category": "array",
    "aliases": []
  },
  {
    "name": "selectFirst",
    "category": "array",
    "aliases": []
  },
  {
    "name": "Semaphore",
    "category": "oop",
    "aliases": []
  },
  {
    "name": "series",
    "category": "series",
    "aliases": []
  },
  {
    "name": "set",
    "category": "object",
    "aliases": []
  },
  {
    "name": "shake",
    "category": "object",
    "aliases": []
  },
  {
    "name": "shift",
    "category": "array",
    "aliases": []
  },
  {
    "name": "shuffle",
    "category": "random",
    "aliases": []
  },
  {
    "name": "sift",
    "category": "array",
    "aliases": []
  },
  {
    "name": "similarity",
    "category": "string",
    "aliases": []
  },
  {
    "name": "sleep",
    "category": "async",
    "aliases": []
  },
  {
    "name": "snake",
    "category": "string",
    "aliases": []
  },
  {
    "name": "sort",
    "category": "array",
    "aliases": []
  },
  {
    "name": "sum",
    "category": "number",
    "aliases": []
  },
  {
    "name": "template",
    "category": "string",
    "aliases": []
  },
  {
    "name": "throttle",
    "category": "curry",
    "aliases": []
  },
  {
    "name": "timeout",
    "category": "async",
    "aliases": []
  },
  {
    "name": "title",
    "category": "string",
    "aliases": []
  },
  {
    "name": "toFloat",
    "category": "number",
    "aliases": []
  },
  {
    "name": "toggle",
    "category": "array",
    "aliases": []
  },
  {
    "name": "toInt",
    "category": "number",
    "aliases": []
  },
  {
    "name": "toResult",
    "category": "async",
    "aliases": []
  },
  {
    "name": "traverse",
    "category": "object",
    "aliases": []
  },
  {
    "name": "trim",
    "category": "string",
    "aliases": []
  },
  {
    "name": "tryit",
    "category": "async",
    "aliases": []
  },
  {
    "name": "uid",
    "category": "random",
    "aliases": []
  },
  {
    "name": "unique",
    "category": "array",
    "aliases": []
  },
  {
    "name": "unzip",
    "category": "array",
    "aliases": []
  },
  {
    "name": "upperize",
    "category": "object",
    "aliases": []
  },
  {
    "name": "withResolvers",
    "category": "async",
    "aliases": []
  },
  {
    "name": "zip",
    "category": "array",
    "aliases": []
  },
  {
    "name": "zipToObject",
    "category": "array",
    "aliases": []
  }
]
```

