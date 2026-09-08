# Plan: Map Data layer (`DataLayer` / `DataFeature`)

Status: **Complete — all four phases done**
Created: 2026-09-07
Updated: 2026-09-08 — scope trimmed to a deliberately small v1; open questions resolved; v1 built and documented
Target: `src/lib/DataLayer.ts`, `src/lib/DataFeature.ts` (replaces the stub at `src/lib/Map/Data.ts`)

Reference: https://developers.google.com/maps/documentation/javascript/datalayer
API reference: https://developers.google.com/maps/documentation/javascript/reference/data

---

## 1. Goal

Wrap `google.maps.Data` so that it follows this library's conventions, removes the
callback/imperative boilerplate the raw API requires, and works whether or not the map
object exists yet.

Two use cases must be covered by one class:

1. The map's built-in data layer (`google.maps.Map.data`).
2. Additional, independent data layers created with `new google.maps.Data()` and attached
   to a map later (or never).

**Scope discipline:** v1 is deliberately small. We are not wrapping every member of
`google.maps.Data`, and we are not adding convenience methods just because they would be
nice. Section 8 lists what was consciously left out and why, so it can be pulled back in
later without redoing the thinking.

---

## 2. API facts this plan depends on

Recorded because they drove the design decisions below.

### Polyline vs. Polygon vs. Data.Polygon

These are three different things and are easy to conflate:

| | Paths | Fill | Closed | Properties / GeoJSON |
|---|---|---|---|---|
| `google.maps.Polyline` (our `Polyline`) | one | no | no | no |
| `google.maps.Polygon` (we do not wrap this yet) | many (outer + holes) | yes | auto | no |
| `google.maps.Data.Polygon` inside `google.maps.Data` | many (outer + holes) | yes | auto | yes |

**Our existing `Polyline` class cannot draw the polygon-with-holes example from the
Google docs.** It wraps `google.maps.Polyline`, which takes a single `path` and has no
`fillColor`/`fillOpacity`. The docs example is `Data.Polygon` geometry added to a data
layer, which is what `DataLayer.addPolygon()` below covers.

`Polyline` is still the correct *structural* template for a future standalone `Polygon`
class (getters/setters, chainable `set*` methods, `#setupGooglePolyline`-style deferred
creation, factory function, `*Collection`). That is tracked as a separate follow-up in
section 9 and is **not** part of this plan.

### Data.Polygon geometry

- `new google.maps.Data.Polygon(paths)` where `paths` is an array of rings; ring `[0]` is
  the outer boundary, rings `[1..n]` are holes.
- Rings are `Data.LinearRing`, which **auto-close** — the first point must not be repeated.
  GeoJSON, by contrast, *requires* the closing point. Our wrapper must accept either and
  normalise, so users never have to think about it.
- `data.add({ geometry, id?, properties? })` returns a `google.maps.Data.Feature`.

### What `google.maps.Data` actually provides

Verified against `@types/google.maps` (`index.d.ts:605-742`). The complete method list:

`add`, `addGeoJson`, `contains`, `forEach`, `getControlPosition`, `getControls`,
`getDrawingMode`, `getFeatureById`, `getMap`, `getStyle`, `loadGeoJson`, `overrideStyle`,
`remove`, `revertStyle`, `setControlPosition`, `setControls`, `setDrawingMode`, `setMap`,
`setStyle`, `toGeoJson`.

And `google.maps.Data.Feature`: `forEachProperty`, `getGeometry`, `getId`, `getProperty`,
`removeProperty`, `setGeometry`, `setProperty`, `toGeoJson`.

Notably **absent**, and therefore additions on our side if we want them: `clear()`,
`filter()`, `find()`, any way to get an array of features, and any count.

### Other rough edges to smooth over

- `loadGeoJson()` is callback-based; `addGeoJson()` is synchronous. Both should return a Promise.
- `toGeoJson()` is callback-based. Promisify.
- Removing all features requires `forEach` + `remove`.
- Feature properties come out one key at a time via `getProperty()`; there is no plain object.
- Mouse events hand back `google.maps.Data.MouseEvent`, not our objects.
- Getting the bounds of the data requires walking every geometry type by hand.

---

## 3. Decisions

| Decision | Choice | Reason |
|---|---|---|
| Class name / location | `DataLayer` in `src/lib/DataLayer.ts` | Everything in `src/lib/Map/` is map *configuration* (controls, restriction, map styles). A data layer is a drawable thing and belongs beside `Polyline`. The stub `src/lib/Map/Data.ts` is removed. |
| Factory | `dataLayer(options?)` | Matches `polyline()`, `marker()`, `map()`. |
| Base class | `extends Layer` | Gets `setMap()`, `isVisible`, `init()`, `onReady()`, and the `attachPopup`/`attachTooltip` mixins (`Popup.ts:907`, `Tooltip.ts:443`) for free. |
| `map.setStyle()` | **Not added** | Collides with map styling, which already exists (`MapStyle`, `MapOptions.styles`). Data styling goes through `map.data.setStyle()`. |
| `map.loadGeoJson()` / `map.addGeoJson()` | Kept as thin sugar over `map.data` | Already the interface the user wants; costs nothing. |
| Feature wrapper | `DataFeature extends Layer` | Needed for bounds, plain-object properties, and to keep raw Google objects out of callbacks. |
| Array-like access | `getFeatures()` only — no `filter()`/`find()`/`getCount()` | `getFeatures()` returns an array, which hands the user all of `Array.prototype` for free. One concept instead of four, and there is no precedent for predicate methods in the library (the `*Collection` classes are tag-based). |
| Render mode | Native rendering only | `render: 'native' \| 'objects'` is designed for but deferred. See section 7. |
| Standalone `Polygon` class | Out of scope | Separate follow-up, section 9. |

---

## 4. File layout

```
src/lib/DataLayer.ts      -- DataLayer class + dataLayer() factory + option/style types
src/lib/DataFeature.ts    -- DataFeature class + dataFeature() factory
src/lib/Map.ts            -- add `data` getter, loadGeoJson(), addGeoJson()
src/lib/constants.ts      -- DataLayerEvents, GeometryType
src/index.ts              -- export the classes, factories and types
src/lib/Map/Data.ts       -- DELETE (stub, superseded)
```

---

## 5. Public interface (v1)

### 5.1 Map additions

```ts
map.data                                  // DataLayer -- lazily created, memoized, same instance every call
map.loadGeoJson(url, options?)            // Promise<DataFeature[]> -- sugar for map.data.loadGeoJson()
map.addGeoJson(geoJson, options?)         // Promise<DataFeature[]> -- sugar for map.data.addGeoJson()
```

`map.data` must not construct anything before the map exists — the `DataLayer` it returns
handles the waiting internally (section 6).

### 5.2 Constructing a layer

```js
// A) the map's own data layer
map.data.setStyle({ fillColor: '#4caf50' });
map.loadGeoJson('/parcels.json');

// B) an additional layer
const parcels = dataLayer({ geoJson: '/parcels.json', style: { fillColor: '#4caf50' } });
parcels.setMap(map);
```

### 5.3 `DataLayerOptions`

```ts
type DataLayerOptions = {
    map?: Map;
    geoJson?: string | string[] | object;    // url(s) or inline object; loaded on construction
    style?: DataStyleValue;
    fitBounds?: boolean;                     // fit the map to the data once loaded
    idProperty?: string;                     // -> Google's idPropertyName
    visible?: boolean;
    data?: CustomData;                       // custom data on the layer, matching Polyline/Marker
};

type DataLayerValue = DataLayer | DataLayerOptions;
```

### 5.4 `DataLayer` methods

Mutators are **synchronous and chainable** (they queue internally, matching `Polyline`'s
`set*` methods). Anything that produces data returns a **Promise**.

```ts
// -- Loading --------------------------------------------------------------
loadGeoJson(url: string | string[], options?: LoadOptions): Promise<DataFeature[]>
addGeoJson(geoJson: object, options?: LoadOptions): Promise<DataFeature[]>
toGeoJson(): Promise<object>

type LoadOptions = {
    idProperty?: string;
    replace?: boolean;        // clear existing features first -- the common "redraw" case
    fitBounds?: boolean;
};
```

`loadGeoJson()` accepting an array of URLs resolves once every file has loaded, with the
combined features. (`Promise.all` over the single-URL path — near-zero cost.)

```ts
// -- Adding geometry directly (the docs' polygon example) -----------------
addPolygon(paths: LatLngValue[] | LatLngValue[][], options?: FeatureOptions): Promise<DataFeature>
addPolyline(path: LatLngValue[], options?: FeatureOptions): Promise<DataFeature>
addPoint(position: LatLngValue, options?: FeatureOptions): Promise<DataFeature>

type FeatureOptions = {
    id?: string | number;
    properties?: CustomData;
    style?: DataStyleOptions;      // applied via overrideStyle on this feature
};
```

`addPolygon()` accepts:
- `LatLngValue[]` — a single outer ring, no holes.
- `LatLngValue[][]` — outer ring first, holes after.

and every `LatLngValue` form the library already supports (`LatLng`, `{lat, lng}`,
`{latitude, longitude}`, `[lat, lng]`). Closing points are optional and stripped.

The Google docs example becomes:

```js
map.data.addPolygon([outerCoords, innerCoords1, innerCoords2]);
```

```ts
// -- Styling --------------------------------------------------------------
setStyle(style: DataStyleValue): DataLayer          // object or (feature) => style
overrideStyle(feature: DataFeature | string | number, style: DataStyleOptions): DataLayer
revertStyle(feature?: DataFeature | string | number): DataLayer

// -- Features -------------------------------------------------------------
getFeature(id: string | number): Promise<DataFeature | undefined>   // wraps getFeatureById
getFeatures(): Promise<DataFeature[]>                               // addition -- Google has forEach only
forEach(callback: (f: DataFeature) => void): Promise<DataLayer>
contains(feature: DataFeature): Promise<boolean>
remove(feature: DataFeature | string | number): DataLayer
clear(): DataLayer                                                  // addition -- Google has no clear()

// -- Map / bounds ---------------------------------------------------------
setMap(map: Map | null): Promise<DataLayer>
show(map?: Map): Promise<DataLayer>
hide(): DataLayer
getBounds(): Promise<LatLngBounds>
fitBounds(): Promise<DataLayer>

// -- Escape hatch ---------------------------------------------------------
toGoogle(): Promise<google.maps.Data>
```

Getters/setters mirroring the chainable methods, per `Polyline`'s pattern: `map`, `style`,
`visible`, `data`.

### 5.5 Styles

`DataStyleOptions` uses this library's naming (matching `PolylineOptions`), not Google's:

```ts
type DataStyleOptions = {
    clickable?: boolean;
    cursor?: string;
    draggable?: boolean;
    editable?: boolean;
    fillColor?: string;
    fillOpacity?: number | string;
    icon?: IconValue | SvgSymbolValue | string;   // our objects, not google.maps.Icon
    strokeColor?: string;
    strokeOpacity?: number | string;
    strokeWeight?: number | string;
    title?: string;
    visible?: boolean;
    zIndex?: number | string;
};

type DataStyleValue = DataStyleOptions | ((feature: DataFeature) => DataStyleOptions);
```

Accepting our `Icon` / `SvgSymbol` objects (and a bare URL string) for `icon` is the one
styling abstraction kept in v1 — Google requires a `google.maps.Icon` literal. The
function form of `setStyle()` covers conditional styling for now; see section 8 for the
declarative version.

### 5.6 Events

```ts
onClick(cb: (feature: DataFeature, position: LatLng, event) => void): void
onDblClick / onMouseOver / onMouseOut / onRightClick
onAddFeature / onRemoveFeature
onLoad(cb): void      // custom -- fires when a loadGeoJson()/addGeoJson() call finishes
onReady(cb): void     // from Layer
```

Callbacks receive a `DataFeature` and a `LatLng`, never a raw
`google.maps.Data.MouseEvent`. The raw event stays available as the third argument.

Add `DataLayerEvents` to `constants.ts` following `PolylineEvents`, including
`READY: READY_EVENT`. The remaining Google events (`mousedown`, `mouseup`, `contextmenu`,
`setgeometry`, `setproperty`, `removeproperty`) go in the constants list so `on()` accepts
them, but get no dedicated `on*` helper until someone needs one.

### 5.7 `DataFeature`

Extends `Layer`, so `attachPopup()` / `attachTooltip()` come along from the existing
mixins and work per feature.

```ts
feature.id                                  // string | number | undefined
feature.properties                          // plain object -- Google forces one getProperty() per key
feature.geometryType                        // 'Point' | 'LineString' | 'Polygon' | 'MultiPolygon' | ...
feature.getProperty(key) / setProperty(key, value) / removeProperty(key)
feature.getPath(): LatLng[]                 // LineString / single-ring geometry
feature.getPaths(): LatLng[][]              // Polygon: outer ring first, then holes
feature.getPosition(): LatLng               // Point geometry
feature.getBounds(): LatLngBounds
feature.setStyle(style): DataFeature        // -> layer.overrideStyle()
feature.resetStyle(): DataFeature           // -> layer.revertStyle()
feature.remove(): void
feature.toGeoJson(): Promise<object>
feature.toGoogle(): google.maps.Data.Feature
```

---

## 6. Internal design — waiting for the map

Every public call funnels through one private accessor:

```ts
#getGoogleData(): Promise<google.maps.Data>
```

- **Default-layer mode** (constructed by `Map`): `await map.init()` then
  `map.toGoogle().data`. Mirrors `Map.panTo()` (`Map.ts:1583`).
- **Standalone mode**: `await loader().onMapLoad()` then `new google.maps.Data()`.
  Mirrors `Polyline.#setupGooglePolyline()` (`Polyline.ts:1145`).

A standalone layer only needs the **API loaded**, not a map. So
`dataLayer().loadGeoJson(url)` can run and buffer features before any map exists;
`setMap(map)` attaches the whole populated layer later. Worth calling out in the docs — it
is a meaningful improvement over the raw API.

Ordering is guaranteed by chaining every queued call onto a single internal promise chain
(`#pendingChain: Promise<void>`), so `loadGeoJson()` followed by `setStyle()` always
applies in that order regardless of when the map becomes ready.

Idempotency: `#getGoogleData()` memoizes, so the underlying `google.maps.Data` is created
exactly once per `DataLayer`.

---

## 7. Forward compatibility: render modes (deferred)

Native rendering means features are drawn by `google.maps.Data` and therefore cannot use
any of this library's existing machinery — no `PolylineCollection` tags, no per-feature
`highlight()`, no `Marker` tooltips.

A future `render: 'native' | 'objects'` option would convert loaded GeoJSON into our own
`Polygon` / `Polyline` / `Marker` objects instead. **Not being built now**, but the design
must not preclude it:

- Keep GeoJSON parsing (feature -> geometry + properties) in a standalone helper rather
  than inlining it in `loadGeoJson()`, so an object renderer can reuse it.
- `DataFeature` is the return type of every public method, so an object-rendered feature
  can present the same surface while wrapping a `Polygon` instead of a `Data.Feature`.
- Do not let `google.maps.Data.Feature` leak into any public signature except `toGoogle()`.
- Add `render` to `DataLayerOptions` typing only when it is implemented, defaulting to
  `'native'`.

---

## 8. Deliberately left out of v1

Not rejected — just not first. Each is additive and none of them change the v1 shape.

| Left out | Note |
|---|---|
| `styleBy(property, styles, fallback)` | Declarative "colour by a property", which is the most common real use of `setStyle`. The function form of `setStyle()` covers it in v1; this is the first thing to add back. |
| `setHoverStyle()` | Auto `overrideStyle`/`revertStyle` on mouseover/mouseout. Users can wire it with `onMouseOver`/`onMouseOut` + `overrideStyle()` for now. |
| Drawing UI — `setDrawingMode()`, `setControls()`, `setControlPosition()` | Lets users draw points/lines/polygons on the map. Self-contained; add when there is a use for it. |
| `attachPopup()` / `attachTooltip()` with `{property}` templates | `DataFeature` inherits the mixins, so per-feature popups already work; the layer-wide template sugar is the deferred part. Note the mixin attaches to the layer as a whole, so `DataLayer` would need to override both to bind per feature. |
| `filter()`, `find()`, `getCount()` | Cut in favour of `getFeatures()` returning an array — `(await layer.getFeatures()).filter(...)` gets `Array.prototype` for free. |
| Tag support for features | à la `PolylineCollection`. `styleBy()` likely covers the real need. |
| `setGeometry` / `setProperty` / `removeProperty` / `mousedown` / `mouseup` / `contextmenu` event helpers | Reachable through `on()`; no dedicated helpers yet. |

---

## 9. Follow-up, out of scope for this plan

**Standalone `Polygon` class** (`src/lib/Polygon.ts`, `polygon()`, `PolygonCollection`)
wrapping `google.maps.Polygon`. The library has `Polyline` but no `Polygon`, and
`Polyline` cannot fill or hold holes. `Polyline.ts` is the template to copy. A
`DataFeature.toPolygon()` bridge would connect the two, and it is a prerequisite for
`render: 'objects'`.

---

## 10. Implementation phases

**Phase 1 — core** (done)
1. `constants.ts`: `DataLayerEvents`, `GeometryType`.
2. `DataFeature` class + factory: properties, geometry accessors, bounds, `toGoogle()`.
3. `DataLayer` skeleton: `extends Layer`, options, `#getGoogleData()`, promise chain,
   `setMap`, `show`/`hide`, `toGoogle()`, `onReady`.
4. `loadGeoJson()`, `addGeoJson()`, `toGeoJson()`, `clear()`, `remove()`.
5. `Map.data` getter, `Map.loadGeoJson()`, `Map.addGeoJson()`.
6. Delete `src/lib/Map/Data.ts`; export everything from `src/index.ts`.

**Phase 2 — geometry and styling** (done)
7. `addPolygon()` / `addPolyline()` / `addPoint()`, with ring normalisation (accept closed
   or open rings; accept every `LatLngValue` form).
8. `setStyle()` accepting object or function; `overrideStyle()` / `revertStyle()`;
   `Icon` / `SvgSymbol` conversion.

**Phase 3 — interaction and convenience** (done)
9. Event wrappers handing back `DataFeature` + `LatLng`.
10. `getBounds()` / `fitBounds()` + the `fitBounds` option. This is the largest single
    chunk of work in the plan — it means walking `Point`, `LineString`, `LinearRing`,
    `Polygon`, and all the `Multi*` / `GeometryCollection` variants.
11. `getFeature()`, `getFeatures()`, `forEach()`, `contains()`.

**Phase 4 — docs** (done)
12. Update `site-src` docs and the gmaps-docs API reference pages.
13. Examples: load GeoJSON, polygon with holes, style with a function.
14. **Warning on `clear()`**: on the map's default layer (`map.data`) it removes every feature,
    including any another part of the app added, because Google gives one shared data layer per
    map. Point at `dataLayer()` for a layer the caller owns outright. Same warning on
    `LoadOptions.replace`, which clears before loading.

What phase 4 actually produced:

In this repo — `site-src/datalayer.njk` and `site-src/js/datalayer.js` (a test page covering the
polygon-with-holes example, a separate layer, style-by-property, hover styling and click events),
a nav entry in `site-src/_includes/base.njk`, and an Unreleased section in `CHANGELOG.md`.

In the Gmaps-Docs repo (`../Gmaps-Docs`) — new `api-reference/data-layer.md` and
`api-reference/data-feature.md`; `DataLayerEvents` and `GeometryType` added to
`api-reference/constants.md`; the `data` property and the `addGeoJson()` / `loadGeoJson()` methods
added to `api-reference/map.md`; two guides under `guides/data-layer/` (`polygons.md` and
`shared-map-layer.md`, the latter being the `clear()` warning in long form); and `sidebars.ts`
updated for all four new pages. Verified with a Docusaurus production build to a scratch
directory — the site has `onBrokenLinks: 'throw'`, and it built with no broken links or anchors.
Nothing in that repo is committed.

---

## 11. Resolved questions

1. **`map.data` is lazy + memoized.** Nothing is constructed until the first access, so maps
   that never touch the data layer pay nothing. The instance is then cached on the `Map`, so
   `map.data` is reference-stable for the rest of the map's life and repeated access does not
   create competing layers.
2. **`clear()` gets an explicit warning in the docs.** On the map's *default* data layer it
   removes every feature, including any added by other code, because Google gives one shared
   layer per map. The docs must say so and point at `dataLayer()` as the way to get a layer you
   own outright. Phase 4 covers it.

---

## 12. Notes from implementation

- **Event payloads.** The plan originally had `onClick((feature, position, event) => ...)`.
  That breaks the library's event convention, where every callback takes a single `Event`
  object. Implemented instead as `Event.feature`, alongside the existing `latLng`, `pixel`
  and `placeId` fields: `onClick((event) => event.feature.getProperty('name'))`. This needed
  a three-line addition to `Evented.dispatch()` mirroring how `placeId` is copied, and
  `DataLayer.dispatch()` wraps the raw `google.maps.Data.Feature` into a `DataFeature` on the
  way through, so no Google object reaches a callback.
- **`getBounds()` was far cheaper than estimated.** Every `google.maps.Data.Geometry` class
  implements `forEachLatLng()`, which walks nested geometries recursively. There is no need to
  branch on `Point` / `LineString` / `Polygon` / `Multi*` / `GeometryCollection` by hand.
- **Style functions must be synchronous.** Google calls the style function per feature and uses
  the return value immediately. `Icon.toGoogle()` is synchronous so it is fine, but
  `SvgSymbol.toGoogle()` returns a Promise. Handled by caching resolved symbols and re-applying
  the style once a symbol resolves, which makes Google re-evaluate every feature.
- **Circular import.** `Map` imports `DataLayer` (for the `data` getter) and `DataLayer` imports
  `Map` (for `instanceof`). Safe because neither is used during module evaluation — only inside
  methods — the same shape as `Layer` <-> `Map`. Verified by loading the built bundle.
- **`toGoogle()` waits on the queue.** It first returned the Data object as soon as it existed,
  which meant `await layer.toGoogle()` could hand back an object that queued calls had not been
  applied to yet. It now goes through the queue like every other call. `init()` deliberately does
  not — it only needs the object to exist, so that attaching a tooltip doesn't wait on a load.
- **`setStyle()` replaces rather than merges**, matching the Google maps API. Documented on the
  method, because `Polyline.setOptions()` merges and the difference is easy to trip over.
- **`setMap()` calls `map.init()` outside the queue.** A standalone layer waits on the loader's
  load event, and the map is what makes the library load. Doing it inside the queue would
  deadlock: the queued call is waiting for the very thing it was going to trigger.

### Verified with

A stubbed `google.maps` and the built CJS bundle, in two scripts: 49 checks over polygons with
holes, ring normalisation, features, styles, events, loading, and `map.data` memoization; and 9
checks over the deferred path, where a layer is created and used before the Google maps library
exists and everything replays in order once it loads. Both are in the session scratchpad, not the
repo — this project has no test runner set up (`npm test` is still the placeholder).
