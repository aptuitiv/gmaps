# Plan: Accessibility fixes for overlays, markers, clusters and buttons

Status: **Steps 1–5 complete (2026-10-13).**

Created: 2026-10-13
Target: `src/lib/Popup.ts`, `src/lib/Tooltip.ts`, `src/lib/Overlay.ts`, `src/lib/Marker.ts`,
`src/lib/AdvancedMarker.ts`, `src/lib/MarkerCluster/DefaultRender.ts`,
`src/lib/MarkerCluster/ImageRenderer.ts`, `src/lib/Button.ts`

Related: `../done/button.md`, `../done/control.md`

---

## 1. Goal

Fix the accessibility problems found in the 2026-10-13 review. Each step below is one problem, and
each is done, tested and reviewed on its own before the next one starts.

Out of scope: the resize and rotate handles on `Overlay` and `ImageOverlay`, which can only be
dragged with a mouse (review item 6). They are editing tools rather than something end users see,
and they need their own design. See §4.

What is already fine and isn't touched: `Button` / `Control` keyboard support (role, tabindex,
Enter/Space, `aria-pressed`, `aria-disabled`), `InfoWindow` (exposes Google's `ariaLabel` and
`shouldFocus`), and the search boxes (the caller owns the input).

---

## 2. Order and dependencies

| Step | Review item | Depends on |
|------|-------------|------------|
| 1 | Popup: focus, Escape, role and name, keyboard close element | — |
| 2 | Hover tooltips and popups: focus trigger, hoverable, Escape, `role="tooltip"` | Step 1 (Escape handling) |
| 3 | Marker loses its accessible name when it has both a title and a tooltip | — |
| 4 | Image cluster markers have no accessible name | — |
| 5 | Default cluster colors fail contrast | — |
| 6 | Button tooltip overrides visible text (`aria-label` vs. Label in Name) | — |
| 7 | Visible focus inside the default Popup theme | Step 1 |

Steps 3–6 don't depend on anything and can be done in any order. They're small, so doing them first
is a reasonable warm-up before the two larger overlay steps.

---

## 3. Steps

### Step 1 — Popup: focus management, Escape, semantics

**Complete (2026-10-13).**

**Problem.** Opening a popup doesn't move focus, and closing it doesn't give focus back. The popup
sits in Google's float pane deep inside the map's markup, has no role and no name, and can't be
closed with Escape. A `div` passed as `closeElement` gets a click listener and nothing else.

**Changes.**

- [x] New `PopupOptions`, following `InfoWindow`'s naming so the two match, each with a property:
  - `ariaLabel?: string` — written as `aria-label` on the overlay element.
  - `focus?: boolean` — whether opening the popup moves focus into it. **Defaults to `true`**
    (decided 2026-10-13). It never applies to hover popups: a hover must not move focus.
  - `role?: string` — defaults to `'dialog'` for `click` / `clickon` popups and to no role for hover
    popups. Step 2 gives hover popups `role="tooltip"`.
- [x] Change `InfoWindow`'s `focus` default from `false` to `true` so the two match. It's passed
      through as Google's `shouldFocus`.
  - **Found on the way:** `InfoWindow.attachTo()` never stored the trigger event, so `show()` had
    no way to tell a hover from a click. It's stored now, and `shouldFocus` is `false` for hover.
- [x] When focus moves into the popup on open: focus the first focusable descendant, or the overlay
      element itself (given `tabindex="-1"`) if there isn't one. Done on the first `draw()` after
      opening, once the element is on the page and has been fit within the map, with
      `preventScroll`. The element that had focus is remembered when the popup opens.
  - The opener is remembered *after* `hideOthers()`. If the popup being replaced had focus, it
    hands focus back first, so the new popup records the original opener rather than an element
    inside a popup that's about to go.
- [x] On `hide()`: if focus was inside the popup, put it back on the remembered element, as long as
      that element is still connected. Whether focus was inside is checked *before* the element is
      taken off the page, because by then focus has already fallen back to the body. This covers
      every way of closing, because they all go through `hide()`.
- [x] Escape closes the most recently opened non-hover popup.
  - **Differs from the plan:** there's one `document` listener shared by every popup, rather than
    one on each overlay element plus one on the document. It's added the first time a popup opens,
    not when the file loads, and it stays. When no popup is open it does nothing, which is cheaper
    than adding and removing it on every open and close.
  - It listens in the bubbling phase and ignores an event that's already `defaultPrevented`. That
    way a control inside the popup that uses Escape for itself doesn't also close the popup.
  - Popups are found in `PopupCollection`, which is in the order they were opened. A `clickon`
    popup is shown through `move()` rather than `show()`, so it never used to be marked open. It
    is now, so that Escape can find it, and as a side effect `isOpen()` is now correct for
    `clickon` popups.
- [x] `closeElement`: `makeButtonLike()` and `isActivationKey()` were pulled out of
      `Button.#setUpKeyboard()` into `helpers.ts`. Both `Button` and the popup close element use
      them, and `Button`'s behaviour hasn't changed.
- [x] No `aria-modal`, and focus isn't trapped. The popup isn't modal: the map behind it stays
      usable.
- [x] Role, name and tabindex are written in `add()`, when the element goes onto the page. The
      setters only write to the element when the popup is showing, so the element isn't built early
      (attaching a popup to thousands of layers relies on it being built lazily).

**Tests** (`test/Popup.test.ts`, new `test/InfoWindow.test.ts`):
- [x] `ariaLabel` and `role` end up on the element, and changing `ariaLabel` later updates it.
      Setting them on a popup that isn't showing doesn't build the element.
- [x] By default, opening focuses the first focusable child (skipping disabled and `tabindex="-1"`
      ones), or the container when there isn't one. Focus moves on the first draw only.
      `focus: false` leaves focus where it is. A hover popup never takes focus.
- [x] `InfoWindow` passes `shouldFocus: true` by default and on click, and `false` with
      `focus: false` and on hover. The Google stub gained `open()`, `close()` and `setContent()` on
      `InfoWindow` for this.
- [x] Closing gives focus back to the opener: on `hide()`, `closeAllPopups()`, Escape, and when
      `autoClose` replaces one popup with another. It doesn't when focus is already elsewhere, or
      when the opener has been removed from the DOM.
- [x] Escape closes the popup from inside it and from outside it. Only the top popup closes, and
      the next press closes the one below. It also closes a `clickon` popup. It does nothing to a
      closed popup or a hover popup, nothing when the event was already handled, and other keys
      do nothing.
- [x] A `div` used as `closeElement` gets role and tabindex, and Enter/Space close the popup. A
      `<button>` is left alone.
- [x] `Button` tests still pass after the helper is extracted.

**Docs:** `popup.md` — the new options and properties, and a new Accessibility section.
`infowindow.md` — the new `focus` default. `guides/popup/closing.md` — recommend a `<button>`,
mention Escape. CHANGELOG — Added and Changed.

**Still to do by hand:** check in a real browser with a screen reader. jsdom has no layout, and
Google's `OverlayView` is stubbed out, so `add()` and `draw()` were called directly in the tests.

---

### Step 2 — Hover tooltips and popups (WCAG 1.4.13)

**Complete (2026-10-13).**

**Problem.** Hover-triggered tooltips and popups only reacted to `mouseover` / `mouseout`:

1. They never appeared for keyboard focus.
2. Moving the pointer onto the tooltip fired `mouseout` on the marker and hid it, so the content
   couldn't be hovered.
3. There was no way to dismiss them without moving the pointer.

The tooltip also had no `role="tooltip"`.

**Changes.**

- [x] **Shared hover module, `src/lib/hoverOverlay.ts`.** Tooltip and Popup both use
      `attachHover()` for their hover wiring, and `OverlayAttachment` (data layers) uses
      `hoverShown()` / `hoverEnded()` / `isHoverDismissed()`. This holds the Escape handling, the
      "don't show again yet" state and the `aria-describedby` handling.
- [x] **Hoverable.** `Overlay.hideSoon()` hides after `HOVER_HIDE_DELAY` (100ms, in
      `constants.ts`). The overlay element's `mouseenter` cancels it and `mouseleave` starts it
      again, but only while the overlay was shown by hover (`markHoverShown()`). A click-shown
      overlay isn't hidden by the pointer leaving it. `show()`, `move()` and `hide()` all cancel a
      pending hide, so moving back to the marker in time keeps the overlay showing. The shared
      tooltip moving from one marker to the next no longer flickers either.
  - A map-level tooltip follows the cursor, so the pointer can never reach it. That's acceptable:
    the cursor is what it's showing for. Noted in the code and the docs.
- [x] **Dismissible.** One `document` keydown listener, **in the capture phase**, hides every
      overlay currently shown by hover or focus. It records their triggers as dismissed and calls
      `preventDefault()`. A dismissed trigger doesn't show again until `mouseout` / `focusout`.
  - Capture phase puts it ahead of Popup's bubble-phase Escape listener (step 1), so the first
    Escape takes the hover content away and the next one closes a click popup. It also still works
    when something on the page stops the event from bubbling.
  - The tracked map is pruned of hidden overlays on every add, so it only ever holds the few that
    are showing.
- [x] **Semantics.** Tooltip gets `role="tooltip"` in `add()`. Hover popups default to
      `role="tooltip"` instead of having no role (this changes a step 1 test). `Overlay.getOverlayId()`
      gives the element a stable `gmaps-overlay-N` id, so the shared tooltip keeps one id for its
      lifetime.
- [x] **Show on focus (AdvancedMarker only).** `Layer.getFocusTarget()` is an internal hook. It
      returns nothing by default, and AdvancedMarker overrides it to return its element and
      position. `attachHover()` listens for `focusin` / `focusout` on that element: focus shows the
      overlay at the marker's position, and focus moving *within* the element doesn't hide it. While
      it's shown for focus, `aria-describedby` on the marker element points at the overlay's id, and
      it's removed again on focusout or Escape. Ids already in the attribute are kept. It isn't set
      when the overlay's text matches the element's `aria-label` / `title`.
  - Listening on the host element covers focus landing on it or on something inside it (focus
    events are composed, so they cross shadow DOM), so the "which element does Google focus"
    browser check isn't needed to make show/hide work. It does still matter for
    `aria-describedby`: see the browser check below.
- [x] Hover popups get the same treatment as tooltips.

**Found on the way:**

- **AdvancedMarker never dispatched `ready`.** Tooltip, Popup and InfoWindow all wait for it before
  adding their listeners, so attaching any of them to an AdvancedMarker did nothing. It's
  dispatched now, once, after the Google element is built. There's a regression test in
  `test/AdvancedMarker.test.ts`.
- **AdvancedMarker isn't public, and won't be for a while** (decided 2026-10-13: it isn't complete).
  It isn't exported from any entry point and isn't documented. So the focus support above can't be
  reached by users: the public `marker()` is Google's legacy marker, which gives no element or event
  for focus. The code and tests stay in place, dormant, for when AdvancedMarker is finished. The
  docs describe only what users can actually get: hover tooltips aren't shown for keyboard focus, so
  put anything essential in the marker `title`.
- `AdvancedMarker.on()` notes that Google's `mouseover` via `addListener` may not fire on an
  `AdvancedMarkerElement` at all. That's unverified, and it's a question for whenever
  AdvancedMarker goes public.

**Tests** (new `test/hover.test.ts`, which covers Tooltip, Popup and the data layer together; plus
`test/AdvancedMarker.test.ts` and `test/Popup.test.ts`):
- [x] `focusin` / `focusout` on an AdvancedMarker shows and hides the tooltip, at the marker's
      position. Focus moving inside the marker keeps it. A hover popup shows for focus and doesn't
      take it.
- [x] `mouseout` waits 100ms. Entering the tooltip in that time keeps it, leaving the tooltip hides
      it, and coming back to the marker in time keeps it. Hover popups and data layer features wait
      the same way. Leaving a click-shown tooltip doesn't hide it.
- [x] Escape hides it, with `preventDefault`. It doesn't reappear until the pointer, or focus,
      leaves. Dismissing one marker doesn't block another. Escape hides hover content before a
      click popup, and works through `stopPropagation`. A no-op Escape doesn't `preventDefault`. A
      map tooltip stays hidden on mousemove after Escape. Same for data layer features.
- [x] `role="tooltip"`. The id is set, and `aria-describedby` is set, cleared, and keeps existing
      ids. It isn't set when the text matches the name. The shared tooltip keeps one id.
- [x] Mutation-checked: switching the delayed hide to an immediate one fails 3 tests, and switching
      the Escape listener to the bubble phase fails 1.
- The AdvancedMarker test stub is now an `HTMLElement` under jsdom (registered as a custom element
  by `installGoogleMaps()`), like the real one, so focus events can be dispatched on it.

**Docs:** `tooltip.md` — new Accessibility section. `popup.md` — hover popups now work like
tooltips, and the role default. CHANGELOG — Added, Changed and Fixed.

**Still to do by hand:**

- A browser check with a mouse: move from a marker onto its tooltip, and press Escape.
- Deferred until AdvancedMarker is finished and public: a browser and screen reader check of focus and
  `aria-describedby`. The tooltip is added to the page by Google's `onAdd()`, which may run after
  the screen reader has already asked for the description.

---

### Step 3 — Marker with both `title` and `tooltip` has no accessible name ✅

**Problem.** When both are given, the title becomes the tooltip content and is never set on the
Google marker (`Marker.ts` `setOptions()`). The reason is to avoid a native browser tooltip showing
on top of the custom one. But Google uses `title` as the accessible name of a clickable marker. So
the marker can be focused but has no name.

**Scope:** `Marker` only. AdvancedMarker isn't public and won't be for a while, so it's left alone
here and picked up when it's finished.

**Investigation** (headless Chrome, Maps JS weekly, 2026-10-13, with `.env` key):

- A legacy, **unoptimized**, clickable marker is a `<div role="button">` with
  `aria-label="<title>"` and roving tabindex (the first marker is `0`, the rest `-1`). The native
  hover tooltip comes from an `<area title="<title>">` inside it.
- A marker without a title is the same `role="button"` div with no `aria-label`: focusable, no
  name. Confirmed the problem.
- `setTitle('...')` updates both. `setTitle('')` / `setTitle(null)` clears the `<area>` title
  (asynchronously, within 50ms) but **leaves the `aria-label` as it was**.
- **Optimized** markers have no element on the page at all, so they can't be reached by keyboard
  or screen reader whatever the title. Corrected during step 4, with more probes:
  - A marker is only a focusable `role="button"` when it has a **click listener**. Without one it
    has no button, even with `optimized: false`. So hover-only markers can't be focused.
  - `optimized: true` means no button, click listener or not.
  - With `optimized` unset (the library's default), clickable markers got buttons up to 255 on the
    map and none at 270+: past roughly 256 Google optimizes them all. `optimized: false` kept 300
    focusable.
  - Not changed here: the default stays with Google. Documented in `marker.md`.
- A DOM `mouseover` on the `<area>` fires the marker's `mouseover`, so the library sees hover.

**Changes.**

- [x] The title is always set on the Google marker, tooltip or not. The tooltip content default
      (`{ content: options.title }`) stays as it is. `marker.title` now returns it in this case too.
- [x] Instead of accepting a double tooltip, the title is taken off the Google marker while the
      pointer is on it, and put back on mouseout. New internal `Layer.hideNativeTitle(isHidden)`
      (no-op by default, Marker overrides), called from `attachHover()` on mouseover / mouseout, so
      it covers hover tooltips and hover popups, and nothing else (a title-only marker, or a click
      tooltip, keeps the native tooltip). It's idempotent, so mousemove-driven repeat mouseovers
      don't call Google again. It stays off after Escape until the pointer leaves.
- [x] `setTitle()` while hovered keeps the Google title off and puts the new one on at mouseout.
- Keyboard focus never triggers this, so the name is always there for keyboard users. While
  hovered, Google keeps the `aria-label` anyway (see above), but nothing relies on that.

**Tests** (`test/hover.test.ts`, "a marker's title", 10 tests):
- [x] With title + tooltip, the title goes into the Google constructor options and is the tooltip
      content.
- [x] Off on mouseover, back on mouseout. Only once for repeated mouseovers. Off after Escape until
      the pointer leaves. Changed while hovered goes on at mouseout. Hover popup too.
- [x] Title alone, click tooltip, and tooltip alone make no hover `setTitle` calls.
- [x] Mutation-checked: ignoring the hidden flag in `#setTitle` fails 1 test.

**Docs:** `marker.md` — new Accessibility section (title as name, title + tooltip, optimized
markers can't be focused), `title` / `tooltip` option and property rows. `tooltip.md` — links to it.
CHANGELOG — Fixed.

**Still to do by hand:**

- A real-mouse check in Chrome, Firefox and Safari that no native tooltip appears over the custom
  one. The title comes off on mouseover, well before the browser's tooltip delay, but whether a
  browser that already started its timer still shows the old text can't be checked headless.
- A screen reader check that an unoptimized marker with title + tooltip is announced by its title.

---

### Step 4 — Image cluster markers have no accessible name ✅

**Problem.** `DefaultRender` sets `title: "Cluster of N markers"`, but `ImageRenderer.render()` set
no title. The cluster marker is clickable (the clusterer adds a click listener for
`onClusterClick`, which defaults to zooming in), so Google makes it a focusable button, with no name.
When `showNumber` is false, nothing conveyed the count at all.

**Changes.**

- [x] New `src/lib/MarkerCluster/clusterTitle.ts`: the `ClusterTitle` type (string or
      `(count) => string`), `DEFAULT_CLUSTER_TITLE = 'Cluster of {count} markers'`,
      `getClusterTitle()` (replaces every `{count}`) and `isClusterTitle()`. The one place the
      default text lives.
- [x] Both renderers have `setTitle()` (ignores empty strings and other values) and use
      `getClusterTitle()`. `ImageRenderer.render()` calls `clusterMarker.setTitleSync(...)`, with
      `showNumber` true or false. The image renderer's fallback `DefaultRenderer` gets its title.
- [x] `title` option on `DefaultRenderOptions` and `ImageRendererOptions`, wired in
      `MarkerCluster`.

**Tests** (`test/MarkerCluster.test.ts`, "the cluster marker title", 9 tests): default and image
renderers' default title; image renderer with `showNumber` true and false; template and function on
both; empty title ignored; fallback renderer gets the title; both options reach the renderers. The
clusterer mock gained `MarkerUtils.isAdvancedMarkerAvailable`. Mutation-checked: removing the
`setTitleSync` call fails 6 tests.

**Docs:** `marker-cluster.md` — `title` rows in both option tables, the fallback note, and a new
"Cluster marker title" section. `marker.md` — the Accessibility section corrected to the click
listener / 256 marker findings. CHANGELOG — Added and Fixed.

---

### Step 5 — Default cluster colors fail contrast ✅

**Problem.** The default label is white, 12px, on `#ff0000` / `#0000ff`, with the centre circle at
0.7 opacity over the map (`MarkerCluster/DefaultRender.ts`). White on solid `#ff0000` is only
about 4:1. At 0.7 opacity over a white map it drops to about 3.3:1, below the 4.5:1 that normal text
needs.

**Computed ratios** (white label, centre circle blended over white):

| Color | 0.7 opacity | 1.0 opacity |
|---|---|---|
| `#ff0000` (old) | 3.28 | 4.00 |
| `#d00000` | 3.99 | 5.70 |
| `#c00000` | 4.27 | 6.48 |
| `#b00000` (new) | 4.56 | 7.38 |
| `#0000ff` | 5.52 | 8.59 |

**Decision.** Only the red fails, and the blue already passes at 0.7. So the change that alters the
look least is `colorRangeBottom` `#ff0000` → `#b00000`, keeping `centerOpacity` at 0.7. That keeps
the see-through look. Making the circle solid would change every cluster's look and still needs a
darker red.

- [x] `#colorRangeBottom` default is `'#b00000'`, with the ratios in a comment.
- [x] User colors aren't checked at runtime. The docs explain how to check them.
- [x] CHANGELOG **Changed**, with how to keep the old color.

**Tests** (`test/MarkerCluster.test.ts`, "the default cluster colors", 4 tests): the colors are
read out of the rendered SVG icon. Below/at the average gives `#b00000`, above gives `#0000ff`, both
at 0.7 with a white label. A WCAG contrast helper in the test file checks both are ≥ 4.5:1 after
blending, and fails the old red.

**Docs:** `marker-cluster.md` — the `colorRangeBottom` default, and a new "Color contrast" section on
checking `bgColor` / `textColor` once `centerOpacity` is applied.

---

### Step 6 — Button tooltip overriding visible text

**Problem.** A state's `tooltip` is written to both `title` and `aria-label` by default
(`Button.ts:476-485`). If the button has visible text that differs from the tooltip, `aria-label`
replaces that text as the accessible name. That breaks WCAG 2.5.3 (Label in Name): voice-control
users can't activate the button by saying what they see. Icon-only buttons, the common case, are
fine as they are.

**Changes.**

- [ ] In `#applyTooltip()`, when no `tooltipAttribute` is set: always write `title`. Only write
      `aria-label` when the element has no visible text content.
  - "Visible text" = trimmed `textContent`, ignoring text inside `svg` elements and anything with
    `aria-hidden="true"`.
  - Check this at the time the tooltip is applied, because a state's `text` can change the content.
    Apply `text` before `tooltip` within a state so the check sees the new text.
- [ ] If an `aria-label` this code set earlier is no longer wanted (the button now has text), remove
      it. Only remove one we set ourselves, never one the caller set.
- [ ] An explicit `tooltipAttribute` keeps its current behaviour exactly.

**Tests** (`test/Button.test.ts`):
- [ ] Icon-only button: both `title` and `aria-label` are set (unchanged).
- [ ] Button with visible text: `title` is set and `aria-label` isn't.
- [ ] A state change that adds text removes our `aria-label`. A caller-supplied `aria-label` is never
      removed.
- [ ] `tooltipAttribute: 'data-tooltip'` behaves as before.

**Docs:** `docs/docs-src/api-reference/map-controls/` button page — when `aria-label` is and isn't
written. CHANGELOG.

---

### Step 7 — Visible focus inside the default Popup theme

**Problem (to confirm).** Once step 1 moves focus into popups, focused elements inside a
default-themed popup need a visible focus indicator. The default theme is inline styles only
(`Popup.ts:460-475`), and it doesn't remove outlines itself. The open question is whether Google's
map CSS (`.gm-style`) suppresses outlines on descendants.

**Changes.**

- [ ] **Verify first** in Chrome, Firefox and Safari: with `theme: 'default'`, are focus rings
      visible on a link and a button inside the popup, and on the popup container when it gets
      focus with `tabindex="-1"`?
  - If they are, close this step with a note and no code change.
- [ ] If they aren't: the library injects no CSS today, so pick one of these and record the decision
      here:
  - (a) Inject one small, scoped `<style>` the first time a default-themed popup is shown, e.g.
    `.gmaps-popup-default :focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }`,
    and add that class name with the theme. Remove it with `theme: 'none'`.
  - (b) No injection: document the CSS rule to copy, as the Button docs already do for a plain
    button.
  - Leaning (a), because the default theme exists so people don't have to write CSS.
- [ ] Don't show a ring on the container for pointer-opened popups. `:focus-visible` handles that.

**Tests:** if (a), the style element is injected once, the class is added and removed with the
theme, and nothing is injected with `theme: 'none'`.

**Docs:** `popup.md`. CHANGELOG.

---

## 4. Deferred

| Left out | Why |
|----------|-----|
| Keyboard alternative for the `Overlay` / `ImageOverlay` resize and rotate handles (review item 6) | Editing tools, not end-user UI. They need a design of their own (arrow-key nudging, numeric inputs, or a single-pointer alternative for WCAG 2.5.7). |
| Focus-triggered tooltips for legacy `Marker`, polylines and data features | No focusable DOM element we control. Google offers no focus event for them. |

## 5. Decisions

- **2026-10-13 — focus default:** `focus` defaults to `true` for both `Popup` and `InfoWindow`.
  Hover popups never take focus.
- **2026-10-13 — grace period:** 100ms for the hover hide in step 2.
