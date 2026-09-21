---
---

# Plugins

Plugins extend the library from outside it. See the [plugin guide](/plugin) for how to write one.

## Shipped with the library

These come with `@aptuitiv/gmaps` and need no extra install. Each has its own entry point so that a
project only carries it if it asks for it — see [installation](/installation/bundler).

| Plugin | Import | What it does |
|--------|--------|--------------|
| [Button](/api-reference/map-controls/button) | `@aptuitiv/gmaps/button` | A control that responds to clicks, and optionally remembers whether it's active and whether it's enabled |
| [Location control](/api-reference/map-controls/location-control) | `@aptuitiv/gmaps/location-control` | Shows the user's position as a marker that follows them, with a control that takes the map back to it |
| [Popup](/api-reference/popup) | `@aptuitiv/gmaps/popup` | A custom styled popup on markers, polylines, data layer features and the map |
| [Tooltip](/api-reference/tooltip) | `@aptuitiv/gmaps/tooltip` | A custom styled tooltip on the same things |
| [InfoWindow](/api-reference/infowindow) | `@aptuitiv/gmaps/infowindow` | Google's own InfoWindow, wrapped |

Popups, tooltips and InfoWindows are also in the main `@aptuitiv/gmaps` entry point, so importing
from there gets you all three without naming them.

## Third-party plugins

None listed yet. If you've published one, [open a pull request](https://github.com/aptuitiv/gmaps)
to add it here.

Include the name, a one-line description, a link to the repository, and a link to a demo if you have
one. Plugins on this list are expected to follow the
[conventions in the plugin guide](/plugin#conventions), including keyboard and screen reader support
for anything that renders UI.
