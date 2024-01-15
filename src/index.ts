/* ===========================================================================
    Main file for the Google Map Display library
=========================================================================== */

import { InitConfig, Map } from './lib/Map';

const map = (id: string, config: InitConfig) => new Map(id, config);

const GMD = {
  map,
};

window.GMD = GMD;
