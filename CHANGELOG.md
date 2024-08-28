# Changelog

## 0.13.0 (August 28, 2024)

- Added `open` event for the popup.
- Return the popup object when using `attachPopup`.

## 0.12.0 (August 23, 2024)

- Added `closeAllPopups()` method to close all open popups.
- Added AutocompleteSearchBox component.
- Added `onPlacesChanged()` method to the PlacesSearchBox component.

## 0.11.0 (August 14, 2024)

- Map - Added methods to get the bounds, get the map div, and pan the map by a specfic amount.
- Popup - Changed the popup to not have a theme by default.
- Popup - Added support for panning the map to fit the popup.
- Popup - Added support for setting the clearance from the map viewport.
- Bug fixes.

## 0.10.0 (July 13, 2024)

- Brought back the class exports for the browser library so that custom plugins can be used.
- Added event option and property to InfoWindow, Popup, and Tooltip. This is an alternate way to set the trigger event to show the InfoWindow, Popup, or Tooltip.
- Added Map fitToBounds as an alias to fitBounds.
- Updated LatLngBounds to load the google object on demand. This allows the LatLngBounds object to be used before the Google Maps library has loaded. For example, adding marker positions to a map bounds before the Map libray was loaded.
- Added map panTo() method.
- Bug fixes.

## 0.9.0 (May 2, 2024)

- Added support for adding a custom control to the map.
- Added layer `hasMap()` method.
- Restricted tooltips, popups, and InfoWindows to only be attached to an element if they aren't already attached to something. This is intended to prevent attaching them to an element multiple times.

## 0.8.0 (May 1, 2024)

- Minor bug fixes.
- Added support for setting the map bounds on the map object.
- Added tooltip option to the Polyline object.

## 0.7.0 (April 26, 2024)

- Added support for using the library in nodejs.
- Improvements to how events are handled internally.
- Added support for `only` aond `onlyOnce` event listener types.
- Map:
  - Added support for enabling/disabling the Map Type control.
  - Added support for setting the map type id.
  - Added support for min and max zoom.
  - Added support for separately setting the latitude and longitude of the map center point.
  - Added `getIsVisible()` method.
- Overlay:
  - Added `overlay()` method to set up an overlay element.
  - Added `getProjection()` method.
  - Added `getContainerLatLngFromPixel()` method.
  - Added `getDivLatLngFromPixel()` method.
- Added support for `google.maps.LatLng` to be passed as a value to the LatLng class.
- Fixed svgSymbol default fillOpacity to be 1.
- Added support for the marker to be draggable.
- Allow LatLngBoungs union to get a `google.maps.LatLngBounds` value.
- Added event types to different components.
- Added PlacesSearchBox component.
  
## 0.6.0 (April 19, 2024)

- Added support for the Map `mapId` parameter.
- Started adding support for AdvancedMarker. It's still a work in progress. There are some limitations that AdvancedMarker has compared to Marker (such as hover events). We're waiting to see if Google provides more updates.
- Added support for Polylines.
- Added PolylineCollection.
- Added MarkerCollection.

## 0.5.0 (April 17, 2024)

- Updated how popups and InfoWindows can be attached to elements.
- Added default styles to popup.
- Updated Evented to support running an event callback immediately if the event has already been dispatched.
- Updated Evented method signatures for setting up events to use a configuration object for some parameters.
- Added Overlay `move()` method.

## 0.4.0 (April 11, 2024)

- Updated build process to build a separate browser Javascript file from the node Javascript files.
- Lots of other updates.

## 0.3.0 (February 6, 2024)

- Added separate Loader object to load the map library.
- Improved event handling when the map library isn't loaded yet.
- Added support for on-time events on the Map and Marker objects.
- Lots of code refactoring.
- Added local site to for testing.
- Expanded LatLng and LatLngBounds functionality.

## 0.2.0 (January 30, 2024)

- Added support for InfoWindow.
- Added support for Tooltip.

## 0.1.0 (January 28, 2024)

Initial release.

- Create a Google map and attach events.
- Create markers and display them on a map.
- Attach events to markers.
- Set up lat/lng bounds with markers.
