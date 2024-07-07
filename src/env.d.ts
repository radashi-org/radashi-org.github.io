/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module 'virtual:radashi/heft' {
  const bytesPerFunction: Record<string, number>
  export default bytesPerFunction
}
