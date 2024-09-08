/* ===========================================================================
    Holds the different types for a Map object
=========================================================================== */

import { Libraries } from '@googlemaps/js-api-loader';
import { LatLng, LatLngValue } from '../LatLng';
import { FullscreenControl } from './FullscreenControl';
import { MapTypeControl } from './MapTypeControl';
import { MapTypeIdValue, RenderingTypeValue } from '../constants';
import { MapRestrictionValue } from './MapRestriction';
import { MapStyleValue } from './MapStyle';
import { RotateControlValue } from './RotateControl';

// The options that will be passed to the Google Maps map object
export type GMMapOptions = {
    backgroundColor?: string;
    center?: LatLng;
    clickableIcons?: boolean;
    colorScheme?: string;
    controlSize?: number;
    disableDefaultUI?: boolean;
    draggableCursor?: string;
    draggingCursor?: string;
    fullscreenControl?: boolean;
    fullscreenControlOptions?: google.maps.FullscreenControlOptions;
    gestureHandling?: string;
    heading?: number;
    headingInteractionEnabled?: boolean;
    isFractionalZoomEnabled?: boolean;
    keyboardShortcuts?: boolean;
    mapId?: string;
    mapTypeControl?: boolean;
    mapTypeControlOptions?: google.maps.MapTypeControlOptions;
    mapTypeId?: google.maps.MapTypeId | string;
    maxZoom?: number;
    minZoom?: number;
    noClear?: boolean;
    renderingType?: google.maps.RenderingType;
    restriction?: google.maps.MapRestriction;
    rotateControl?: boolean;
    rotateControlOptions?: google.maps.RotateControlOptions;
    scrollwheel?: boolean;
    styles?: google.maps.MapTypeStyle[];
    tilt?: number;
    tiltInteractionEnabled?: boolean;
    zoom?: number;
};

// The options that are passed to map() and setOptions()
// Some of the options are part of the available google.maps.MapOptions:
// https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions
export type MapOptions = {
    // The Google Maps API key
    apiKey?: string;
    // The background color of the map. This can be any valid CSS color value. The color will be visible
    // when the tiiles have not yet loaded as the user pans. This option can only be set when the map is initialized.
    // https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.backgroundColor
    backgroundColor?: string;
    // The center point for the map.
    // This is an alternate to setting the latitude and longitude separately.
    center?: LatLngValue;
    // Whether the map icons are clickable or not. Defaults to true.
    // https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.clickableIcons
    clickableIcons?: boolean;
    // The initial Map color scheme. This option can only be set when the map is initialized.
    // https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.colorScheme
    colorScheme?: string;
    // The size in pixels of the controls on the map that are made by the Maps JavaScript API. This does not apply to custom controls.
    // This can only be set when the map is initialized.
    // https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.controlSize
    controlSize?: number;
    // Enables or disables the default UI.
    // https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.disableDefaultUI
    disableDefaultUI?: boolean;
    // The name or url of the cursor to display when mousing over a draggable map.
    // https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.draggableCursor
    draggableCursor?: string;
    // The name or url of the cursor to display when the map is being dragged.
    // https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.draggingCursor
    draggingCursor?: string;
    // The fullscreen control object to configure how the Fullscreen control displayed,
    // or a boolean to disable/enable the Fullscreen control.
    // https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.fullscreenControl
    fullscreenControl?: boolean | FullscreenControl;
    // This controls how the API handles gestures on the map.
    // https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.gestureHandling
    gestureHandling?: string;
    // Sets the heading for aerial imagery in degrees measured clockwise from cardinal direction North.
    // https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.heading
    heading?: number;
    // Whether the map should allow user control of the camera heading (rotation).
    // https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.headingInteractionEnabled
    headingInteractionEnabled?: boolean;
    // Whether the map should allow fractional zoom levels.
    // https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.isFractionalZoomEnabled
    isFractionalZoomEnabled?: boolean;
    // Whether to allow the map to be controlled by the keyboard. By default, this is set to true.
    // https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.keyboardShortcuts
    keyboardShortcuts?: boolean;
    // The latitude for the center point of the map
    lat?: number | string;
    latitude?: number | string;
    // An array of additional Maps JavaScript API libraries to load. By default no extra libraries are loaded.
    // The "places" library is a common one to load. https://developers.google.com/maps/documentation/javascript/places
    // https://developers.google.com/maps/documentation/javascript/libraries
    libraries?: Libraries;
    // The longitude for the center point of the map
    lng?: number | string;
    longitude?: number | string;
    // The Google Maps identifier for the map.
    // See https://developers.google.com/maps/documentation/get-map-id
    mapId?: string;
    // The map type control object to configure how the Map Type control displayed,
    // or a boolean to disable/enable the Map Type control.
    // https://developers.google.com/maps/documentation/javascript/controls
    mapTypeControl?: boolean | MapTypeControl;
    // The map type ID to use for the map.
    mapTypeId?: MapTypeIdValue | string;
    // The maximum zoom level which will be displayed on the map.
    // If omitted, or set to null, the maximum zoom from the current map type is used instead.
    // Valid zoom values are numbers from zero up to the supported maximum zoom level.
    // https://developers.google.com/maps/documentation/javascript/maxzoom
    maxZoom?: number;
    // The minimum zoom level which will be displayed on the map.
    // If omitted, or set to null, the minimum zoom from the current map type is used instead.
    // Valid zoom values are numbers from zero up to the supported maximum zoom level.
    minZoom?: number;
    // Whether to clear the contents of the map div. If true, then the map div contents will not be cleared.
    // https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.noClear
    noClear?: boolean;
    // The rendering type for the map. This sets if it should be a raster or vector map.
    // https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.renderingType
    renderingType?: RenderingTypeValue;
    // The boundry to restrict the map to. When set the user can only pan and zoom within this latitude/longitude bounds.
    // https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.restriction
    restriction?: MapRestrictionValue;
    // The Rotate control object to configure how the Rotate control displayed,
    // or a boolean to disable/enable the Rotate control.
    // https://developers.google.com/maps/documentation/javascript/controls
    rotateControl?: RotateControlValue;
    // Whether to enable or disable zooming with the mouse scroll wheel. Defaults to true.
    // https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.scrollwheel
    scrollwheel?: boolean;
    // The styles to apply to the map types.
    // https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.styles
    styles?: MapStyleValue;
    // For vector maps, this sets the angle of incidence of the map.
    // https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.tilt
    tilt?: number;
    // Whether the map should allow user control of the camera tilt.
    // https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.tiltInteractionEnabled
    tiltInteractionEnabled?: boolean;
    // The version of the Google Maps API to load.
    // https://developers.google.com/maps/documentation/javascript/versions
    version?: string;
    // The default zoom for the map. Defaults to 8.
    zoom?: number | string;
};

// The options for the Map.locate() function
export type LocateOptions = {
    // Indicates if the application would like to receive the best possible results.
    // If true and if the device is able to provide a more accurate position, it will do so.
    // This can result in slower response times or increased power consumption on a mobile device.
    // If false then the device can save resources by responding more quickly.
    // Default: false.
    enableHighAccuracy?: boolean;
    // The maximum age in milliseconds of a possible cached position that is acceptable to return.
    // If set to 0, it means that the device cannot use a cached position and must attempt to retrieve the real
    // current position. If set to Infinity the device must return a cached position regardless of its age.
    // Default: 0
    maximumAge?: number;
    // The maximum time in milliseconds the device is allowed to take in order to return a position.
    // The default value is Infinity, meaning that getCurrentPosition() won't return until the position is available.
    // Default: Infinity
    timeout?: number;
    // Whether ot use watchPosition to track the user's location. It set to false, the user's location will only be
    // retrieved once.
    // Default true
    watch?: boolean;
};

// The data returned from the Geolocation API and sent to the 'locationfound' event
export type LocationPosition = {
    accuracy?: number;
    altitude?: number;
    altitudeAccuracy?: number;
    heading?: number;
    latitude: number;
    latLng: LatLng;
    longitude: number;
    speed?: number;
    timestamp: number;
};

// The callback function for the Map.locate() function
export type LocationOnSuccess = (position: LocationPosition) => void;
