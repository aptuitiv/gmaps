/* ===========================================================================
    Main file for the Google Map Display library
=========================================================================== */

import { latLng } from './lib/LatLng';
import { map } from './lib/Map';
import { marker } from './lib/Marker';
import GlobalObj from './types';

// Set up the global namespace object
const G: GlobalObj = {
  latLng,
  map,
  marker,
};

function getGlobalObject() {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }
  if (typeof self !== 'undefined') {
    return self;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof global !== 'undefined') {
    return global;
  }

  throw new Error('Unable to locate global object.');
}

getGlobalObject().G = G;
