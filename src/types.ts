import { icon } from './lib/Icon';
import { latLng } from './lib/LatLng';
import { map } from './lib/Map';
import { marker } from './lib/Marker';
import { point } from './lib/Point';

type GlobalObj = {
    icon: typeof icon;
    latLng: typeof latLng;
    map: typeof map;
    marker: typeof marker;
    point: typeof point;
};

export default GlobalObj;
