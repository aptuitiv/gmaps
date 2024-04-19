# Changelog

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
