---
title: "Fixing Astro Build Failures: Dependency Conflicts and a Pagination Language Bug"
pubDate: 2026-09-08
draft: false
description: A practical record of fixing ERESOLVE, source-map-js, and currentLang errors while building an Astro blog on Windows.
image: ""
slugId: astro-build-dependency-fix
category: Technology
pinTop: 0
---

While adding bilingual pages, comments, and layout improvements to this blog, the production build failed several times. Although all failures appeared around `npm run build`, they had different causes: incomplete dependency installation, incompatible package versions, and a JavaScript initialization-order bug.

## First issue: npm could not resolve dependencies

The first `npm install` ended with `ERESOLVE could not resolve`. The project declared one version of `@tailwindcss/vite`, while `node_modules` contained another. Vite peer dependency requirements were inconsistent as well.

Running the build immediately is not useful in this state. Astro may not have been installed completely, which can lead to:

```text
Cannot find module node_modules/astro/bin/astro.mjs
```

Stop development servers and Node processes, then reinstall from a clean dependency directory:

```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item .\node_modules -Recurse -Force
npm.cmd install --legacy-peer-deps
```

`--legacy-peer-deps` only relaxes peer-dependency resolution during installation. It does not replace the need to keep the package versions consistent. Use `npm ls` to inspect the actual installed tree.

## Second issue: mixed framework versions

The dependency tree showed that Astro 7.2.1 used Vite 8, while Tailwind and other integrations in the project were still resolved for Vite 7. With this mixed tree, Vite loaded the CommonJS package `source-map-js` as ESM and reported:

```text
require is not defined
```

The fix was not to edit `source-map-js`, but to use one compatible set of framework and build-tool versions:

| Package | Version |
| --- | --- |
| `astro` | `6.4.8` |
| `@astrojs/svelte` | `8.1.2` |
| `vite` | `7.3.6` |
| `@tailwindcss/vite` | `4.1.13` |
| `tailwindcss` | `4.1.13` |

After updating `package.json`, reinstall and inspect the top-level packages:

```powershell
npm.cmd install --legacy-peer-deps
npm.cmd ls astro vite @astrojs/svelte @tailwindcss/vite --depth=0
```

If `npm ls` reports `invalid`, the dependency tree is still inconsistent and should not be published yet.

## Third issue: `currentLang` was initialized too late

Once the dependency problem was fixed, the build reached the pagination pages and failed with:

```text
Cannot access 'currentLang' before initialization
```

In `src/components/control/Navi.astro`, the page-size options and URL helper used `currentLang` before the variable was declared. Because `const` variables cannot be accessed before initialization, this creates a temporal dead zone even inside the same component.

The fix is to initialize the language and translation helper before any code that uses them:

```astro
const currentLang = Astro.currentLocale || i18n!.defaultLocale;
const t = i18nit(currentLang);
```

This is a source-code bug, so reinstalling packages cannot fix it.

## Final verification

Run the production build after fixing both the dependency tree and the component:

```powershell
npm.cmd run build
```

A successful run should finish with output similar to:

```text
37 page(s) built
Build complete!
Indexed 2 languages
Finished
```

Warnings about a missing `src/icons` directory, unused Svelte transitions, or Pagefind not stemming Chinese words do not prevent the build from completing.

## Publishing to GitHub Pages

This project uses `.github/workflows/deploy.yml`. A push to the `main` branch starts the GitHub Actions build and deployment workflow. After the local build succeeds:

```powershell
git add package.json package-lock.json src/components/control/Navi.astro
git commit -m "Fix build dependencies and pagination language initialization"
git push origin main
```

Open the repository’s **Actions** page and wait for both the build and deployment jobs to complete before checking the website.

The main lesson from this incident is to separate installation failures, dependency-compatibility failures, and application-code failures. Do not reinstall blindly whenever a build fails, and do not publish until the local production build passes.
