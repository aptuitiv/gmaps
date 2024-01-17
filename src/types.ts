import { latLng } from './lib/LatLng';
import { map } from './lib/Map';
import { marker } from './lib/Marker';

type GlobalObj = {
  latLng: typeof latLng;
  map: typeof map;
  marker: typeof marker;
};

export default GlobalObj;
