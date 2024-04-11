import { Libraries } from '@googlemaps/js-api-loader';
import { Algorithm, SuperClusterOptions, onClusterClickHandler, Renderer } from '@googlemaps/markerclusterer';

/**
 * Base class that all other classes extend.
 */
declare class Base {
    #private;
    /**
     * Constructor
     *
     * @param {string} objectType The object type for the class
     */
    constructor(objectType: string);
    /**
     * Returns the object type
     *
     * @returns {string}
     */
    getObjectType(): string;
    /**
     * Include the mixin into the class
     *
     * https://javascript.info/mixins
     * https://www.digitalocean.com/community/tutorials/js-using-js-mixins
     *
     * @param {any} mixin The mixin to include
     */
    static include(mixin: any): void;
    /**
     * Returns if the object is an Icon object
     *
     * @returns {boolean}
     */
    isIcon(): boolean;
    /**
     * Returns if the object is an InfoWindow object
     *
     * @returns {boolean}
     */
    isInfoWindow(): boolean;
    /**
     * Returns if the object is an LatLng object
     *
     * @returns {boolean}
     */
    isLatLng(): boolean;
    /**
     * Returns if the object is an LatLngBounds object
     *
     * @returns {boolean}
     */
    isLatLngBounds(): boolean;
    /**
     * Returns if the object is a Map object
     *
     * @returns {boolean}
     */
    isMap(): boolean;
    /**
     * Returns if the object is a Marker object
     *
     * @returns {boolean}
     */
    isMarker(): boolean;
    /**
     * Returns if the object is a MarkerCluster object
     *
     * @returns {boolean}
     */
    isMarkerCluster(): boolean;
    /**
     * Returns if the object is a Point object
     *
     * @returns {boolean}
     */
    isPoint(): boolean;
    /**
     * Returns if the object is a Popup object
     *
     * @returns {boolean}
     */
    isPopup(): boolean;
    /**
     * Returns if the object is a Size object
     *
     * @returns {boolean}
     */
    isSize(): boolean;
    /**
     * Returns if the object is a SvgSymbol object
     *
     * @returns {boolean}
     */
    isSvgSymbol(): boolean;
}

type PointObject = {
    x: number | string;
    y: number | string;
};
type XPoint = number | number[] | string | string[] | PointObject;
/**
 * The Point class to set up and manage x/y coordinates
 */
declare class Point extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {XPoint|Point} [x] The X value
     * @param {number|string} [y] The Y value
     */
    constructor(x?: XPoint | Point, y?: number | string);
    /**
     * Get the x value
     *
     * @returns {number}
     */
    get x(): number;
    /**
     * Set the x value
     *
     * @param {number|string} x The x value. Ideally it's a number but it could be a number string
     */
    set x(x: number | string);
    /**
     * Get the y value
     *
     * @returns {number}
     */
    get y(): number;
    /**
     * Set the y value
     *
     * @param {number|string} y The y value. Ideally it's a number but it could be a number string
     */
    set y(y: number | string);
    /**
     * Adds the x/y values to this point.
     *
     * This is the best way to either explicitly add an absolute x/y position, or to combine
     * two points together. The other point could include negative values.
     *
     * @param {PointValue} x The x value, or the Point object, or an array of [x, y] pairs, or a {x, y} object
     * @param {number|string} [y] The y value
     * @returns {Point}
     */
    add(x: PointValue, y?: number | string): Point;
    /**
     * Rounds the x/y values up to the nearest integer.
     * If the value is already an integer, it will return the same value.
     *
     * @returns {Point}
     */
    ceil(): Point;
    /**
     * Returns a new copy of the point
     *
     * @returns {Point}
     */
    clone(): Point;
    /**
     * Divides the x/y values by a number.
     *
     * @param {number|string} num The number to divide the x and y values by
     * @returns {Point}
     */
    divide(num: number | string): Point;
    /**
     * This returns the cartesian distance between this point and the given point.
     *
     * @param {PointValue} p The point to compare to
     * @returns {number}
     */
    distanceTo(p: PointValue): number;
    /**
     * Returns whether the current point is equal to the given point
     *
     * @param {PointValue} p The point value to compare
     * @returns {boolean}
     */
    equals(p: PointValue): boolean;
    /**
     * Returns a copy of the curent point with the x/y values rounded down to the nearest integer.
     * If the value is already an integer, it will return the same value.
     *
     * @returns {Point}
     */
    floor(): Point;
    /**
     * Get the x value
     *
     * @returns {number}
     */
    getX(): number;
    /**
     * Get the y value
     *
     * @returns {number}
     */
    getY(): number;
    /**
     * Returns whether the x/y pair are valid values
     *
     * @returns {boolean}
     */
    isValid(): boolean;
    /**
     * Multiplies the x/y values by a number
     *
     * @param {number|string} num The number to multiply the x and y values by
     * @returns {Point}
     */
    multiply(num: number | string): Point;
    /**
     * Rounds the x/y values to the nearest integer.
     *
     * @returns {Point}
     */
    round(): Point;
    /**
     * Set the x/y values
     *
     * @param {XPoint|Point} x The x value, or the Point object, or an array of [x, y] pairs, or a {x, y} object
     * @param {number|string} y The y value
     * @returns {Point}
     */
    set(x: XPoint | Point, y?: number | string): Point;
    /**
     * Set the x value
     *
     * @param {number|string} x The x value. Ideally it's a number but it could be a number string
     * @returns {Point}
     */
    setX(x: number | string): Point;
    /**
     * Set the y value
     *
     * @param {number|string} y The y value. Ideally it's a number but it could be a number string
     * @returns {Point}
     */
    setY(y: number | string): Point;
    /**
     * Subtract the x/y values to this point.
     *
     * The x/y values to subtract should ideally be absolute values to avoid confusion.
     * While they can include negative numbers, that may return unexpected results.
     *
     * @param {PointValue} x The x value, or the Point object, or an array of [x, y] pairs, or a {x, y} object
     * @param {number|string} [y] The y value
     * @returns {Point}
     */
    subtract(x: PointValue, y?: number | string): Point;
    /**
     * Returns the Google maps point object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/coordinates#Point
     *
     * @returns {google.maps.Point}
     */
    toGoogle(): google.maps.Point;
    /**
     * Change the x/y values to the integer part of a number by removing any fractional digits.
     *
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc
     *
     * @returns {Point}
     */
    trunc(): Point;
}
type PointValue = Point | number | number[] | string | string[] | PointObject;
/**
 * Helper function to set up the point object
 *
 * @param {PointValue} [x] The x value, or the Point object, or an array of [x, y] pairs, or a {x, y} object
 * @param {number|string} [y] The y value
 * @returns {Point}
 */
declare const point: (x?: PointValue, y?: number | string) => Point;

type SizeObject = {
    height: number | string;
    width: number | string;
};
type WidthSize = number | number[] | string | string[] | SizeObject;
/**
 * The Size class to set up and manage width and height values for an element
 */
declare class Size extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {WidthSize|Size} [width] The X value
     * @param {number|string} [height] The Y value
     */
    constructor(width?: WidthSize | Size, height?: number | string);
    /**
     * Get the height value
     *
     * @returns {number}
     */
    get height(): number;
    /**
     * Set the height value
     *
     * @param {number|string} height The height value. Ideally it's a number but it could be a number string
     */
    set height(height: number | string);
    /**
     * Get the width value
     *
     * @returns {number}
     */
    get width(): number;
    /**
     * Set the width value
     *
     * @param {number|string} width The width value. Ideally it's a number but it could be a number string
     */
    set width(width: number | string);
    /**
     * Returns a new copy of the size
     *
     * @returns {Size}
     */
    clone(): Size;
    /**
     * Get the height value
     *
     * @returns {number}
     */
    getHeight(): number;
    /**
     * Get the width value
     *
     * @returns {number}
     */
    getWidth(): number;
    /**
     * Returns whether the width/height pair are valid values
     *
     * @returns {boolean}
     */
    isValid(): boolean;
    /**
     * Set the width/height values
     *
     * @param {WidthSize|Size} width The width value, or the Size object, or an arraheight of [width, height] pairs, or a {width, height} object
     * @param {number|string} height The height value
     * @returns {Size}
     */
    set(width: WidthSize | Size, height?: number | string): Size;
    /**
     * Set the height value
     *
     * @param {number|string} height The height value. Ideally it's a number but it could be a number string
     * @returns {Size}
     */
    setHeight(height: number | string): Size;
    /**
     * Set the width value
     *
     * @param {number|string} width The width value. Ideally it's a number but it could be a number string
     * @returns {Size}
     */
    setWidth(width: number | string): Size;
    /**
     * Returns the Google maps size object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/coordinates#Size
     *
     * @returns {google.maps.Size|null}
     */
    toGoogle(): google.maps.Size | null;
}
type SizeValue = Size | number | number[] | string | string[] | SizeObject;
/**
 * Helper function to set up the size object
 *
 * @param {WidthSize} [width] The width value
 * @param {number|string} [height] The height value
 * @returns {Size}
 */
declare const size: (width?: SizeValue, height?: number | string) => Size;

type IconOptions = {
    anchor?: PointValue;
    labelOrigin?: PointValue;
    origin?: PointValue;
    scaledSize?: SizeValue;
    size?: SizeValue;
    url?: string;
};
/**
 * Icon class to set up an icon options for a marker
 */
declare class Icon extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {string | IconOptions} [url] The URL for the icon or the icon options
     * @param {IconOptions} [options] The icon options
     */
    constructor(url?: string | IconOptions, options?: IconOptions);
    /**
     * Set the icon options
     *
     * @param {IconOptions} options The icon options
     * @returns {Icon}
     */
    setOptions(options: IconOptions): Icon;
    /**
     * Set the position at which to anchor an image in correspondence to the location of the marker on the map.
     * Use this if for some reason you didn't pass the anchor in the icon options.
     *
     * By default, the anchor is located along the center point of the bottom of the image.
     *
     * const icon = G.icon({
     *    url: 'https://mywebsite.com/images/marker.png',
     * });
     * icon.setAnchor([10, 32]);
     *
     * Valid values are:
     * icon.setAnchor([10, 32]);
     * icon.setAnchor({x: 10, y: 32});
     * icon.setAnchor(pointClassInstance);
     *
     * @param {PointValue} anchor The anchor point value
     * @returns {Icon}
     */
    setAnchor(anchor: PointValue): Icon;
    /**
     * Set the origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
     * Use this if for some reason you didn't pass the label origin in the icon options.
     *
     * By default, the origin is located in the center point of the image.
     *
     * const icon = G.icon({
     *    url: 'https://mywebsite.com/images/marker.png',
     * });
     * icon.setLabelOrigin([10, 32]);
     *
     * Valid values are:
     * icon.setLabelOrigin([10, 32]);
     * icon.setLabelOrigin({x: 10, y: 32});
     * icon.setLabelOrigin(pointClassInstance);
     *
     * @param {PointValue} origin The label origin point value
     * @returns {Icon}
     */
    setLabelOrigin(origin: PointValue): Icon;
    /**
     * Set the position of the image within a sprite, if any. By default, the origin is located at the top left corner of the image (0, 0).
     * Use this if for some reason you didn't pass the origin in the icon options.
     *
     * const icon = G.icon({
     *    url: 'https://mywebsite.com/images/marker.png',
     * });
     * icon.setOrigin([10, 32]);
     *
     * Valid values are:
     * icon.setOrigin([10, 32]);
     * icon.setOrigin({x: 10, y: 32});
     * icon.setOrigin(pointClassInstance);
     *
     * @param {PointValue} origin The origin point value
     * @returns {Icon}
     */
    setOrigin(origin: PointValue): Icon;
    /**
     * Set the scaled size of the icon. Use this if for some reason you didn't pass the scaled size in the icon options.
     *
     * The size of the entire image after scaling, if any. Use this property to stretch/shrink an image or a sprite.
     *
     * const icon = G.icon({
     *    url: 'https://mywebsite.com/images/marker.png',
     * });
     * icon.setSize([40, 64]).setScaledSize([20, 32]));
     *
     * Valid values are:
     * icon.setScaledSize([10, 32]);
     * icon.setScaledSize({x: 10, y: 32});
     * icon.setScaledSize(sizeClassInstance);
     *
     * @param {SizeValue} sizeValue The size value
     * @returns {Icon}
     */
    setScaledSize(sizeValue: SizeValue): Icon;
    /**
     * Set the size of the icon. Use this if for some reason you didn't pass the size in the icon options.
     *
     * When using sprites, you must specify the sprite size. If the size is not provided, it will be set when the image loads.
     *
     * const icon = G.icon({
     *    url: 'https://mywebsite.com/images/marker.png',
     * });
     * icon.setSize([20, 32]);
     *
     * Valid values are:
     * icon.setSize([10, 32]);
     * icon.setSize({x: 10, y: 32});
     * icon.setSize(sizeClassInstance);
     *
     * If you're using an SVG you should set a size if the desired size is different from the height and width attributes of the SVG.
     *
     * @param {SizeValue} sizeValue The size value
     * @returns {Icon}
     */
    setSize(sizeValue: SizeValue): Icon;
    /**
     * Set the icon URL
     *
     * @param {string} url The icon URL
     * @returns {Icon}
     */
    setUrl(url: string): Icon;
    /**
     * Get the icon options
     *
     * @returns {google.maps.Icon}
     */
    toGoogle(): google.maps.Icon;
}
type IconValue = Icon | string | IconOptions;
/**
 * Helper function to set up the icon object
 *
 * @param {IconValue} [url] The URL for the icon, the icon object, or the icon options
 * @param {IconOptions} [options] The options for the icon
 * @returns {Icon}
 */
declare const icon: (url?: IconValue, options?: IconOptions) => Icon;

type LatLngLiteral = {
    lat?: number | string;
    lng?: number | string;
};
type LatLngLiteralExpanded = {
    latitude: number | string;
    longitude: number | string;
};
type Latitude = number | number[] | string | string[] | LatLngLiteral | LatLngLiteralExpanded;
/**
 * The LatLng class to set up and manage latitude/longitude pairs
 */
declare class LatLng extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {Latitude|LatLng} latitude The latitude value or the latitude/longitude pair
     * @param {number|string} [longitude] The longitude value
     */
    constructor(latitude?: Latitude | LatLng, longitude?: number | string);
    /**
     * Get the latitude value
     *
     * @returns {number}
     */
    get latitude(): number;
    /**
     * Set the latitude value
     *
     * @param {number|string} latitude The latitude value. Ideally it's a number but it could be a number string
     */
    set latitude(latitude: number | string);
    /**
     * Get the latitude value (shortened version of the latitude property)
     *
     * @returns {number}
     */
    get lat(): number;
    /**
     * Set the latitude value
     *
     * @param {number|string} latitude The latitude value. Ideally it's a number but it could be a number string
     */
    set lat(latitude: number | string);
    /**
     * Get the longitude value
     *
     * @returns {number}
     */
    get longitude(): number;
    /**
     * Set the longitude value
     *
     * @param {number|string} longitude The longitude value. Ideally it's a number but it could be a number string
     */
    set longitude(longitude: number | string);
    /**
     * Get the longitude value (shortened version of the longitude property)
     *
     * @returns {number}
     */
    get lng(): number;
    /**
     * Set the longitude value
     *
     * @param {number|string} longitude The longitude value. Ideally it's a number but it could be a number string
     */
    set lng(longitude: number | string);
    /**
     * Returns a new copy of the latitude/longitude pair
     *
     * @returns {LatLng}
     */
    clone(): LatLng;
    /**
     * Tests to see if the given latitude/longitude pair is equal to this latitude/longitude pair
     *
     * @param {number[] | string[] | LatLngLiteral | LatLngLiteralExpanded | LatLng} other The latitude/longitude pair to compare to
     * @returns {boolean}
     */
    equals(other: number[] | string[] | LatLngLiteral | LatLngLiteralExpanded | LatLng): boolean;
    /**
     * Set the latitude/longitude pair
     *
     * @param {Latitude|LatLng} latitude The latitude value or the latitude/longitude pair
     * @param {number|string} longitude The longitude value
     * @returns {LatLng}
     */
    set(latitude: Latitude | LatLng, longitude?: number | string): LatLng;
    /**
     * Sets the latitude value
     *
     * @param {number|string} lat The latitude value. Ideally it's a number, but it could be a number string
     * @returns {LatLng}
     */
    setLat(lat: number | string): LatLng;
    /**
     * Returns the longitude value
     *
     * @returns {number}
     */
    getLat(): number;
    /**
     * Sets the longitude value
     *
     * @param {number|string} lng The longitude value. Ideally it's a number, but it could be a number string
     * @returns {LatLng}
     */
    setLng(lng: number | string): LatLng;
    /**
     * Returns the latitude value
     *
     * @returns {number}
     */
    getLng(): number;
    /**
     * Get the Google maps LatLng object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
     *
     * @returns {google.maps.LatLng|null}
     */
    toGoogle(): google.maps.LatLng | null;
    /**
     * Returns whether the latitude/longitude pair are valid values
     *
     * @returns {boolean}
     */
    isValid(): boolean;
    /**
     * Converts the latitude/longitude pair to a JSON object
     *
     * @returns {google.maps.LatLngLiteral}
     */
    toJson(): google.maps.LatLngLiteral;
}
type LatLngValue = number[] | string[] | LatLngLiteral | LatLngLiteralExpanded | LatLng;
/**
 * Helper function to set up a new LatLng object value
 *
 * @param {LatLngValue} [latitude] The latitude value or the latitude/longitude pair
 * @param {number|string} [longitude] The longitude value
 * @returns {LatLng}
 */
declare const latLng: (latitude?: LatLngValue | string | number, longitude?: number | string) => LatLng;

type Event = {
    domEvent?: MouseEvent | TouchEvent | PointerEvent | KeyboardEvent | Event;
    latLng?: LatLng;
    placeId?: string;
    pixel?: Point;
    stop?: () => void;
    type: string;
};
type EventCallback = (event: Event) => void;
type EventOptions = {
    once?: boolean;
};
/**
 * Evented class to add syntatic sugar to handling events
 */
declare class Evented extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {string} objectType The object type for the class
     * @param {string} testObject The object that needs Google maps. This should be the name of the object that calls this method.
     * @param {string} [testLibrary] An optional Google maps library class to check for. This needs to be part of the google.maps object.
     */
    constructor(objectType: string, testObject: string, testLibrary?: string);
    /**
     * Dispatch an event
     *
     * @param {string} event The event to dispatch
     * @param {Event} [data] The data to pass to the event listener callback function.
     * @returns {Evented}
     */
    dispatch(event: string, data?: any): Evented;
    /**
     * Test if there are any listeners for the given event type
     *
     * Optionally you can test if there are any listeners for the given event type and callback
     *
     * @param {string} type The event type to test for
     * @param {EventCallback} callback Optional callback function to include in the test
     * @returns {boolean}
     */
    hasListener(type: string, callback?: EventCallback): boolean;
    /**
     * Removes the event listener
     *
     * There are three ways to remove event listeners:
     * 1. Remove a specific event listener
     *      this.off('click', onClickFunction);
     *      this.off('click', onClickFunction, options);
     * 2. Remove all listeners for a given event type
     *      this.off('click');
     * 3. Remove all listeners for all event types
     *     this.off();
     *     this.offAll();
     *
     * @param {string} [type] The event type
     * @param {EventCallback} [callback] The callback function to include when finding the event to remove
     * @param {EventOptions} [options] The options to use when finding the event to remove
     */
    off(type?: string, callback?: EventCallback, options?: EventOptions): void;
    /**
     * Removes all event listeners
     */
    offAll(): void;
    /**
     * Add an event listener to the object
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener callback function
     * @param {EventOptions} [options] The options object
     * @param {object} [context] The context to bind the callback function to
     */
    on(type: string, callback: EventCallback, options?: EventOptions, context?: object): void;
    /**
     * Sets up an event listener that will only be called once
     *
     * @param {string} type The event type
     * @param {EventCallback} [callback] The event listener callback function
     * @param {object} [context] The context to bind the callback function to
     */
    once(type: string, callback?: EventCallback, context?: object): void;
    /**
     * Sets up the event listener on the Google maps object.
     *
     * This also handles setting up the pending events if the Google Maps library isn't loaded already.
     *
     * This should be called from an "on()" function in the class that extends this class.
     * It is not intended to be called from outside of this library.
     *
     * @internal
     * @param {string} type The event type
     * @param {EventCallback} callback The event listener callback function
     * @param {EventOptions} options The options for the event listener
     * @param {object} context The context to bind the callback function to
     */
    setupEventListener(type: string, callback: EventCallback, options: EventOptions, context: object): void;
    /**
     * Set the Google maps MVC object
     *
     * This is the Google object that the object represents. Event listeners will be added to it.
     *
     * This should only be called from the class that extends this class.
     * This is not intended to be called from outside of this library.
     *
     * @internal
     * @param {google.maps.MVCObject} googleObject The Google maps MVC object
     */
    setEventGoogleObject(googleObject: google.maps.MVCObject): void;
    /**
     * Triggers an event
     *
     * Alias to dispatch()
     *
     * @param {string} event The event to dispatch
     * @param {Event} [data] The data to pass to the event listener callback function.
     * @returns {Evented}
     */
    trigger(event: string, data?: any): Evented;
}

/**
 * The LatLngBounds class to set up and manage latitude/longitude bounds
 */
declare class LatLngBounds extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {LatLngValue | LatLngValue[]} [latLngValue] The latitude/longitude value(s). If not set then add points with the extend method.
     *      See comments on the extended method for the types of values that latLngValue can be.
     */
    constructor(latLngValue?: LatLngValue | LatLngValue[]);
    /**
     * Returns whether the the given LatLng value is within this bounds
     *
     * @param {LatLngValue} latLngValue The LatLng value to test
     * @returns {boolean}
     */
    contains(latLngValue: LatLngValue): boolean;
    /**
     * Returns whether this bounds approximately equals the given bounds
     *
     * @param {LatLngBounds} other The LatLngBounds object to compare
     * @returns {boolean}
     */
    equals(other: LatLngBounds): boolean;
    /**
     * Extends this bounds to contain the given point
     *
     * https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds.extend
     *
     * The latLngValue parameter can be:
     * - an array of [lat, lng] pairs: [[lat, lng], [lat, lng], ...]
     * - an array of {lat, lng} objects (LatLngLiteral[]): [{lat, lng}, {lat, lng}, ...]
     * - an array of LatLng objects: [LatLng, LatLng, ...]
     * - a [lat, lng] pair
     * - a {lat, lng} object (LatLngLiteral)
     *
     * @param {LatLngValue | LatLngValue[]} latLngValue The latitude/longitude value(s)
     * @returns {LatLngBounds}
     */
    extend(latLngValue: LatLngValue | LatLngValue[]): LatLngBounds;
    /**
     * Get the center of the LatLngBounds
     *
     * @returns {LatLng}
     */
    getCenter(): LatLng;
    /**
     * Get the north-east corner of the LatLngBounds
     *
     * @returns {LatLng}
     */
    getNorthEast(): LatLng;
    /**
     * Get the south-west corner of the LatLngBounds
     *
     * @returns {LatLng}
     */
    getSouthWest(): LatLng;
    /**
     * Returns whether this bounds shares any points with the other bounds
     *
     * @param {LatLngBounds} other The LatLngBounds object to compare
     * @returns {boolean}
     */
    intersects(other: LatLngBounds): boolean;
    /**
     * Returns whether this bounds is empty
     *
     * @returns {boolean}
     */
    isEmpty(): boolean;
    /**
     * Get the Google maps LatLngBounds object
     *
     * @returns {google.maps.LatLngBounds}
     */
    toGoogle(): google.maps.LatLngBounds;
    /**
     * Converts the LatLngBounds object to a JSON object
     *
     * @returns {google.maps.LatLngBoundsLiteral}
     */
    toJson(): google.maps.LatLngBoundsLiteral;
    /**
     * Converts the LatLngBounds object to a lat/lng span
     *
     * @returns {LatLng}
     */
    toSpan(): LatLng;
    /**
     * Converts the LatLngBounds object to a string
     *
     * @returns {string}
     */
    toString(): string;
    /**
     * Returns the LatLngBounds object as a string that can be used in a URL
     *
     * @param {number} [precision] The number of decimal places to round the lat/lng values to
     * @returns {string}
     */
    toUrlValue(precision?: number): string;
    /**
     * Extends this bounds to contain the union of this and the given bounds
     *
     * @param {LatLngBounds} other The LatLngBounds object to join with
     * @returns {LatLngBounds}
     */
    union(other: LatLngBounds): LatLngBounds;
}
type LatLngBoundsValue = LatLngValue | LatLngValue[] | LatLngBounds;
/**
 * Helper function to set up the LatLngBounds object
 *
 * See comments on the extended method in the LatLngBounds class for the types of values
 * that latLngValue can be.
 *
 * @param {LatLngBoundsValue} [latLngValue] The latitude/longitude bounds value
 * @returns {LatLngBounds}
 */
declare const latLngBounds: (latLngValue?: LatLngBoundsValue) => LatLngBounds;

type GMMapOptions = {
    center?: LatLng;
    zoom?: number;
};
type MapOptions = GMMapOptions & {
    apiKey: string;
    center?: LatLngValue;
    lat: number | string;
    latitude: number | string;
    libraries?: Libraries;
    lng: number | string;
    longitude: number | string;
    version?: string;
    zoom?: number;
};
type LocateOptions = {
    enableHighAccuracy?: boolean;
    maximumAge?: number;
    timeout?: number;
    watch?: boolean;
};
type LocationPosition = {
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
type LocationOnSuccess = (position: LocationPosition) => void;
/**
 * The map class
 */
declare class Map extends Evented {
    #private;
    /**
     * Class constructor
     *
     * @param {string|HTMLElement} selector The selector of the element that the map will be rendered in. Or the HTMLElement that the map will be rendered in.
     *      The selector can be a class name, an id, or an HTML element. If you need something beyond an id or class name as the selector then pass the element itself.
     * @param {MapOptions} [options] The options object for the map
     */
    constructor(selector: string | HTMLElement, options?: MapOptions);
    /**
     * Get the zoom level for the map
     *
     * @returns {number}
     */
    get zoom(): number;
    /**
     * Set the zoom level for the map
     *
     * @param {number|string} value The zoom level
     */
    set zoom(value: number);
    /**
     * Show the map
     *
     * Alias to show()
     *
     * @param {Function} callback The callback function to call after the map loads
     * @returns {Promise<void>}
     */
    display(callback?: () => void): Promise<void>;
    /**
     * Sets the viewport to contain the given bounds.
     *
     * The bounds parameter can be:
     * - a LatLngBounds object
     * - an array of [lat, lng] pairs: [[lat, lng], [lat, lng], ...]
     * - an array of {lat, lng} objects (LatLngLiteral[]): [{lat, lng}, {lat, lng}, ...]
     * - an array of LatLng objects: [LatLng, LatLng, ...]
     * - a LatLng object
     * - a [lat, lng] pair
     * - a {lat, lng} object (LatLngLiteral)
     *
     * @see https://developers.google.com/maps/documentation/javascript/reference/map#Map.fitBounds
     *
     * Usage:
     * Add marks to the map.
     * Then call map.fitBounds() to set the viewport to contain the markers.
     * @param {LatLngBoundsValue} bounds The bounds to fit
     * @returns {Map}
     */
    fitBounds(bounds: LatLngBoundsValue): Map;
    /**
     * Get the center point for the map
     *
     * @returns {LatLng}
     */
    getCenter(): LatLng;
    /**
     * Gets the current projection for the map.
     *
     * If the map is not yet initialized, this will return undefined.
     *
     * @returns {google.maps.Projection|undefined}
     */
    getProjection(): google.maps.Projection | undefined;
    /**
     * Get the zoom level
     *
     * @returns {number}
     */
    getZoom(): number;
    /**
     * Load and show the map
     *
     * There are two ways to respond when the map loads:
     * 1. Pass a callback function to the load() function
     *   map.load(() => {
     *     // Do something after the map loads
     *   });
     * 2. Listen for the 'visible' event
     *   map.on('visible', () => {
     *      // Do something after the map loads
     *   });
     * 2a. Use the once() function to listen for the 'visible' event only once. The event
     *     listener will be removed after the event is dispatched.
     *   map.once('visible', () => {
     *     // Do something after the map loads
     *   });
     *
     * @param {Function} callback The callback function to call after the map loads
     * @returns {Promise<void>}
     */
    load(callback?: () => void): Promise<void>;
    /**
     * Try to locate the user using the GeoLocation API
     *
     * There are two ways to handle when the user's location is found:
     * 1. Pass a callback function to the locate() function
     *  map.locate({}, (position) => {
     *    // Do something with the position
     *  });
     * 2. Listen for the 'locationfound' event
     *  map.on('locationfound', (event) => {
     *   // Do something with the position
     *   // event is an instance of CustomEvent.
     *   // event.detail contains the position data
     *  });
     *
     * @param {LocateOptions|LocationOnSuccess} [options] The options for the locate() function. Or the callback function.
     * @param {Function} [onSuccess] The callback function for when the user's location is found.
     * @returns {Map}
     */
    locate(options?: LocateOptions | LocationOnSuccess, onSuccess?: LocationOnSuccess): Map;
    /**
     * Add an event listener to the object
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener function
     * @param {EventOptions} [options] The event listener options
     * @param {object} [context] The context to bind the callback function to
     */
    on(type: string, callback: EventCallback, options?: EventOptions, context?: object): void;
    /**
     * Set the API key
     *
     * @param {string} key The API key
     * @returns {Map}
     */
    setApiKey(key: string): Map;
    /**
     * Set the center point for the map
     *
     * @param {number|LatLngValue} latitude The latitude value or the latitude/longitude pair
     * @param {number} [longitude] The longitude value
     * @returns {Map}
     */
    setCenter(latitude: number | LatLngValue, longitude?: number): Map;
    /**
     * Set the map options
     *
     * @param {MapOptions} options The map options
     * @returns {Map}
     */
    setOptions(options: MapOptions): Map;
    /**
     * Set the zoom value
     *
     * @param {number} zoom The zoom value
     * @returns {Map}
     */
    setZoom(zoom: number): Map;
    /**
     * Show the map
     *
     * If the Google Maps API hasn't loaded yet then this will wait for the "load" event to be dispatched.
     *
     * @param {Function} callback The callback function to call after the map loads
     * @returns {Promise<void>}
     */
    show(callback?: () => void): Promise<void>;
    /**
     * Stop watching for the user's location
     *
     * @returns {Map}
     */
    stopLocate(): Map;
    /**
     * Returns the Google map object
     *
     * @returns {google.maps.Map}
     */
    toGoogle(): google.maps.Map;
}
/**
 * Helper function to set up the map object
 *
 * @param {string|HTMLElement} selector The selector of the element that the map will be rendered in. Or the HTMLElement that the map will be rendered in.
 *      The selector can be a class name, an id, or an HTML element. If you need something beyond an id or class name as the selector then pass the element itself.
 * @param {MapOptions} [config] The map options
 * @returns {Map}
 */
declare const map: (selector: string | HTMLElement, config?: MapOptions) => Map;

/**
 * Base class to help with drawing stuff on the map.
 *
 * Other classes, like InfoWindow add functionality to this class with the include() method.
 */
declare class Layer extends Evented {
    #private;
    /**
     * Return the Map object or null if the Map object is not set
     *
     * @returns {Map|null}
     */
    getMap(): Map | null;
    /**
     * Clears the map object that the layer is added to
     *
     * Note, this does not remove the layer from the map, it just clears the map object from the layer.
     */
    removeMap(): void;
    /**
     * Sets the map object that the layer is added to
     *
     * This does not display the layer on the map, it only sets the map object for the layer.
     *
     * @param {Map} map The map object to add the layer to
     */
    setMap(map: Map | null): void;
}

type SvgSymbolOptions = {
    anchor?: PointValue;
    fillColor?: string;
    fillOpacity?: number;
    labelOrigin?: PointValue;
    path: string;
    rotation?: number;
    scale?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
};
/**
 * Class to set up an SVG icon for a marker
 */
declare class SvgSymbol extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {string | SvgSymbolOptions} [path] The SVG path for the icon or the icon options
     * @param {SvgSymbolOptions} [options] The options for the icon
     */
    constructor(path?: string | SvgSymbolOptions, options?: SvgSymbolOptions);
    /**
     * Get the anchor point
     *
     * @returns {PointValue}
     */
    get anchor(): PointValue;
    /**
     * Set the position at which to anchor an image in correspondence to the location of the marker on the map.
     *
     * @param {PointValue} anchor The anchor point value
     */
    set anchor(anchor: PointValue);
    /**
     * Get the SVG fill color
     *
     * @returns {string}
     */
    get fillColor(): string;
    /**
     * Set the SVG fill color.
     *
     * @param {string} fillColor The SVG fill color.
     */
    set fillColor(fillColor: string);
    /**
     * Get the opacity for the fill
     *
     * @returns {number}
     */
    get fillOpacity(): number;
    /**
     * Set the opacity for the fill
     *
     * @param {number|string} fillOpacity The opacity for the fill
     */
    set fillOpacity(fillOpacity: number | string);
    /**
     * Get the origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
     *
     * @returns {PointValue}
     */
    get labelOrigin(): PointValue;
    /**
     * Set the origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
     *
     * @param {PointValue} labelOrigin The origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
     */
    set labelOrigin(labelOrigin: PointValue);
    /**
     * Get the SVG path for the icon
     *
     * @returns {string}
     */
    get path(): string;
    /**
     * Set the SVG path for the icon
     *
     * @param {path} path The SVG path for the icon
     */
    set path(path: string);
    /**
     * Get the rotation of the icon in degrees clockwise about the anchor point.
     *
     * @returns {number}
     */
    get rotation(): number;
    /**
     * Set the rotation of the icon in degrees clockwise about the anchor point.
     *
     * @param {number|string} rotation The rotation of the icon in degrees clockwise about the anchor point.
     */
    set rotation(rotation: number | string);
    /**
     * Get the amount by which the icon is scaled.
     *
     * @returns {number}
     */
    get scale(): number;
    /**
     * Set the amount by which the icon is scaled.
     *
     * @param {number|string} scale The amount by which the icon is scaled.
     */
    set scale(scale: number | string);
    /**
     * Get the SVG stroke color
     *
     * @returns {string}
     */
    get strokeColor(): string;
    /**
     * Set the SVG stroke color.
     *
     * @param {string} strokeColor The SVG stroke color.
     */
    set strokeColor(strokeColor: string);
    /**
     * Get the opacity of the stroke.
     * The opacity of the stroke, where 0 is fully transparent and 1 is fully opaque.
     *
     * @returns {number}
     */
    get strokeOpacity(): number;
    /**
     * Set the opacity of the stroke.
     *
     * @param {number|string} strokeOpacity The opacity of the stroke.
     */
    set strokeOpacity(strokeOpacity: number | string);
    /**
     * Get the weight of the stroke in pixels.
     *
     * @returns {number}
     */
    get strokeWeight(): number;
    /**
     * Set the weight of the stroke.
     *
     * @param {number|string} strokeWeight The weight of the stroke.
     */
    set strokeWeight(strokeWeight: number | string);
    /**
     * Set the icon options
     *
     * @param {SvgSymbolOptions} options The icon options
     * @returns {SvgSymbol}
     */
    setOptions(options: SvgSymbolOptions): SvgSymbol;
    /**
     * Set the position at which to anchor an image in correspondence to the location of the marker on the map.
     * Use this if for some reason you didn't pass the anchor in the icon options.
     *
     * By default, the anchor is located along the center point of the bottom of the image.
     *
     * const symbol = G.icon({
     *    url: 'https://mywebsite.com/images/marker.png',
     * });
     * symbol.setAnchor([10, 32]);
     *
     * Valid values are:
     * symbol.setAnchor([10, 32]);
     * symbol.setAnchor({x: 10, y: 32});
     * symbol.setAnchor(pointClassInstance);
     *
     * @param {PointValue} anchor The anchor point value
     * @returns {SvgSymbol}
     */
    setAnchor(anchor: PointValue): SvgSymbol;
    /**
     * Set the SVG fill color.
     *
     * @param {string} fillColor The SVG fill color.
     * @returns {SvgSymbol}
     */
    setFillColor(fillColor: string): SvgSymbol;
    /**
     * Set the opacity for the fill
     *
     * @param {number|string} fillOpacity The opacity for the fill
     * @returns {SvgSymbol}
     */
    setFillOpacity(fillOpacity: number | string): SvgSymbol;
    /**
     * Set the origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
     *
     * @param {PointValue} labelOrigin The origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
     * @returns {SvgSymbol}
     */
    setLabelOrigin(labelOrigin: PointValue): SvgSymbol;
    /**
     * Set the SVG path for the icon
     *
     * @param {path} path The SVG path for the icon
     * @returns {SvgSymbol}
     */
    setPath(path: string): SvgSymbol;
    /**
     * Set the rotation of the icon in degrees clockwise about the anchor point.
     *
     * @param {number|string} rotation The rotation of the icon in degrees clockwise about the anchor point.
     * @returns {SvgSymbol}
     */
    setRotation(rotation: number | string): SvgSymbol;
    /**
     * Set the amount by which the icon is scaled.
     *
     * @param {number|string} scale The amount by which the icon is scaled.
     * @returns {SvgSymbol}
     */
    setScale(scale: number | string): SvgSymbol;
    /**
     * Set the SVG stroke color.
     *
     * @param {string} strokeColor The SVG stroke color.
     * @returns {SvgSymbol}
     */
    setStrokeColor(strokeColor: string): SvgSymbol;
    /**
     * Set the opacity of the stroke.
     *
     * @param {number|string} strokeOpacity The opacity of the stroke.
     * @returns {SvgSymbol}
     */
    setStrokeOpacity(strokeOpacity: number | string): SvgSymbol;
    /**
     * Set the weight of the stroke.
     *
     * @param {number|string} strokeWeight The weight of the stroke.
     * @returns {SvgSymbol}
     */
    setStrokeWeight(strokeWeight: number | string): SvgSymbol;
    /**
     * Get the icon options
     *
     * @returns {google.maps.Symbol}
     */
    toGoogle(): google.maps.Symbol;
}
type SvgSymbolValue = SvgSymbol | string | SvgSymbolOptions;
/**
 * Helper function to set up the icon object
 *
 * @param {SvgSymbolValue} [path] The SVG path for the icon, the icon object, or the icon options
 * @param {SvgSymbolOptions} [options] The options for the icon
 * @returns {SvgSymbol}
 */
declare const svgSymbol: (path?: SvgSymbolValue, options?: SvgSymbolOptions) => SvgSymbol;

/**
 * Base class to help with drawing overlays on the map.
 *
 * The methods are purposely left blank so you can override them in your own class.
 * The methods are called from the OverlayView class in the draw(), onAdd(), and onRemove() methods.
 */
declare class Overlay extends Layer {
    #private;
    /**
     * Constructor
     *
     * @param {string} objectType The object type for the class
     * @param {string} testObject The object that needs Google maps. This should be the name of the object that calls this method.
     * @param {string} [testLibrary] An optional Google maps library class to check for. This needs to be part of the google.maps object.
     */
    constructor(objectType: string, testObject: string, testLibrary?: string);
    /**
     * Get the class name for the overlay element
     *
     * @returns {string}
     */
    get className(): string;
    /**
     * Set the class name(s) for the overlay element
     *
     * If you need multiple class names then separate them with a space.
     *
     * @param {string} className The class name(s) to add to the overlay.
     *    This can be a space separated list of class names.
     */
    set className(className: string);
    /**
     * Returns the offset value
     *
     * @returns {Point}
     */
    get offset(): Point;
    /**
     * Set the x,y offset for the overlay
     *
     * This lets you have the offset show a certain number of pixels from it's lat/lng position.
     *
     * @param {PointValue} value The offset value
     */
    set offset(value: PointValue);
    /**
     * Returns the position of the overlay
     *
     * @returns {LatLng}
     */
    get position(): LatLng;
    /**
     * Set the position of the overlay
     *
     * @param {LatLngValue} value The position of the overlay
     */
    set position(value: LatLngValue);
    /**
     * Returns the styles for the overlay element
     *
     * @returns {object}
     */
    get styles(): object;
    /**
     * Set the styles for the overlay element
     *
     * @param {object} styles The styles to apply to the overlay element
     */
    set styles(styles: object);
    /**
     * Display the overlay on the map
     *
     * Alias to show()
     *
     * @param {Map} map The Map object
     * @returns {Overlay}
     */
    display(map: Map): Overlay;
    /**
     * Get the offset value
     *
     * @returns {Point}
     */
    getOffset(): Point;
    /**
     * Get the overlay HTML element
     *
     * @returns {HTMLElement}
     */
    getOverlayElement(): HTMLElement;
    /**
     * Get the position of the overlay
     *
     * @returns {LatLng}
     */
    getPosition(): LatLng;
    /**
     * Returns whether the overlay has a position
     *
     * @returns {boolean}
     */
    hasPosition(): boolean;
    /**
     * Hide the overlay
     *
     * @returns {Overlay}
     */
    hide(): Overlay;
    /**
     * Removes a class name from the overlay element
     *
     * @param {string} className The class name to remove from the overlay element
     * @returns {Overlay}
     */
    removeClassName(className: string): Overlay;
    /**
     * Set the class name(s) for the overlay element
     *
     * If you need multiple class names then separate them with a space.
     *
     * @param {string} className The class name(s) to add to the overlay.
     *    This can be a space separated list of class names.
     * @returns {Overlay}
     */
    setClassName(className: string): Overlay;
    /**
     * Set the map object to display the overlay in
     *
     * Alias to show()
     *
     * @param {Map} map The Map object
     * @returns {Overlay}
     */
    setMap(map: Map): Overlay;
    /**
     * Set the x,y offset for the overlay
     *
     * This lets you have the offset show a certain number of pixels from it's lat/lng position.
     *
     * @param {PointValue} offset The offset value
     * @returns {Overlay}
     */
    setOffset(offset: PointValue): Overlay;
    /**
     * Set the position of the overlay
     *
     * @param {LatLngValue} position The latitude/longitude position of where the overlay should show
     * @returns {Overlay}
     */
    setPosition(position: LatLngValue): Overlay;
    /**
     * Set the styles for the overlay element
     *
     * @param {object} styles The styles to apply to the overlay element
     * @returns {Overlay}
     */
    setStyles(styles: object): Overlay;
    /**
     * Add the overlay to the map.
     *
     * Alias for setMap()
     *
     * @param {Map} map The Map object
     * @returns {Overlay}
     */
    show(map: Map): Overlay;
    /**
     * Set a single style on the overlay element
     *
     * @param {string} key The style key
     * @param {string} value The style value
     * @returns {Overlay}
     */
    style(key: string, value: string): Overlay;
    /**
     * Add the overlay to the map. Called once after setMap() is called on the overlay with a valid map.
     *
     * This is called by the internal OverlayView class. It should not be called directly.
     *
     * @internal
     * @param {google.maps.MapPanes} panes The Google maps panes object
     */
    add(panes: google.maps.MapPanes): void;
    /**
     * Draw the overlay. Called when the overlay is being drawn or updated.
     *
     * This is called by the internal OverlayView class. It should not be called directly.
     *
     * @internal
     * @param {google.maps.MapCanvasProjection} projection The Google maps projection object
     */
    draw(projection: google.maps.MapCanvasProjection): void;
    /**
     * Remove the overlay from the map.
     * This method is called once following a call to setMap(null).
     *
     * This is called by the internal OverlayView class. It should not be called directly.
     *
     * @internal
     */
    remove(): void;
}

type TooltipOptions = {
    center?: boolean;
    className?: string;
    content?: string | HTMLElement | Text;
    map?: Map;
    offset?: PointValue;
    position?: LatLngValue;
    styles?: object;
    theme?: string;
};
/**
 * Tooltip class
 */
declare class Tooltip extends Overlay {
    #private;
    /**
     * Constructor
     *
     * @param {TooltipOptions} [options] Tooltip options
     */
    constructor(options?: TooltipOptions);
    /**
     * Returns whether to center the tooltip horizontally on the element.
     *
     * @returns {boolean}
     */
    get center(): boolean;
    /**
     * Set whether to center the tooltip horizontally on the element. Useful if the tooltip is on a marker.
     *
     * @param {boolean} center Whether to center the tooltip on the element
     */
    set center(center: boolean);
    /**
     * Returns the content for the tooltip
     *
     * @returns {string|HTMLElement|Text}
     */
    get content(): string | HTMLElement | Text;
    /**
     * Set the content for the tooltip
     *
     * @param {string|HTMLElement|Text} content The content for the tooltip
     */
    set content(content: string | HTMLElement | Text);
    /**
     * Returns the theme to use for the tooltip
     *
     * @returns {string}
     */
    get theme(): string;
    /**
     * Set the theme to use for the tooltip
     *
     * @param {string} theme The theme to use for the tooltip
     */
    set theme(theme: string);
    /**
     * Attach the tooltip to a map or marker
     *
     * The tooltip will be shown when hovering over the map or marker.
     *
     * @param {Map | Marker} element The element to attach the tooltip to
     * @returns {Tooltip}
     */
    attachTo(element: Map | Marker): Tooltip;
    /**
     * Sets the options for the tooltip
     *
     * @param {TooltipOptions} options Tooltip options
     */
    setOptions(options: TooltipOptions): void;
    /**
     * Returns whether the tooltip already has content
     *
     * @returns {boolean}
     */
    hasContent(): boolean;
    /**
     * Set the content for the tooltip
     *
     * @param {string|HTMLElement} content The content for the tooltip
     * @returns {Tooltip}
     */
    setContent(content: string | HTMLElement): Tooltip;
    /**
     * Add the overlay to the map. Called once after setMap() is called on the overlay with a valid map.
     *
     * @internal
     * @param {google.maps.MapPanes} panes The Google maps panes object
     */
    add(panes: google.maps.MapPanes): void;
    /**
     * Draw the overlay. Called when the overlay is being drawn or updated.
     *
     * @internal
     * @param {google.maps.MapCanvasProjection} projection The Google maps projection object
     */
    draw(projection: google.maps.MapCanvasProjection): void;
}
type TooltipValue = Tooltip | TooltipOptions;
/**
 * Helper function to set up the tooltip object
 *
 * @param {TooltipOptions} [options] The tooltip options or the tooltip class
 * @returns {Tooltip}
 */
declare const tooltip: (options?: TooltipValue) => Tooltip;

type MarkerLabel = google.maps.MarkerLabel;
type GMMarkerOptions = {
    anchorPoint?: Point;
    cursor?: string;
    icon?: Icon | SvgSymbol | string;
    label?: string | MarkerLabel;
    map?: Map;
    position?: LatLng;
    title?: string;
};
type MarkerOptions = GMMarkerOptions & {
    anchorPoint?: PointValue;
    icon?: IconValue;
    lat?: number | string;
    latitude?: number | string;
    lng?: number | string;
    longitude?: number | string;
    position?: LatLngValue;
    svgIcon?: SvgSymbolValue | string;
    tooltip?: TooltipValue;
};
/**
 * Marker class to set up a single marker and add it to the map
 */
declare class Marker extends Layer {
    #private;
    /**
     * Constructor
     *
     * @param {LatLngValue|MarkerOptions} [position] The latitude longitude pair
     * @param {MarkerOptions} [options] The marker options
     */
    constructor(position?: LatLngValue | MarkerOptions, options?: MarkerOptions);
    /**
     * Get the anchor point for the marker
     *
     * @returns {Point}
     */
    get anchorPoint(): Point;
    /**
     * Set the anchor point for the marker
     *
     * @param {PointValue} value The anchor point for the marker
     */
    set anchorPoint(value: PointValue);
    /**
     * Get the cursor type to show on hover
     *
     * @returns {string}
     */
    get cursor(): string;
    /**
     * Set the cursor type to show on hover
     *
     * @param {string} value The cursor type to show on hover
     */
    set cursor(value: string);
    /**
     * Get the icon for the marker
     *
     * @returns {Icon | SvgSymbol | string}
     */
    get icon(): Icon | SvgSymbol | string;
    /**
     * Set the icon for the marker
     *
     * @param {Icon | SvgSymbol | string} value The icon value for the marker
     */
    set icon(value: Icon | SvgSymbol | string);
    /**
     * Get the label for the marker
     *
     * @returns {string | number | MarkerLabel}
     */
    get label(): string | number | MarkerLabel;
    /**
     * Set the label for the marker
     *
     * @param {string | number | MarkerLabel} value The label value for the marker
     */
    set label(value: string | number | MarkerLabel);
    /**
     * Get the map object
     *
     * @returns {Map}
     */
    get map(): Map;
    /**
     * Set the map object
     *
     * @param {Map|null} value The map object. Set to null if you want to remove the marker from the map.
     */
    set map(value: Map | null);
    /**
     * Get the marker position
     *
     * @returns {LatLng}
     */
    get position(): LatLng;
    /**
     * Set the latitude and longitude value for the marker
     *
     * @param {LatLngValue} value The latitude/longitude position for the marker
     */
    set position(value: LatLngValue);
    /**
     * Get the title for the marker
     *
     * @returns {string}
     */
    get title(): string;
    /**
     * Set the title for the marker
     *
     * @param {string} value The title for the marker
     */
    set title(value: string);
    /**
     * Adds the marker to the map object
     *
     * Alternate of show()
     *
     * @param {Map} map The map object
     * @returns {Marker}
     */
    display(map: Map): Marker;
    /**
     * Get the marker position (i.e. the LatLng object)
     *
     * https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
     *
     * @returns {LatLng}
     */
    getPosition(): LatLng;
    /**
     * Hide the marker
     *
     * @returns {Marker}
     */
    hide(): Marker;
    /**
     * Add an event listener to the object
     *
     * @param {string} type The event type
     * @param {EventCallback} callback The event listener function
     * @param {EventOptions} [options] The event listener options
     * @param {object} [context] The context to bind the callback function to
     */
    on(type: string, callback: EventCallback, options?: EventOptions, context?: object): void;
    /**
     * Adds the marker to the map object
     *
     * Alternate of show()
     *
     * @param {Map} map The map object
     * @returns {Marker}
     */
    setMap(map: Map): Marker;
    /**
     * Set the marker options
     *
     * @param {MarkerOptions} options The marker options
     * @returns {Marker}
     */
    setOptions(options: MarkerOptions): Marker;
    /**
     * Set up a custom tooltip for the marker instead of relying on the default browser tooltip
     *
     * @param {TooltipValue} tooltipValue The tooltip value
     * @param {string} title The tooltip title
     * @returns {Marker}
     */
    setTooltip(tooltipValue: TooltipValue, title?: string): Marker;
    /**
     * Set the latitude and longitude value for the marker
     *
     * @param {LatLngValue} value The latitude/longitude position for the marker
     * @returns {Marker}
     */
    setPosition(value: LatLngValue): Marker;
    /**
     * Adds the marker to the map object
     *
     * Alternate of setMap()
     *
     * @param {Map} map The map object
     * @returns {Marker}
     */
    show(map: Map): Marker;
    /**
     * Get the Google maps marker object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker
     *
     * @returns {google.maps.Marker}
     */
    toGoogle(): google.maps.Marker;
}
type MarkerValue = Marker | MarkerOptions | LatLngValue;
/**
 * Helper function to set up the marker object
 *
 * @param {MarkerValue} [position] The latitude/longitude pair or the marker options
 * @param {MarkerOptions} [options] The marker options
 * @returns {Marker}
 */
declare const marker: (position?: MarkerValue, options?: MarkerOptions) => Marker;

type GMInfoWindowOptions = {
    ariaLabel?: string;
    content?: string | HTMLElement | Text;
    disableAutoPan?: boolean;
    maxWidth?: number;
    minWidth?: number;
    pixelOffset?: Size;
    position?: LatLng;
    zIndex?: number;
};
type InfoWindowOptions = GMInfoWindowOptions & {
    autoClose?: boolean;
    focus?: boolean;
    pixelOffset?: SizeValue;
    position?: LatLngValue;
    toggleDisplay?: boolean;
};
/**
 * InfoWindow class
 */
declare class InfoWindow extends Layer {
    #private;
    /**
     * Constructor
     *
     * @param {InfoWindowOptions} [options] The InfoWindow options
     */
    constructor(options?: InfoWindowOptions);
    /**
     * Get the aria label for the InfoWindow
     *
     * @returns {string}
     */
    get ariaLabel(): string;
    /**
     * Set the aria label for the InfoWindow
     *
     * @param {string|number} ariaLabel The aria label for the InfoWindow
     */
    set ariaLabel(ariaLabel: string | number);
    /**
     * Get the content for the InfoWindow
     *
     * @returns {string|HTMLElement|Text}
     */
    get content(): string | HTMLElement | Text;
    /**
     * Set the content for the InfoWindow
     *
     * @param {string|HTMLElement|Text} content The content for the InfoWindow
     */
    set content(content: string | HTMLElement | Text);
    /**
     * Get the disableAutoPan option for the InfoWindow
     *
     * @returns {boolean}
     */
    get disableAutoPan(): boolean;
    /**
     * Set the disableAutoPan option for the InfoWindow
     *
     * @param {boolean} disableAutoPan The disableAutoPan option for the InfoWindow
     */
    set disableAutoPan(disableAutoPan: boolean);
    /**
     * Get the maxWidth option for the InfoWindow
     *
     * @returns {number}
     */
    get maxWidth(): number;
    /**
     * Set the maxWidth option for the InfoWindow
     *
     * @param {number|string} maxWidth The maxWidth option for the InfoWindow
     */
    set maxWidth(maxWidth: number | string);
    /**
     * Get the minWidth option for the InfoWindow
     *
     * @returns {number}
     */
    get minWidth(): number;
    /**
     * Set the minWidth option for the InfoWindow
     *
     * @param {number|string} minWidth The minWidth option for the InfoWindow
     */
    set minWidth(minWidth: number | string);
    /**
     * Get the pixelOffset option for the InfoWindow
     *
     * @returns {Size}
     */
    get pixelOffset(): Size;
    /**
     * Set the pixelOffset option for the InfoWindow
     *
     * @param {SizeValue} pixelOffset The pixelOffset option for the InfoWindow
     */
    set pixelOffset(pixelOffset: SizeValue);
    /**
     * Get the position option for the InfoWindow
     *
     * @returns {LatLng}
     */
    get position(): LatLng;
    /**
     * Set the position option for the InfoWindow
     *
     * @param {LatLngValue} position The position option for the InfoWindow
     */
    set position(position: LatLngValue);
    /**
     * Get the zIndex option for the InfoWindow
     *
     * @returns {number}
     */
    get zIndex(): number;
    /**
     * Set the zIndex option for the InfoWindow
     *
     * @param {number|string} zIndex The zIndex option for the InfoWindow
     */
    set zIndex(zIndex: number | string);
    /**
     * Hide the info window
     *
     * Alias to hide()
     */
    close(): void;
    /**
     * Hide the info window
     */
    hide(): void;
    /**
     * Returns whether the InfoWindow is open or not
     *
     * @returns {boolean}
     */
    isOpen(): boolean;
    /**
     * Show the info window
     *
     * Alias to show()
     *
     * @param {Map | Marker} element The anchor object or map object.
     * @returns {InfoWindow}
     */
    open(element: Map | Marker): InfoWindow;
    /**
     * Set the InfoWindow options
     *
     * @param {InfoWindowOptions} options The InfoWindow options
     * @returns {InfoWindow}
     */
    setOptions(options: InfoWindowOptions): InfoWindow;
    /**
     * Set the InfoWindow content
     *
     * @param {string | HTMLElement | Text} content The InfoWindow content
     * @returns {InfoWindow}
     */
    setContent(content: string | HTMLElement | Text): InfoWindow;
    /**
     * Set the InfoWindow position
     *
     * @param {LatLngValue} position The position for the InfoWindow
     * @returns {InfoWindow}
     */
    setPosition(position: LatLngValue): InfoWindow;
    /**
     * Sets the zIndex value for the InfoWindow
     *
     * https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.setZIndex
     *
     * @param {number|string} zIndex The zindex value
     * @returns {InfoWindow}
     */
    setZIndex(zIndex: number | string): InfoWindow;
    /**
     * Show the info window
     *
     * You need to pass in either an anchor object or a map object.
     * If an anchor object is passed in then the info window will be displayed at the anchor's position.
     * If a map object is passed in then the info window will be displayed at the position of the info window.
     *
     * https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.open
     *
     * @param {Map | Marker} element The anchor object or map object.
     *      This should ideally be the Map or Marker object.
     * @returns {InfoWindow}
     */
    show(element: Map | Marker): InfoWindow;
    /**
     * Get the Google maps InfoWindow object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow
     *
     * @returns {google.maps.InfoWindow}
     */
    toGoogle(): google.maps.InfoWindow;
}
type InfoWindowValue = InfoWindow | InfoWindowOptions;
/**
 * Helper function to set up the InfoWindow class
 *
 * @param {InfoWindowValue} [options] The InfoWindow options
 * @returns {InfoWindow}
 */
declare const infoWindow: (options?: InfoWindowValue) => InfoWindow;

type LoaderOptions = {
    apiKey?: string;
    libraries?: Libraries;
    version?: string;
};
/**
 * Class to load the Google maps API
 *
 * This should be a singleton object and prevent multiple loader objects on the page.
 */
declare class Loader extends EventTarget {
    #private;
    /**
     * Class constructor
     *
     * @param {LoaderOptions} [options] The loader options object
     */
    constructor(options?: LoaderOptions);
    /**
     * Get the Google Maps API key
     *
     * @returns {string}
     */
    get apiKey(): string;
    /**
     * Set the Google Maps API key
     *
     * @param {string} apiKey The Google Maps API key
     */
    set apiKey(apiKey: string);
    /**
     * Get the libraries to load with Google maps
     *
     * @returns {Libraries}
     */
    get libraries(): Libraries;
    /**
     * Set the libraries to load with Google maps
     * The "places" library is a common one to load.
     * https://developers.google.com/maps/documentation/javascript/places
     *
     * @param {Libraries} libraries The libraries to load with Google maps
     */
    set libraries(libraries: Libraries);
    /**
     * Get the version of the Google Maps API to load
     *
     * @returns {string}
     */
    get version(): string;
    /**
     * Set the version of the Google Maps API to load
     * https://developers.google.com/maps/documentation/javascript/versions
     *
     * @param {string} version The version of the Google Maps API to load
     */
    set version(version: string);
    /**
     * Set the loader options
     *
     * @param {LoaderOptions} options The loader options object
     * @returns {Loader}
     */
    setOptions(options: LoaderOptions): Loader;
    /**
     * Set the Google Maps API key
     *
     * @param {string} apiKey The Google Maps API key
     * @returns {Loader}
     */
    setApiKey(apiKey: string): Loader;
    /**
     * Set the libraries to load with Google maps
     * The "places" library is a common one to load.
     * https://developers.google.com/maps/documentation/javascript/places
     *
     * @param {Libraries} libraries The libraries to load with Google maps
     * @returns {Loader}
     */
    setLibraries(libraries: Libraries): Loader;
    /**
     * Set the version of the Google Maps API to load
     * https://developers.google.com/maps/documentation/javascript/versions
     *
     * @param {string} version The version of the Google Maps API to load
     * @returns {Loader}
     */
    setVersion(version: string): Loader;
    /**
     * Load the Google maps API
     *
     * @param {Function} callback A callback function to run when the Google maps API has loaded
     * @returns {Promise<void>}
     */
    load(callback?: () => void): Promise<void>;
    /**
     * Dispatch an event
     *
     * @param {string} event The event to dispatch
     */
    dispatch(event: string): void;
    /**
     * Add an event listener to the object.
     *
     * All events on the loader object are set up as "once" events because the
     * load event is only dispatched one time when the Google maps API is loaded.
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener function
     */
    on(type: string, callback: EventListenerOrEventListenerObject): void;
    /**
     * Sets up an event listener that will only be called once
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener function
     */
    once(type: string, callback: EventListenerOrEventListenerObject | null): void;
}
/**
 * Helper function to set up the loader object.
 *
 * Only one loader object can be created on a page.
 * This prevents trying to load the Google maps library multiple times.
 * It also allows us to internally handle when the Google maps library is loaded.
 *
 * @param {LoaderOptions} [config] The loader options
 * @returns {Loader}
 */
declare const loader: (config?: LoaderOptions) => Loader;

type ClusterColor = {
    bgColor: string;
    textColor: string;
};
type ClusterColors = {
    [key: number]: string | ClusterColor;
};

type ClusterImage = {
    height?: number;
    labelClassName?: string;
    labelColor?: string;
    labelFontFamily?: string;
    labelFontSize?: string | number;
    labelFontWeight?: string;
    scaledHeight?: number;
    scaledSize?: SizeValue;
    scaledWidth?: number;
    size?: SizeValue;
    url: string;
    width?: number;
};
type ClusterImageValue = string | ClusterImage;
type ClusterImages = {
    [key: number]: ClusterImageValue;
};

type DefaultRenderOptions = {
    colorRangeBottom?: string | ClusterColor;
    colorRangeTop?: string | ClusterColor;
    /**
     * An object that holds the colors for the clusters. This is used to configure the default renderer for the clusters.
     * Use this instead of the greaterThanAverageColor and lessThanAverageColor options if you want more control over the colors.
     * The key should either be a number and the value should be a string color.
     * If the number of markers in the clsuter is greater or equal to the than the key, the color will be used.
     * The first color should have a key of 0 or 1 to handle clusters with 1 or more markers.
     */
    colors?: ClusterColors;
    labelFontFamily?: string;
    labelFontSize?: string | number;
    centerOpacity?: number;
    middleOpacity?: number;
    outerOpacity?: number;
    showNumber?: boolean;
};
type ImageRendererOptions = {
    /**
     * An object that holds the images for the clusters. This is used to configure the image renderer for the clusters.
     * The key should either be a number and the value should be an object containing the image URL, the width, and height of the image.
     * If the number of markers in the clsuter is greater or equal to the than the key, the image will be used.
     * The first image should have a key of 0 or 1 to handle clusters with 1 or more markers.
     */
    images?: ClusterImages;
    image?: ClusterImageValue;
    labelClassName?: string;
    labelColor?: string;
    labelFontFamily?: string;
    labelFontSize?: string | number;
    labelFontWeight?: string;
    showNumber?: boolean;
};
type MarkerClusterOptions = {
    /**
     * A simple string to set the algorithm. Default is "supercluster" for SuperClusterAlgorithm.
     * This is an alternate way to set the algorithm if you don't want to use the algorithmClass.
     * You can still set algorithmOptions if you use this method.
     */
    algorithm?: 'grid' | 'supercluster' | 'noop';
    /**
     * An algorithm to cluster markers. This determines how many markers are clustered together.
     * Default is SuperClusterAlgorithm. Must provide a `calculate` method accepting AlgorithmInput and returning
     * an array of Cluster.
     *
     * https://googlemaps.github.io/js-markerclusterer/classes/GridAlgorithm.html
     */
    algorithmClass?: Algorithm;
    /**
     * The options for the different algorithms.
     * You can set them in this object, or you can set the individual options with the radius and maxZoom options.
     * - radius
     * - maxZoom
     * - minPoints
     *
     * https://googlemaps.github.io/js-markerclusterer/interfaces/AlgorithmOptions.html
     * https://googlemaps.github.io/js-markerclusterer/interfaces/GridOptions.html
     * https://www.npmjs.com/package/supercluster - This is what the SueprClusterAlgorithm uses
     */
    algorithmOptions?: SuperClusterOptions;
    /**
     * The options for the default renderer.
     */
    defaultRenderOptions?: DefaultRenderOptions;
    /**
     * The options for the image renderer.
     */
    imageRendererOptions?: ImageRendererOptions;
    /**
     * The callback function for when a cluster is clicked.
     * The function will be passed the event, the cluster, and the map.
     */
    onClusterClick?: onClusterClickHandler;
    maxZoom?: number;
    minPoints?: number;
    radius?: number;
    /**
     * An object that converts a cluster into a `google.maps.Marker`.
     * Default is DefaultRenderer.
     * It must provide a `render` method accepting Cluster, ClusterStatus, and `google.maps.Map` and returning a `google.maps.Marker`.
     *
     * https://github.com/googlemaps/js-markerclusterer/blob/main/src/renderer.ts
     * https://googlemaps.github.io/js-markerclusterer/classes/DefaultRenderer.html
     */
    renderer?: Renderer;
};
/**
 * The MarkerCluster class to handle clusting of markers on a map
 */
declare class MarkerCluster extends Base {
    #private;
    /**
     * The constructor for the MarkerCluster class
     *
     * @param {Map} map The map object
     * @param {Marker[]|MarkerClusterOptions} [markers] Markers to cluster. You can also use addMarker() instead of adding the markers here.
     * @param {MarkerClusterOptions} [options] Options for the marker clusterer
     */
    constructor(map: Map, markers?: Marker[] | MarkerClusterOptions, options?: MarkerClusterOptions);
    /**
     * Adds a marker to the cluster
     *
     * @param {Marker} marker The marker to add to the cluster
     * @param {boolean} draw Whether to redraw the clusters after adding the marker.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     * @returns {MarkerCluster}
     */
    addMarker(marker: Marker, draw?: boolean): MarkerCluster;
    /**
     * Add multiple markers to the cluster
     *
     * @param {Marker[]} markers The array of markers to add
     * @param {boolean} draw Whether to redraw the clusters after adding the marker.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     * @returns {MarkerCluster}
     */
    addMarkers(markers: Marker[], draw?: boolean): MarkerCluster;
    /**
     * Clears all of the markers
     *
     * @param {boolean} draw Whether to redraw the clusters after removing all the markers.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     * @returns {MarkerCluster}
     */
    clearMarkers(draw?: boolean): MarkerCluster;
    /**
     * Removes a single marker from the cluster.
     *
     * @param {Marker} marker The marker to remove
     * @param {boolean} draw Whether to redraw the clusters after removing the marker.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     * @returns {MarkerCluster}
     */
    removeMarker(marker: Marker, draw?: boolean): MarkerCluster;
    /**
     * Force a recalculation and redraw of all the marker clusters.
     *
     * @returns {MarkerCluster}
     */
    render(): MarkerCluster;
}
/**
 * Helper function to set up the marker cluster object
 *
 * @param {Map} map The map object
 * @param {Marker[]|MarkerClusterOptions} [markers] Markers to cluster. You can also use addMarker() instead of adding the markers here.
 *      Alternately, you can pass the cluster options here.
 * @param {MarkerClusterOptions} [options] Options for the marker clusterer
 * @returns {MarkerCluster}
 */
declare const markerCluster: (map: Map, markers?: MarkerClusterOptions | Marker[], options?: MarkerClusterOptions) => MarkerCluster;

type PopupOptions = {
    autoHide?: boolean;
    className?: string;
    content: string | HTMLElement | Text;
    offset?: PointValue;
};
/**
 * Popup class
 */
declare class Popup extends Overlay {
    #private;
    /**
     * Constructor
     *
     * @param {PopupOptions} [options] The Popup options
     */
    constructor(options: PopupOptions);
    /**
     * Get the autoHide value
     *
     * @returns {boolean}
     */
    get autoHide(): boolean;
    /**
     * Set the autoHide value
     *
     * @param {boolean} autoHide Whether to automatically hide other open InfoWindows when opening this one
     */
    set autoHide(autoHide: boolean);
    /**
     * Returns the content for the tooltip
     *
     * @returns {string|HTMLElement|Text}
     */
    get content(): string | HTMLElement | Text;
    /**
     * Set the content for the tooltip
     *
     * @param {string|HTMLElement} content The content for the tooltip
     */
    set content(content: string | HTMLElement);
    /**
     * Hide the popup
     *
     * Alias to hide()
     *
     * @returns {Popup}
     */
    close(): Popup;
    /**
     * Hide the popup
     *
     * @returns {Popup}
     */
    hide(): Popup;
    /**
     * Open the popup
     *
     * Alias to show()
     *
     * @param {Map | Marker} element The anchor object or map object.
     * @returns {Popup}
     */
    open(element: Map | Marker): Popup;
    /**
     * Sets the options for the popup
     *
     * @param {PopupOptions} options Popup options
     * @returns {Popup}
     */
    setOptions(options: PopupOptions): Popup;
    /**
     * Set the Popup content
     *
     * @param {string | HTMLElement | Text} content The Popup content
     * @returns {Popup}
     */
    setContent(content: string | HTMLElement | Text): Popup;
    /**
     * Open the popup
     *
     * You need to pass in either an anchor object or a map object.
     * If an anchor object is passed in then the popup will be displayed at the anchor's position.
     * If a map object is passed in then the popup will be displayed at the position of the popup.
     *
     * https://developers.google.com/maps/documentation/javascript/reference/info-window#Popup.open
     *
     * @param {Map | Marker} element The anchor object or map object.
     *      This should ideally be the Map or Marker object and not the Google maps object.
     *      If this is used internally then the Google maps object can be used.
     * @returns {Popup}
     */
    show(element: Map | Marker): Popup;
    /**
     * Add the overlay to the map. Called once after setMap() is called on the overlay with a valid map.
     *
     * @internal
     * @param {google.maps.MapPanes} panes The Google maps panes object
     */
    add(panes: google.maps.MapPanes): void;
    /**
     * Draw the overlay. Called when the overlay is being drawn or updated.
     *
     * @internal
     * @param {google.maps.MapCanvasProjection} projection The Google maps projection object
     */
    draw(projection: google.maps.MapCanvasProjection): void;
}
type PopupValue = Popup | PopupOptions;
/**
 * Helper function to set up the Popup class
 *
 * @param {PopupValue} [options] The Popup options
 * @returns {Popup}
 */
declare const popup: (options?: PopupValue) => Popup;

type GlobalObj = {
    icon: typeof icon;
    Icon: typeof Icon;
    infoWindow: typeof infoWindow;
    InfoWindow: typeof InfoWindow;
    latLng: typeof latLng;
    LatLng: typeof LatLng;
    latLngBounds: typeof latLngBounds;
    LatLngBounds: typeof LatLngBounds;
    loader: typeof loader;
    Loader: typeof Loader;
    map: typeof map;
    Map: typeof Map;
    marker: typeof marker;
    Marker: typeof Marker;
    markerCluster: typeof markerCluster;
    MarkerCluster: typeof MarkerCluster;
    point: typeof point;
    Point: typeof Point;
    popup: typeof popup;
    Popup: typeof Popup;
    size: typeof size;
    Size: typeof Size;
    svgSymbol: typeof svgSymbol;
    SvgSymbol: typeof SvgSymbol;
    tooltip: typeof tooltip;
    Tooltip: typeof Tooltip;
};

declare const G: GlobalObj;

export { G as default };
