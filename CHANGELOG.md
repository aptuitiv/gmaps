# Changelog
<!-- markdownlint-disable MD024 -->

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
