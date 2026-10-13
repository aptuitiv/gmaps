# Plan: Accessibility fixes for overlays, markers, clusters and buttons

Status: **Step 1 complete (2026-10-13).**

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

**Problem.** Hover-triggered tooltips and popups only react to `mouseover` / `mouseout`
(`Tooltip.ts:409-429`, `Popup.ts:525-542`):

1. They never appear for keyboard focus.
2. Moving the pointer onto the tooltip fires `mouseout` on the marker and hides it, so the content
   can't be hovered.
3. There's no way to dismiss them without moving the pointer.

The tooltip also has no `role="tooltip"` and nothing points at it with `aria-describedby`.

**Changes.**

- [ ] **Show on focus.** For `AdvancedMarker`, listen for `focusin` / `focusout` on the
      `AdvancedMarkerElement` and show/hide exactly as for `mouseover` / `mouseout`, positioned at
      the marker's position rather than an event `latLng`.
  - Legacy `google.maps.Marker`, polylines and data features have no focusable DOM element we
    control, so this can't be done for them. Document that.
  - **First, check in a browser** which element Google actually focuses for a clickable
    `AdvancedMarkerElement`, and whether `focusin` bubbles to the element we hold.
- [ ] **Hoverable.** On `mouseout` from the trigger, wait a grace period of 100ms before
      hiding. Cancel the hide if the pointer enters the overlay element. Hide on `mouseleave` from
      the overlay. Do this in a shared place (an `Overlay` helper, or `OverlayAttachment`) so
      Tooltip and Popup hover mode behave the same.
  - Check this against the shared tooltip instance and the `mousemove`-follows-cursor behaviour on
    `Map`. When the tooltip follows the cursor, the pointer can never reach it. That's acceptable
    for map-level tooltips (the cursor is the trigger), but write it down.
- [ ] **Dismissible.** Escape hides a hover tooltip or popup while it's showing, using the same
      document-level listener approach as step 1. After Escape, don't show it again until the
      pointer leaves the trigger, or focus leaves it.
- [ ] **Semantics.**
  - Tooltip overlay element gets `role="tooltip"` and a stable `id`. Generate one if it doesn't
    have one. The shared tooltip has one id for its lifetime.
  - For `AdvancedMarker`, set `aria-describedby` to the tooltip's id while it's showing and remove
    it on hide.
  - **But** if the tooltip text is the same as the marker's accessible name (the `title` case from
    step 3), don't set `aria-describedby`. Otherwise screen readers read it twice.
- [ ] Hover-mode popups get the same treatment as tooltips, rather than step 1's dialog semantics.

**Tests** (`test/Tooltip.test.ts`, `test/Popup.test.ts`):
- [ ] `focusin` / `focusout` on an AdvancedMarker shows and hides the tooltip.
- [ ] `mouseout` followed by entering the tooltip within the grace period keeps it shown. Leaving
      the tooltip hides it.
- [ ] Escape hides it, and it doesn't reappear until the trigger is left.
- [ ] `role="tooltip"` and the id are present. `aria-describedby` is set and cleared, and isn't set
      when the text matches the name.
- [ ] The shared tooltip keeps one id across everything that shares it.

**Docs:** `tooltip.md` and `popup.md` — focus support (AdvancedMarker only), Escape, the grace
period. CHANGELOG.

---

### Step 3 — Marker with both `title` and `tooltip` has no accessible name

**Problem.** When both are given, the title becomes the tooltip content and is never set on the
Google marker (`Marker.ts:1318-1335`, `AdvancedMarker.ts:677-686`). The reason is to avoid a native
browser tooltip showing on top of the custom one. But Google uses `title` as the accessible name of a
clickable marker, and these markers are clickable (`gmpClickable = true`, `AdvancedMarker.ts:943`).
So the marker can be focused but has no name.

**Changes.**

- [ ] **Investigate first** (browser, not jsdom). Write down the answers here before changing code:
  - `AdvancedMarkerElement`: which element gets `title` and which gets the accessible name? Can
    the name be set without a native hover tooltip, e.g. by setting `aria-label` on the focusable
    element and leaving `title` unset?
  - Legacy `google.maps.Marker`: there's no DOM access, so the only lever is `title`. Does setting
    it with a custom tooltip produce a visible double tooltip?
- [ ] `AdvancedMarker`: apply the name without the native tooltip, using whatever the investigation
      shows works. Keep it in sync when `title` is changed later through the setter.
- [ ] `Marker` (legacy): if a native double tooltip is the only way to give it a name, set the title
      anyway. A name matters more than a duplicate hover hint. Note it in the docs, and point people
      to `AdvancedMarker` for the clean behaviour. Legacy `Marker` is deprecated by Google.
- [ ] The tooltip content default (`{ content: options.title }`) stays as it is.

**Tests** (`test/AdvancedMarker.test.ts`, `test/Marker.test.ts`):
- [ ] With title + tooltip, the marker still exposes the title as its name, by whichever mechanism
      was chosen.
- [ ] Changing `title` afterwards updates the name.
- [ ] Title alone and tooltip alone behave as before.

**Docs:** `marker.md` — how `title` and `tooltip` interact. CHANGELOG.

---

### Step 4 — Image cluster markers have no accessible name

**Problem.** `DefaultRender` sets `title: "Cluster of N markers"`, but `ImageRenderer.render()`
(`MarkerCluster/ImageRenderer.ts:367-374`) sets no title. The cluster marker is clickable (it zooms
in), so it can be focused with no name. When `showNumber` is false, nothing conveys the count at all.

**Changes.**

- [ ] Call `clusterMarker.setTitleSync(...)` in `ImageRenderer.render()`, using the same
      `Cluster of ${count} markers` wording as `DefaultRender`.
- [ ] Make the wording configurable on both renderers: a `title` option that is a string template or
      a `(count) => string` function, so sites can localise it. Default stays the same.
- [ ] Put the default text in one place that both renderers use, not two literals.

**Tests** (`test/MarkerCluster.test.ts`):
- [ ] An image-rendered cluster has a title containing the count, with `showNumber` both true and
      false.
- [ ] A custom title function or template is used by both renderers.

**Docs:** `marker-cluster.md` — the new option. CHANGELOG.

---

### Step 5 — Default cluster colors fail contrast

**Problem.** The default label is white, 12px, on `#ff0000` / `#0000ff`, with the centre circle at
0.7 opacity over the map (`MarkerCluster/DefaultRender.ts:58-72, 100, 260`). White on solid
`#ff0000` is already only about 4:1. At 0.7 opacity over a light map it drops to roughly 3:1, below
the 4.5:1 that normal text needs.

**Changes.**

- [ ] Pick defaults that meet 4.5:1 for the label against the centre circle *as rendered*, i.e.
      blended at `centerOpacity` over the worst-case light map background (treat it as white). Two
      levers:
  - darker defaults for `colorRangeBottom` (e.g. a deep red in the `#b00000` range) and
    `colorRangeTop`, and/or
  - a default `centerOpacity` of `1`.
  - Pick the combination that changes the look least. Record the computed ratios here.
- [ ] Don't validate user-supplied colors at runtime. Explain the contrast requirement in the docs
      instead.
- [ ] This is a visible change to the defaults, so call it out under **Changed** in the CHANGELOG.

**Tests:** assert the new default values, and add a small contrast helper in the test file that
checks they're ≥ 4.5:1 after blending.

**Docs:** `marker-cluster.md` — the new defaults, and a note on choosing `bgColor` / `textColor`
with enough contrast once opacity is applied.

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
