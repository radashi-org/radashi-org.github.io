/// <reference path="../.astro/types.d.ts" />
/// <reference types="@astrojs/starlight/global.d.ts" />

declare module 'virtual:radashi/heft' {
  const bytesPerFunction: Record<string, number>
  export default bytesPerFunction
}
