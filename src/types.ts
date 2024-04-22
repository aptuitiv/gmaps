/* ===========================================================================
    Global object type definition
=========================================================================== */

import { ControlPosition, MapTypeControlStyle, MapTypeId } from './lib/constants';
import { icon } from './lib/Icon';
import { infoWindow } from './lib/InfoWindow';
import { latLng } from './lib/LatLng';
import { latLngBounds } from './lib/LatLngBounds';
import { loader } from './lib/Loader';
import { map } from './lib/Map';
import { mapTypeControl } from './lib/Map/MapTypeControl';
import { marker } from './lib/Marker';
import { markerCluster } from './lib/MarkerCluster';
import { markerCollection } from './lib/MarkerCollection';
import { point } from './lib/Point';
import { polyline } from './lib/Polyline';
import { polylineCollection } from './lib/PolylineCollection';
import { popup } from './lib/Popup';
import { size } from './lib/Size';
import { svgSymbol } from './lib/SvgSymbol';
import { tooltip } from './lib/Tooltip';

type GlobalObj = {
    ControlPosition: typeof ControlPosition;
    MapTypeControlStyle: typeof MapTypeControlStyle;
    MapTypeId: typeof MapTypeId;
    icon: typeof icon;
    infoWindow: typeof infoWindow;
    latLng: typeof latLng;
    latLngBounds: typeof latLngBounds;
    loader: typeof loader;
    map: typeof map;
    mapTypeControl: typeof mapTypeControl;
    marker: typeof marker;
    markerCluster: typeof markerCluster;
    markerCollection: typeof markerCollection;
    point: typeof point;
    polyline: typeof polyline;
    polylineCollection: typeof polylineCollection;
    popup: typeof popup;
    size: typeof size;
    svgSymbol: typeof svgSymbol;
    tooltip: typeof tooltip;
};

export default GlobalObj;
