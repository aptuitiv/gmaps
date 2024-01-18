import { icon } from './lib/Icon';
import { latLng } from './lib/LatLng';
import { latLngBounds } from './lib/LatLngBounds';
import { map } from './lib/Map';
import { marker } from './lib/Marker';
import { markerCluster } from './lib/MarkerCluster';
import { point } from './lib/Point';
import { size } from './lib/Size';

type GlobalObj = {
    icon: typeof icon;
    latLng: typeof latLng;
    latLngBounds: typeof latLngBounds;
    map: typeof map;
    marker: typeof marker;
    markerCluster: typeof markerCluster;
    point: typeof point;
    size: typeof size;
};

export default GlobalObj;
