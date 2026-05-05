# Radashi Docs

This repository builds the documentation site for [Radashi](https://github.com/radashi-org/radashi).

The GitHub repository is `radashi-org/radashi-org.github.io`; the local package name is `radashi-docs`.

## Setup

```sh
git clone https://github.com/radashi-org/radashi-org.github.io radashi-docs
cd radashi-docs
pnpm install
pnpm dev
```

Open <http://localhost:4321/> after the dev server starts.

This project does not use Git submodules. During `pnpm install`, the `postinstall` script installs the customized Starlight subrepo into `starlight/`. During development, the Astro config clones or updates `radashi/` so the site can generate API reference pages from Radashi's source docs. Run `pnpm dev` once before building from a fresh clone, or clone `https://github.com/radashi-org/radashi` into `radashi/` manually.

## How It Works

- [Astro](https://astro.build/) builds the site.
- [Starlight](https://starlight.astro.build/) provides the docs framework, with local customizations loaded from `starlight/packages/starlight`.
- Project-owned docs live in `src/content/docs`.
- API reference pages are generated from `radashi/docs/**/*.mdx`.
- Function metadata and bundle-size data are generated from `radashi/src`.
- `public/llms.txt`, `public/llms-full.txt`, and `src/content/docs/reference/index.mdx` are generated files.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the local Astro dev server. |
| `pnpm start` | Alias for `pnpm dev`. |
| `pnpm build` | Run `astro check` and attempt the production static build. |
| `pnpm preview` | Preview the built site from `dist/`. |
| `pnpm astro ...` | Run Astro CLI commands. |

## Generated Files

These paths are created locally and ignored by Git:

- `starlight/`
- `radashi/`
- `dist/`
- `.astro/`
- `.cache/`
- `public/llms.txt`
- `public/llms-full.txt`
- `src/content/docs/reference/index.mdx`

## Current Build Status

`pnpm dev` works for local development. `pnpm build` is expected to complete the Astro check, static build, Pagefind indexing, and sitemap generation.
