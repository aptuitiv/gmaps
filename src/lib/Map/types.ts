/* ===========================================================================
    Holds the different types for a Map object
=========================================================================== */

import { Libraries } from '@googlemaps/js-api-loader';
import { LatLng, LatLngValue } from '../LatLng';
import { MapTypeControl } from './MapTypeControl';

// The options that will be passed to the Google Maps map object
export type GMMapOptions = {
    center?: LatLng;
    mapId?: string;
    mapTypeControl?: boolean;
    mapTypeControlOptions?: google.maps.MapTypeControlOptions;
    zoom?: number;
};

// The options that are passed to map() and setOptions()
export type MapOptions = {
    // The Google Maps API key
    apiKey: string;
    // The center point for the map.
    // This is an alternate to setting the latitude and longitude separately.
    center?: LatLngValue;
    // The latitude for the center point of the map
    lat: number | string;
    latitude: number | string;
    // An array of additional Maps JavaScript API libraries to load. By default no extra libraries are loaded.
    // The "places" library is a common one to load. https://developers.google.com/maps/documentation/javascript/places
    // https://developers.google.com/maps/documentation/javascript/libraries
    libraries?: Libraries;
    // The longitude for the center point of the map
    lng: number | string;
    longitude: number | string;
    // The Google Maps identifier for the map.
    // See https://developers.google.com/maps/documentation/get-map-id
    mapId?: string;
    // The map type control object to configure how the Map Type control displayed,
    // or, false to disable the Map Type control.
    // https://developers.google.com/maps/documentation/javascript/controls
    mapTypeControl?: boolean | MapTypeControl;
    // The version of the Google Maps API to load.
    // https://developers.google.com/maps/documentation/javascript/versions
    version?: string;
    // The default zoom for the map. Defaults to 8.
    zoom?: number;
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
