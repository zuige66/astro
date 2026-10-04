# Update Guide

This project is currently under active maintenance. To update, follow these steps:

First, verify the version number in `package.json` or review the changelog here or at [Release](https://github.com/Motues/Momo/releases).

The project version number is only incremented when the configuration file structure undergoes structural changes. Project configuration files refer to those related to website layout and content, including `astro.config.mjs`, `src/config.ts`, `src/content.config.ts`, and files within the `src/i18n/` folder.

Blog text, images, and other content are stored in the `src/content/`, `src/assets`, and `public` folders.

## Version Number Unchanged

You can directly clone this project, then overwrite the new project with your original configuration files. Run `pnpm install` to install dependencies, followed by `pnpm build` for local compilation. Finally, execute `pnpm preview` to preview the compiled project.

## Version Number Changed

Whenever the version number changes, the modification log will be updated here. Refer to the specific log entries to modify the corresponding configuration files.

Below are general modification suggestions.

* **`astro.config.mjs` Modifications**: Typically just overwrite the file, then update the `site` and `i18n` fields in `siteConfig` with your own information.
* **`config.ts` Modifications**: Update `config.ts` by adding or modifying configuration items as required.
* **`content.config.ts` Modifications**: Typically involves adding new frontmatter configurations to articles. Add the required new configuration items to articles as specified.
* **`src/i18n/` Modifications**: Generally involves adding new internationalization translations. Simply overwrite the files, then ensure to modify the `cover.title` and `cover.subtitle` fields with your own information.

## Version Information

### Custom domain deployment

After binding a custom domain, set `site` in `astro.config.mjs` to that domain and set `base` to `/`. When referencing files from `public` in articles, use root paths such as `/images/...` so the site does not continue requesting the old `/astro/` path.

For a friend-link avatar hosted on another site, keep the complete `https://` URL and do not prepend the site's `base` path. Only local avatars in `public` should use the site's root path.

> Version numbers follow the `YY.MM.DD` format

### 26.8.15

> This is a breaking update. Please read the release notes below carefully!

* This update upgrades the project from Astro5 to Astro7. The old version has been archived to the `v5` branch and will no longer be maintained
* Astro7 requires Node.js version >= 22; we recommend using version 24 LTS. After upgrading, you must clear your local cache (folders such as `/node_modules`) before you can compile and preview locally
* This update modifies the configuration files `content.config.ts` and `astro.config.mjs`
* If you encounter any issues after upgrading, please feel free to submit an issue to provide feedback

Translated with DeepL.com (free version)

### 26.8.12

* Home page post cards now support two image display styles and are optimized for mobile devices
* Fixed an issue where the language selection button was hidden in single-language mode
* This update modifies the `config.ts` configuration file by adding the `theme.postCard` field; you must add this new field when updating

### 26.6.2

* The comments component now supports author badges and admin comments, as well as paginated loading of additional comments and collapsible multi-reply threads.
* Added support for footnote styles
* Fixed color flickering issues during page transitions and optimized certain UI elements
* This update modifies the configuration file `src/i18n/`, adding fields such as `comments.verificationRequired`; all other fields remain unchanged. When making modifications, simply add the new fields

### v26.5.6

* Added the `LQIP` low-quality image placeholder feature
* Added support for a new Markdown style: the underscore syntax (++)
* Added style configuration options
* This update modifies the `astro.config.mjs` configuration file to include the `remarkLqip` plugin; it also modifies the `config.ts` configuration file by adding fields such as `theme.LQIP`. When updating, you must add these new fields.


### v26.5.3

* Added a preview feature for comment replies
* Enhanced comment content security
* Fixed a type error in `astro.config.mjs`
* This update modifies the configuration file `astro.config.mjs` by changing how `AdmonitionComponent` is imported; corresponding changes must be made

### v26.4.27

* The comment system now supports Markdown syntax
* This update modifies the configuration file `src/i18n/`, adding fields such as `comments.write`; all other fields remain unchanged. When making modifications, simply add the new fields

### v26.4.21

* Added AOS animation toggle configuration
* The comment system now supports Twikoo
* This update modifies the `config.ts` configuration file by adding the `theme.AOS` and `comments.platform` fields; these new fields must be added when updating

### v26.4.15

* Added the function for pined posts
* Updated the Music Card API URL
* Fixed some styling issues
* This update modifies the `astro.config.mjs` configuration file and adds a new dependency, `@iconify-json/fluent`. You must add the corresponding fields and run `pnpm install`.

### v26.4.7

* Fixed translation errors
* Changed the color of selected text
* Updated the Mucis Card API URL
* This update modifies the configuration file `src/i18n/language/en.ts` by changing the `themeInfo.system` field; all other fields remain unchanged. When updating, you only need to modify the fields that have changed.

### v26.3.29

* Updated the comment data structure to support the new version of the comment backend
* Optimized the styling of comments on mobile devices
* Fixed an issue where the category menu on the archive page was misaligned
* This update modifies the configuration file `src/i18n/` by adding the `comments.replyTo` field; all other fields remain unchanged. To apply the changes, simply add the new field

### v26.3.17

* Changed the style of comment avatars to circular
* Adjusted the margins of some components
* This update modifies the configuration file `src/i18n/` by adding the `themeInfo` field; all other fields remain unchanged. To apply the changes, simply add the new field

Translated with DeepL.com (free version)

### v26.3.11

* Initial release version `v26.3.11`
* Multiple project improvements, including: optimized mobile experience, unified website color scheme
* This update modifies the configuration file `src/i18n/`. We recommend using the latest version and updating the `cover.title` and `cover.subtitle` fields with your own information.
