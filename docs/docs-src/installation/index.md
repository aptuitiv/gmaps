---
---

# Installation

Install the library from NPM.

```bash
npm install @aptuitiv/gmaps
```

How you use it after that depends on how your site's Javascript is built. Pick the page that matches.

| How you build your site | Page |
|---|---|
| A bundler — Vite, esbuild, Webpack, Rollup, or a build tool that wraps one | [Bundler (ESM)](/installation/bundler) |
| A plain `<script>` tag, no build step | [Standalone browser script](/installation/browser) |
| Node code using `require()` | [CommonJS](/installation/commonjs) |

If you're not sure, use the [bundler](/installation/bundler) page. That is what `npm install` is for
in most projects.

## Entry points

The library has a main entry point that contains everything, and a set of smaller ones for projects
that want to leave out what they don't use.

| Entry point | What it contains |
|---|---|
| `@aptuitiv/gmaps` | Everything. Use this unless you want to think about it |
| `@aptuitiv/gmaps/core` | Everything except popups, tooltips and InfoWindows |
| `@aptuitiv/gmaps/popup` | Popups |
| `@aptuitiv/gmaps/tooltip` | Tooltips |
| `@aptuitiv/gmaps/infowindow` | InfoWindows |
| `@aptuitiv/gmaps/button` | The [Button](/api-reference/map-controls/button) control |

`Button` is separate because it's a piece of UI that plenty of maps don't need.

Popups, tooltips and InfoWindows are separate for a different reason: importing one of them adds
methods to other objects — `attachPopup()` on a marker, for example. A bundler can't tell whether you're going to
call those methods, so it can never leave that code out. Splitting them into their own entry points
is what makes it possible to.

Only the [bundler](/installation/bundler) page can take advantage of this. The browser script always
contains everything, and CommonJS can't be trimmed either way.

:::note
Nothing about the main entry point has changed. If you `import { map } from '@aptuitiv/gmaps'`, you
get everything, exactly as before.
:::
