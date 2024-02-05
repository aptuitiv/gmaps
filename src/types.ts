import { icon } from './lib/Icon';
import { infoWindow } from './lib/InfoWindow';
import { latLng } from './lib/LatLng';
import { latLngBounds } from './lib/LatLngBounds';
import { loader } from './lib/Loader';
import { map } from './lib/Map';
import { marker } from './lib/Marker';
import { markerCluster } from './lib/MarkerCluster';
import { point } from './lib/Point';
import { popup } from './lib/Popup';
import { size } from './lib/Size';
import { svgSymbol } from './lib/SvgSymbol';
import { tooltip } from './lib/Tooltip';

type GlobalObj = {
    icon: typeof icon;
    infoWindow: typeof infoWindow;
    latLng: typeof latLng;
    latLngBounds: typeof latLngBounds;
    loader: typeof loader;
    map: typeof map;
    marker: typeof marker;
    markerCluster: typeof markerCluster;
    point: typeof point;
    popup: typeof popup;
    size: typeof size;
    svgSymbol: typeof svgSymbol;
    tooltip: typeof tooltip;
};

export default GlobalObj;
