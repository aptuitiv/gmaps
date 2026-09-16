# Changelog
<!-- markdownlint-disable MD024 -->

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- Added the `DataLayer` class and the `dataLayer()` function to work with the [Google maps data layer](https://developers.google.com/maps/documentation/javascript/datalayer). It can either wrap the map's own data layer or be a separate layer of its own.
- Added the `DataFeature` class to represent a single feature within a data layer. It extends `Layer` so tooltips and popups can be attached to a feature.
- Added `map.data` to get the map's own data layer. The layer is created the first time it's used and the same object is returned after that.
- Added `map.loadGeoJson()` and `map.addGeoJson()` as shortcuts to the matching methods on `map.data`.
- Added `DataLayer.addPolygon()` to add a polygon, with or without holes in it, without needing to build GeoJson. It takes either one path of positions or an array of paths, where the first is the outer edge and the rest are holes.
- Added `DataLayer.addPolyline()` and `DataLayer.addPoint()`.
- Added `DataLayer.clear()` to remove every feature from the layer. The Google maps API doesn't provide a way to do this.
- Added `DataLayer.getFeatures()`, which returns the features as an array. The Google maps API only provides `forEach()`.
- Added `DataLayer.loadGeoJson()`, `DataLayer.addGeoJson()` and `DataLayer.toGeoJson()`. These return promises rather than taking a callback like the Google maps API does. `loadGeoJson()` also accepts an array of urls and resolves once all of them have loaded.
- Added support for passing a function to `attachPopup()` on any layer or on the map. It's called every time the popup is about to be shown, is passed the object the popup is attached to, and returns the content, a `PopupOptions` object, or a `Popup` object to show instead. This lets the popup be worked out when it's shown rather than when it's set up. The `PopupCallback` and `AttachPopupValue` types were added for this, and `Popup.attachTo()` takes an optional third `callback` parameter.
- Added support for passing a function to `attachTooltip()`, the same as `attachPopup()`. The `TooltipCallback` and `AttachTooltipValue` types were added for this, and `Tooltip.attachTo()` takes an optional third `callback` parameter.
- Added `DataLayer.attachTooltip()` and `DataFeature.attachTooltip()`, which work the same way as the popup versions. A data layer can have both a tooltip and a popup attached at once.
- Added `DataLayer.attachPopup()` to attach one popup to every feature in a data layer, and `DataFeature.attachPopup()` to attach one to a single feature. The content can hold `{property}` placeholders that are replaced with the feature's properties, or it can be a `DataPopupCallback` function that is called with the feature and returns the same things as a `PopupCallback`.
- Added `DataFeature.layer` and `DataFeature.getLayer()` to get the data layer that a feature belongs to.
- Added `DataLayerEvents` and `GeometryType` constants.
- Added the `renderTemplate()` helper, which replaces `{placeholder}` values in a string.
- Added `feature` to the event object. It's set on data layer events and holds the `DataFeature` that the event happened on.
- Added the `hideBusinesses`, `hidePointsOfInterest`, and `hideTransit` map options as shortcuts to hide the `poi.business`, `poi`, and `transit` feature types. Each is also available as a property and as a method (`setHideBusinesses()`, `setHidePointsOfInterest()`, `setHideTransit()`) so that they can be changed after the map has been rendered. They're combined with any styles set with the `styles` option. Like other styles, they have no effect when a `mapId` is set.
- Added support for the `stylers` property in `MapStyle` options as an alias of `styles`. This matches the Google Maps `MapTypeStyle` format so Google's style JSON can be used as is.
- Added `PolylineCollection.isEmpty()`. It replaces the misspelled `isEmtpy()` method.
- Added the `simplify` polyline option to draw the path with fewer points while keeping the same shape. This helps with paths that have a lot of points, like GPS tracks, which often have far more points than can be seen on the map. Set a number for how far, in meters, the drawn line can be from the original path, `true` to use 2 meters, or `'zoom'` to use a tolerance that changes with the zoom level. Pass an object to set your own tolerance for different zoom levels. The `path` property still holds every point. It's off unless it's set. `setSimplify()` and the `simplify` property were added to change it later.
- Added the `simplifyDebug` polyline option, which logs to the console how many points are drawn each time the path is simplified, so that it's easy to see whether simplifying is helping. It can also be set with the `debug` simplify option, and with `setSimplifyDebug()` or the `simplifyDebug` property.
- Added the `simplifyPath()` helper to simplify an array of positions on its own, for example before saving them. The `DEFAULT_SIMPLIFY_TOLERANCE` and `DEFAULT_SIMPLIFY_ZOOM` values that it uses are exported as well.
- Added the `optimized` marker option, which is passed to Google to say whether many markers should be drawn together as a single element. Google decides on its own if it isn't set. It has no effect on vector maps. `setOptimized()`, `setOptimizedSync()` and the `optimized` property were added to change it later.

### Changed

- Changed the build target to ES2022. Older targets don't support private class fields, so the build replaced each one with a WeakMap lookup, which is much slower and uses more memory for the objects that are created in large numbers. Creating 500,000 positions went from about 1,250ms to about 55ms, and 20,000 markers went from about 182ms to about 42ms while using about 22% less memory each. A map with 1,400 polylines holding 2.4 million points went from about 12 seconds to well under a second to set up. This requires Safari 15 (iOS 15), Chrome 84, Firefox 90, or Edge 84. See the browser support section of the README.
- Improved the performance of rendering polylines with hover polylines. Nothing is built until the highlight is first needed.
- Improved the performance of showing a tooltip. Only the position is updated as the map is zoomed or panned. The theme styles are set once instead of on every frame.
- Improved the performance of removing event listeners that are only called once. They're now all removed in one pass instead of searching the whole list of listeners for each one. This is noticeable when a lot of markers or polylines are waiting for the map to be ready.
- A polyline that is hidden waits until it's shown again before updating the path it draws when the simplify tolerance changes. This saves work when polylines are hidden with `PolylineCollection.hide()` and the zoom level changes.
- The polyline `setOptions()` method sets the path before the map so that the path is only prepared once when the polyline is created.

### Fixed

- Fixed tooltips and popups never showing on a marker that was set up with one of the `Sync` methods, like `setMapSync()`. Those methods didn't dispatch the marker's `ready` event, which the tooltip and popup wait for before they attach their events to the marker.
- Fixed the highlight polyline keeping the old path when the polyline's path was changed.
- Fixed the previous highlight polyline being left on the map when a new one was set on a polyline. Setting a highlight polyline more than once also added another set of hover event listeners each time.
- Fixed the popup `fit` option having no effect. The map was panned to bring the popup into view even when `fit` was set to `false`.
- Fixed issue with attaching events to the polyline when it has a highlight polyline.
- Fixed the `locationerror` event data not including the error details. The event data now includes the `code` and `message` values from the Geolocation API error.
- Fixed a marker not showing when it was added to a map that hadn't been rendered yet, for example because the map element was hidden. This applied to setting the map in the marker options and to `setMap()`.
- Fixed a marker only showing after the map was panned or zoomed. The marker waited for the map's `idle` event, which may have already happened. It now waits until the map is ready.
- Fixed the `svgIcon` marker option being ignored when the marker was created after the map was ready. The default Google marker icon was shown instead.
- Fixed `G.imageOverlay(url, bounds)` not displaying the image. The image URL passed as the first parameter was never set.
- Fixed the `PlacesSearchBox` bounds not being used if they were set before `init()` was called.
- Fixed the `Geocode` bounds not being sent to Google. The request was sent before the bounds were set.
- Fixed `PlacesSearchBox` and `AutocompleteSearchBox` throwing an error when a place didn't have any geometry. Also fixed the place location not being added to the bounds when the place didn't have a viewport.
- Fixed the `InfoWindow` `disableAutoPan` option having no effect. The value was only saved if it wasn't a boolean. Setting it to `false` in the options now works too.
- Fixed `InfoWindow.toggle()` not opening the info window again after it had been closed.
- Fixed the marker cluster top color range being set as the bottom color range when the color was passed as an object with `bgColor`.
- Fixed a marker label that was a number, like `5`, being ignored. Number labels are now converted to a string.
- Fixed the `MapTypeControl` `hybrid`, `roadmap`, `satellite`, and `terrain` properties not changing the map types shown in the control. Setting one to `false` now removes that map type from the control and setting it to `true` adds it back.
- Fixed the `StreetViewControl` `sources` option not being passed to Google.

## [v0.28.1] - 2025-12-10

### Fixed

- Fixed issue where the marker label was not used if it was set in the initial marker options.

## [0.28.0] - 2025-11-19

### Fixed

- Fixed issue where an image overlay would move after zooming in. The fix was to set the image to be 100% width and height of it's bounds container.

## [0.27.0] - 2025-09-21

### Fixed

- Fixed issue where the map `fitBounds` method wouldn't resolve if there were no bounds.
- Fixed issue with setting up the Marker object and the Google Maps object would get created multiple times.
- Fixed issue where the `bounds_changed` or `zoom_changed` events wouldn't get set up if they were called before the library was totally set up.

## [0.26.0] - 2025-08-06

### Added

- Added support to associate the popup with the Layer it's attached to so that the layer can access the attached popup.
- Added `closePopup`, `getPopup`, `hasPopup`, `openPopup`, and `togglePopup` to Layer. This is available to any class extending Layer like Markers or Polylines.
- Added Overlay `draggable_changed` event to be consistent with Marker drag events.
- Added Overlay `isDraggable` function.
- Added Marker `drag` option. If this is set and `true`, then the Google Maps marker object's `draggable` is set to `true`.

### Changed

- Changed the Marker drag functionality interface to be more consistent with how Overlay handles drag functionality. This involved:
  - Renaming the `draggable` property to `drag`.
  - Adding `disableDrag` and `enableDrag` function.
  - Renaming `getDraggable` function to `isDraggable`.
  - Removing `setDraggable` and `setDraggableSync` as the `disbleDrag` and `enableDrag` methods provide that functionality.

### Fixed

- Fixed issue where the marker anchorPoint is sometimes not defined when opening a popup attached to a marker.
- Fixed issue where the "resize", and "drag" property tests for ImageOverlay were using undefined variables.
- Fixed issue where the Marker object's `getPosition` method and `position` property did not return the current position of the Marker. It was previously only returning the initial position of the marker. It did not reflect is the marker was moved.

## [0.25.0] - 2025-07-13

### Added

- Added support for an image overlay element.
- Added support for resizing overlays.
- Added support for dragging an overlay on the map.

## [0.24.0] - 2025-04-07

### Added

- Added support for overriding highlight options when highlighting in Polyline and PolylineCollection.
- Added support for setting polyline options in the PolylineCollection.

### Changed

- Changed MarkerCollection and PolylineCollection handling of tags. Tags should now be a single string or an array of tags. Also updated the methods that pass “map” to have the tags first and map second.
  
## [0.23.0] - 2025-03-24

## Fixed

- Changed `element.computedStyleMap()` to `getComputedStyle()` becuase Firefox doesn't support `element.computedStyleMap()`.

## [0.22.0] - 2025-03-21

### Added

- Added support for setting a polyline to be dashed.
- Added PolylineIcon object.
- Added support for setting icons on a polyline.

### Changed

- Updated typscript-eslint package.

### Fixed

- Use the image label confirmation over the default label confirmation when setting marker cluster image icons.

## [0.21.0] - 2025-03-17

### Added

- Added support for cloning a Polyline object.

### Changed

- Updated packages.

### Fixed

- Fixed issue where a highlight polyline would show initially. Set it to not show when setting the map. This is necessary so that the highlight polyline isn’t automatically displayed when it’s assigned to a map. It should only show on hover.

## [0.20.0] - 2025-03-14

### Added

- Support for setting the polyline map but not setting it to be visible.

## [0.19.0] - 2025-03-13

### Added

- Support for attaching custom data to the marker and polyline objects.

## [0.18.0] - 2025-02-22

### Added

- `hasData` and `isEmpty` methods to the marker and polyline collection objects.
- `clone` methods to `MarkerCollection` and `PolylineCollection`.
- Methods to set the minimum and maximum zoom levels when fitting the map to a set of bounds.

## [0.17.0] - 2025-02-18

### Added

- Event constants for `Loader`, `Autocomplete Search Box`, `Map`, `Marker`, `PlacesSearchBox`, `Overlay`, and `Popup`.
- Loader `onLoad` and `onMapLoad` methods.
- Multiple "onEVENT" methods for the `Map` object for each of the map events.
- Multiple "onEVENT" methods for the `Marker` object for each of the marker events.

## [0.16.0] - 2024-09-26

### Added

- Support for max and min zoom when fitting bounds.
- `resize` method to `Map`.
- "ready" event to `Marker` after the marker is set up and ready for use.

### Changed

- If the map element is initially hidden then wait until it's visible to set up the map.
- Changed "visible" event to "ready" for `Map`.

## [0.15.0] - 2024-09-23

### Added

- `Geocode` object to support geocoding with the Google Maps API.
- Additional ways to set up the `LatLngBounds` object.

### Updated

- Packages.
- Export types for TypeScript to accurately find the correct types.
- CommonJs output file to have the “.cjs” extension.

## [0.14.1] - 2024-09-10

### Updated

- `caniuse-lite`.
- Trying to fix the `dist/browser.js` as it's missing the new map control objects.

## [0.14.0] - 2024-09-10

### Added

- More `Map` options to offer the same options as the Google Maps library.
- Support for all map controls when configuring the map object.

## [0.13.0] - 2024-08-28

### Added

- `open` event for the popup.
- Return the popup object when using `attachPopup`.

## [0.12.0] - 2024-08-23

### Added

- `closeAllPopups()` method to close all open popups.
- `AutocompleteSearchBox` component.
- `onPlacesChanged()` method to the `PlacesSearchBox` component.

## [0.11.0] - 2024-08-14

### Added

- Methods to get the bounds, get the map div, and pan the map by a specific amount to `Map`.
- Support for panning the map to fit the popup.
- Support for setting the clearance from the map viewport.

### Changed

- Popup to not have a theme by default.

### Fixed

- Bug fixes.

## [0.10.0] - 2024-07-13

### Added

- Brought back the class exports for the browser library so that custom plugins can be used.
- Event option and property to `InfoWindow`, `Popup`, and `Tooltip`. This is an alternate way to set the trigger event to show the `InfoWindow`, `Popup`, or `Tooltip`.
- `fitToBounds` as an alias to `fitBounds` for `Map`.
- `panTo()` method to `Map`.

### Updated

- `LatLngBounds` to load the google object on demand. This allows the `LatLngBounds` object to be used before the Google Maps library has loaded. For example, adding marker positions to a map bounds before the Map library was loaded.

### Fixed

- `svgSymbol` default `fillOpacity` to be 1.

## [0.9.0] - 2024-05-02

### Added

- Support for adding a custom control to the map.
- `hasMap()` method to `layer`.
- Restricted tooltips, popups, and `InfoWindows` to only be attached to an element if they aren't already attached to something. This is intended to prevent attaching them to an element multiple times.

## [0.8.0] - 2024-05-01

### Added

- Minor bug fixes.
- Support for setting the map bounds on the map object.
- Tooltip option to the `Polyline` object.

## [0.7.0] - 2024-04-26

### Added

- Support for using the library in `nodejs`.
- Improvements to how events are handled internally.
- Support for `only` and `onlyOnce` event listener types.
- Support for enabling/disabling the `Map Type` control.
- Support for setting the map type id.
- Support for min and max zoom.
- Support for separately setting the latitude and longitude of the map center point.
- `getIsVisible()` method to `Map`.
- `overlay()` method to set up an overlay element.
- `getProjection()` method to `Overlay`.
- `getContainerLatLngFromPixel()` method to `Overlay`.
- `getDivLatLngFromPixel()` method to `Overlay`.
- Support for `google.maps.LatLng` to be passed as a value to the `LatLng` class.
- Support for the marker to be draggable.
- Allow `LatLngBounds` union to get a `google.maps.LatLngBounds` value.
- Event types to different components.
- `PlacesSearchBox` component.

### Fixed

- `svgSymbol` default `fillOpacity` to be 1.

## [0.6.0] - 2024-04-19

### Added

- Support for the `Map` `mapId` parameter.
- Started adding support for `AdvancedMarker`. It's still a work in progress. There are some limitations that `AdvancedMarker` has compared to `Marker` (such as hover events). We're waiting to see if Google provides more updates.
- Support for `Polylines`.
- `PolylineCollection`.
- `MarkerCollection`.

## [0.5.0] - 2024-04-17

### Added

- Updated how popups and `InfoWindows` can be attached to elements.
- Default styles to popup.
- Updated `Evented` to support running an event callback immediately if the event has already been dispatched.
- Updated `Evented` method signatures for setting up events to use a configuration object for some parameters.
- `move()` method to `Overlay`.

## [0.4.0] - 2024-04-11

### Added

- Updated build process to build a separate browser JavaScript file from the node JavaScript files.
- Lots of other updates.

## [0.3.0] - 2024-02-06

### Added

- Separate `Loader` object to load the map library.
- Improved event handling when the map library isn't loaded yet.
- Support for on-time events on the `Map` and `Marker` objects.
- Lots of code refactoring.
- Local site for testing.
- Expanded `LatLng` and `LatLngBounds` functionality.

## [0.2.0] - 2024-01-30

### Added

- Support for `InfoWindow`.
- Support for `Tooltip`.

## [0.1.0] - 2024-01-28

### Added

- Initial release.
- Create a Google map and attach events.
- Create markers and display them on a map.
- Attach events to markers.
- Set up lat/lng bounds with markers.
