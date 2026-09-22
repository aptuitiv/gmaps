/* ===========================================================================
    Base class to help with drawing overlays on the map.

    https://developers.google.com/maps/documentation/javascript/customoverlays

    See https://aptuitiv.github.io/gmaps/api-reference/overlay for documentation.
=========================================================================== */

/* global google, HTMLElement, OverlayView */
/* eslint-disable max-classes-per-file */

import { EventCallback } from './Evented';
import { loader } from './Loader';
import { latLng, LatLng, LatLngValue } from './LatLng';
import Layer from './Layer';
import { Map } from './Map';
import { Point, point, PointValue } from './Point';
import {
    calculateDimensions,
    checkForGoogleMaps,
    isBoolean,
    isNullOrUndefined,
    isNumber,
    isObject,
    isString,
} from './helpers';
import { OverlayEvents } from './constants';
import { LatLngBounds } from './LatLngBounds';

type ResizeStart = {
    neBounds: LatLng;
    nwPos: { x: number; y: number };
    swBounds: LatLng;
    sePos: { x: number; y: number };
    left: number;
    top: number;
    width: number;
    height: number;
};

/**
 * Base class to help with drawing overlays on the map.
 *
 * The methods are purposely left blank so you can override them in your own class.
 * The methods are called from the OverlayView class in the draw(), onAdd(), and onRemove() methods.
 */
export class Overlay extends Layer {
    /**
     * Whether dragging is enabled for this overlay
     *
     * @private
     * @type {boolean}
     */
    #drag: boolean = false;

    /**
     * The starting position when dragging begins
     *
     * @private
     * @type {Point}
     */
    #dragStart!: Point;

    /**
     * Whether the overlay is currently being dragged
     *
     * @private
     * @type {boolean}
     */
    #isDragging: boolean = false;

    /**
     * Whether the overlay is currently being resized
     *
     * @private
     * @type {boolean}
     */
    #isResizing: boolean = false;

    /**
     * Holds the offset for the overlay.
     *
     * This is undefined until an offset is set or read. The constructor used to set a 0,0
     * offset, which allocated a Point for every overlay - and Tooltip and Popup both replace it
     * with their own straight afterwards, so it was thrown away immediately.
     *
     * @private
     * @type {Point|undefined}
     */
    #offset: Point | undefined;

    /**
     * Holds the overlay HTML element. This is the container element that the
     * content for the overlay will get displayed in.
     * That could be a tooltip, a custom info window (popup), or a map overlay.
     *
     * It is built the first time something actually needs it, not in the constructor. A popup
     * attached to every one of 2,595 trail segments used to build 2,595 detached divs before
     * anything was shown, and popups open on a click, so almost none of them are ever needed.
     * Read it through #element() or getOverlayElement(), never directly, so that it exists by
     * the time it's used.
     *
     * private
     *
     * @type {HTMLElement|undefined}
     */
    #overlay: HTMLElement | undefined;

    /**
     * The class names for the overlay element, held here until the element is built.
     *
     * The element used to be the only place this lived, so reading className meant reading the
     * DOM. Keeping it here as well means asking for the class name doesn't build an element.
     *
     * @private
     * @type {string}
     */
    #className: string = '';

    /**
     * The starting overlay position when dragging begins
     *
     * @private
     * @type {Point}
     */
    #overlayStart!: Point;

    /**
     * Holds the overlay view class instance
     *
     * @private
     * @type {google.maps.OverlayView|undefined}
     */
    #overlayView: google.maps.OverlayView | undefined;

    /**
     * Holds the position of the overlay
     *
     * @private
     * @type {LatLng|undefined}
     */
    #position: LatLng | undefined;

    /**
     * Whether resizing is enabled for this overlay
     *
     * @private
     * @type {boolean}
     */
    #resize: boolean = false;

    /**
     * The aspect ratio to maintain during resizing (width / height)
     *
     * @private
     * @type {number}
     */
    #resizeAspectRatio: number = 0;

    /**
     * The corner being resized (nw, ne, sw, se)
     *
     * @protected
     * @type {string}
     */
    resizeCorner: string = '';

    /**
     * The resize handles
     *
     * @private
     * @type {HTMLElement[]}
     */
    #resizeHandles: HTMLElement[] = [];

    /**
     * The starting bounds when resizing begins
     *
     * @protected
     * @type {object}
     */
    resizeStart?: ResizeStart;

    /**
     * Holds the styles for the overlay.
     *
     * @private
     * @type {object}
     */
    #styles: { [key: string]: string } = {};

    /**
     * Constructor
     *
     * @param {string} objectType The object type for the class
     * @param {string} testObject The object that needs Google maps. This should be the name of the object that calls this method.
     * @param {string} [testLibrary] An optional Google maps library class to check for. This needs to be part of the google.maps object.
     */
    constructor(objectType: string, testObject: string, testLibrary?: string) {
        super(objectType, testObject, testLibrary || 'OverlayView');

        // The overlay element is created by #element() when it's first needed, rather than here.
        // The default 0,0 offset is created by getOffset() the same way.
    }

    /**
     * Get the overlay element, building it the first time it's asked for.
     *
     * Everything inside this class reads the element through here. Anything set before the
     * element existed - class names and styles - is written onto it as it's built, so the
     * element ends up in the same state it would have been in if it had been built up front.
     *
     * @private
     * @returns {HTMLElement}
     */
    #element(): HTMLElement {
        if (!this.#overlay) {
            const element = document.createElement('div');
            element.style.position = 'absolute';
            element.style.pointerEvents = 'auto';
            element.style.zIndex = '1000';
            if (this.#className.length > 0) {
                this.#className.split(' ').forEach((cn) => {
                    const name = cn.trim();
                    if (name.length > 0) {
                        element.classList.add(name);
                    }
                });
            }
            Object.keys(this.#styles).forEach((name) => {
                (element.style as unknown as { [key: string]: string })[name] = this.#styles[name];
            });
            this.#overlay = element;
        }
        return this.#overlay;
    }

    /**
     * Whether the overlay element has been built yet.
     *
     * Used by the few places that shouldn't build one just to look at it - removing a class
     * name that was never added, or taking an element off a parent it was never on.
     *
     * @private
     * @returns {boolean}
     */
    #hasElement(): boolean {
        return typeof this.#overlay !== 'undefined';
    }

    /**
     * Get the class name for the overlay element
     *
     * @returns {string}
     */
    get className(): string {
        // Read from the stored value rather than the element, so that asking an overlay for its
        // class name doesn't build one.
        return this.#className;
    }

    /**
     * Set the class name(s) for the overlay element
     *
     * If you need multiple class names then separate them with a space.
     *
     * @param {string} className The class name(s) to add to the overlay.
     *    This can be a space separated list of class names.
     */
    set className(className: string) {
        if (isString(className)) {
            // Class names add to what's already there rather than replacing it, which is what
            // classList.add() did when the element was the only place they were kept. The stored
            // value has to build up the same way or an overlay whose element is built later
            // would end up with a different set of classes than one built straight away.
            const current = this.#className.length > 0 ? this.#className.split(' ') : [];
            className.split(' ').forEach((cn) => {
                const name = cn.trim();
                if (name.length > 0 && !current.includes(name)) {
                    current.push(name);
                }
            });
            this.#className = current.join(' ');
            if (this.#hasElement()) {
                current.forEach((name) => {
                    this.#element().classList.add(name);
                });
            }
        } else if (isNullOrUndefined(className)) {
            this.#className = '';
            if (this.#hasElement()) {
                this.#element().className = '';
            }
        }
    }

    /**
     * Returns whether dragging is enabled
     *
     * @returns {boolean}
     */
    get drag(): boolean {
        return this.#drag;
    }

    /**
     * Set whether dragging is enabled
     *
     * @param {boolean} drag Whether dragging is enabled
     */
    set drag(drag: boolean) {
        if (isBoolean(drag)) {
            this.#drag = drag;
            this.#setupDragHandlers();
        }
    }

    /**
     * Returns the offset value
     *
     * @returns {Point}
     */
    get offset(): Point {
        return this.getOffset();
    }

    /**
     * Set the x,y offset for the overlay
     *
     * This lets you have the offset show a certain number of pixels from it's lat/lng position.
     *
     * @param {PointValue} value The offset value
     */
    set offset(value: PointValue) {
        const pointValue = point(value);
        if (pointValue.isValid()) {
            this.#offset = pointValue;
        }
    }

    /**
     * Returns the position of the overlay
     *
     * @returns {LatLng|undefined}
     */
    get position(): LatLng | undefined {
        return this.#position;
    }

    /**
     * Set the position of the overlay
     *
     * @param {LatLngValue|undefined} value The position of the overlay. Pass undefined to clear the position.
     */
    set position(value: LatLngValue | undefined) {
        const position = latLng(value);
        if (position.isValid()) {
            this.#position = position;
        } else if (isNullOrUndefined(value)) {
            this.#position = undefined;
        }
    }

    /**
     * Returns whether resizing is enabled
     *
     * @returns {boolean}
     */
    get resize(): boolean {
        return this.#resize;
    }

    /**
     * Set whether resizing is enabled
     *
     * @param {boolean} resize Whether resizing is enabled
     */
    set resize(resize: boolean) {
        if (isBoolean(resize)) {
            this.#resize = resize;
            this.#setupResizeHandlers();
        }
    }

    /**
     * Returns the styles for the overlay element
     *
     * @returns {object}
     */
    get styles(): object {
        return this.#styles;
    }

    /**
     * Set multiple styles for the overlay element
     *
     * @param {object} styles The styles to apply to the overlay element
     */
    set styles(styles: object) {
        if (isObject(styles)) {
            Object.keys(styles).forEach((key) => {
                this.style(key, (styles as { [key: string]: string })[key]);
            });
        }
    }

    /**
     * Disable dragging for this overlay
     *
     * @returns {Overlay}
     */
    disableDrag(): Overlay {
        this.drag = false;
        this.trigger(OverlayEvents.DRAGGABLE_CHANGED, {
            draggable: this.drag,
        });
        return this;
    }

    /**
     * Disable resizing for this overlay
     *
     * @returns {Overlay}
     */
    disableResize(): Overlay {
        this.resize = false;
        return this;
    }

    /**
     * Display the overlay on the map
     *
     * Alias to show()
     *
     * @param {Map} map The Map object
     * @returns {Promise<Overlay>}
     */
    display(map: Map): Promise<Overlay> {
        return this.show(map);
    }

    /**
     * Enable dragging for this overlay
     *
     * @returns {Overlay}
     */
    enableDrag(): Overlay {
        this.drag = true;
        this.trigger(OverlayEvents.DRAGGABLE_CHANGED, {
            draggable: this.drag,
        });
        return this;
    }

    /**
     * Enable resizing for this overlay
     *
     * @returns {Overlay}
     */
    enableResize(): Overlay {
        this.resize = true;
        return this;
    }

    /**
     * Get the bounds where the overlay should be displayed
     *
     * This method should be overridden by subclasses and not called directly.
     *
     * @returns {LatLngBounds|undefined}
     */
    // eslint-disable-next-line class-methods-use-this
    getBounds(): LatLngBounds | undefined {
        return new LatLngBounds({
            ne: latLng(),
            sw: latLng(),
        });
    }

    /**
     * Computes the geographical coordinates from pixel coordinates in the map's container.
     *
     * This is a shortcut to getting the projection from the overlay and then calling
     * fromContainerPixelToLatLng on the projection with the pixel value.
     *
     * @param {PointValue} x The Point value or the x numeric point value.
     * @param {number} [y] The y value if x is a number.
     * @returns {LatLng}
     */
    getContainerLatLngFromPixel(x: PointValue, y?: number): LatLng {
        // point() handles every PointValue form: a Point, an [x, y] array, a "4"/"5" number
        // string pair, an {x, y} object, or two plain numbers.
        const pixel = point(x, y);
        const projection = this.getProjection();
        if (projection) {
            return latLng(projection.fromContainerPixelToLatLng(pixel.toGoogle()) ?? undefined);
        }
        return latLng();
    }

    /**
     * Computes the geographical coordinates from pixel coordinates in the div that holds the draggable map.
     *
     * This is a shortcut to getting the projection from the overlay and then calling
     * fromDivPixelToLatLng on the projection with the pixel value.
     *
     * @param {PointValue} x The Point value or the x numeric point value.
     * @param {number} [y] The y value if x is a number.
     * @returns {LatLng}
     */
    getDivLatLngFromPixel(x: PointValue, y?: number): LatLng {
        // See the comment in getContainerLatLngFromPixel() about point().
        const pixel = point(x, y);
        const projection = this.getProjection();
        if (projection) {
            return latLng(projection.fromDivPixelToLatLng(pixel.toGoogle()) ?? undefined);
        }
        return latLng();
    }

    /**
     * Get the offset value
     *
     * @returns {Point}
     */
    getOffset(): Point {
        // Built on first use so that an overlay which never needs an offset never allocates one,
        // and so that Tooltip and Popup don't pay for a default that they immediately replace.
        // It isn't a shared instance because Point is mutable through its setters, and
        // Object.freeze can't stop that - the values are held in #private fields, not properties.
        if (this.#offset === undefined) {
            this.#offset = point(0, 0);
        }
        return this.#offset;
    }

    /**
     * Get the overlay HTML element
     *
     * @returns {HTMLElement}
     */
    getOverlayElement(): HTMLElement {
        // Builds the element if it doesn't exist yet. This is how every subclass reaches it -
        // Popup, Tooltip and ImageOverlay all go through here - so none of them had to change
        // when the element stopped being built in the constructor.
        return this.#element();
    }

    /**
     * Get the position of the overlay
     *
     * @returns {LatLng|undefined}
     */
    getPosition(): LatLng | undefined {
        return this.position;
    }

    /**
     * Returns the MapCanvasProjection object associated with this OverlayView.
     *
     * The projection is not initialized until onAdd is called by the API.
     * This returns undefined if the Google maps overlay view hasn't been set up yet.
     *
     * https://developers.google.com/maps/documentation/javascript/reference/overlay-view#MapCanvasProjection
     *
     * @returns {google.maps.MapCanvasProjection|undefined}
     */
    getProjection(): google.maps.MapCanvasProjection | undefined {
        return this.#overlayView?.getProjection();
    }

    /**
     * Get the current aspect ratio for resizing
     *
     * @returns {number}
     */
    getResizeAspectRatio(): number {
        return this.#resizeAspectRatio;
    }

    /**
     * Returns whether the overlay has a position
     *
     * @returns {boolean}
     */
    hasPosition(): boolean {
        return this.#position instanceof LatLng;
    }

    /**
     * Hide the overlay
     *
     * @returns {Overlay}
     */
    hide(): Overlay {
        if (this.#overlayView) {
            this.#overlayView.setMap(null);
            this.removeMap();
            this.isVisible = false;
        }
        return this;
    }

    /**
     * Returns whether the overlay is draggable
     *
     * @returns {boolean}
     */
    isDraggable(): boolean {
        return this.drag;
    }

    /**
     * Moves the overlay to a new position.
     *
     * If the overlay is not visible, it will be shown.
     * If it's already visible on the map, it will be moved to the new position.
     *
     * @param {LatLngValue|undefined} position The latitude/longitude position of where the overlay should show
     * @param {Map} [map] The Map object
     * @returns {Promise<Overlay>}
     */
    move(position: LatLngValue | undefined, map?: Map): Promise<Overlay> {
        return new Promise((resolve, reject) => {
            let mapObject = map;
            if (typeof mapObject === 'undefined') {
                mapObject = this.getMap() ?? undefined;
            }
            this.position = position;
            if (mapObject instanceof Map) {
                if (this.#overlayView) {
                    // Setting the map will trigger the redraw
                    this.#attachToGoogleMap(mapObject);
                    this.isVisible = true;
                    super.setMap(mapObject);
                    this.dispatch(OverlayEvents.OPEN);
                    resolve(this);
                } else {
                    this.show(mapObject).then(() => {
                        this.dispatch(OverlayEvents.OPEN);
                        resolve(this);
                    });
                }
            } else {
                reject(new Error('Map object is not set'));
            }
        });
    }

    /**
     * Add an event listener for when dragging ends
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDragEnd(callback: EventCallback): void {
        this.on(OverlayEvents.DRAG_END, callback);
    }

    /**
     * Add an event listener for when dragging updates the overlay position
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDrag(callback: EventCallback): void {
        this.on(OverlayEvents.DRAG, callback);
    }

    /**
     * Add an event listener for when the overlay draggable property changes
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDraggableChanged(callback: EventCallback): void {
        this.on(OverlayEvents.DRAGGABLE_CHANGED, callback);
    }

    /**
     * Add an event listener for when dragging the overlay starts
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDragStart(callback: EventCallback): void {
        this.on(OverlayEvents.DRAG_START, callback);
    }

    /**
     * Add an event listener for when the overlay is opened.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onOpen(callback: EventCallback): void {
        this.on(OverlayEvents.OPEN, callback);
    }

    /**
     * Add an event listener for when resizing ends
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onResizeEnd(callback: EventCallback): void {
        this.on(OverlayEvents.RESIZE_END, callback);
    }

    /**
     * Add an event listener for when resizing updates the overlay position
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onResize(callback: EventCallback): void {
        this.on(OverlayEvents.RESIZE, callback);
    }

    /**
     * Add an event listener for when resizing the overlay starts
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onResizeStart(callback: EventCallback): void {
        this.on(OverlayEvents.RESIZE_START, callback);
    }

    /**
     * Removes a class name from the overlay element
     *
     * @param {string} className The class name to remove from the overlay element
     * @returns {Overlay}
     */
    removeClassName(className: string): Overlay {
        const classes = className.split(' ').map((cn) => cn.trim());
        // Taken off the stored value whether or not there's an element yet. Removing a class
        // from an overlay that was never built shouldn't build one just to remove it from.
        if (this.#className.length > 0) {
            this.#className = this.#className
                .split(' ')
                .filter((name) => !classes.includes(name))
                .join(' ');
        }
        if (this.#hasElement()) {
            const element = this.#element();
            classes.forEach((cn) => {
                element.classList.remove(cn);
            });
        }
        return this;
    }

    /**
     * Set the class name(s) for the overlay element
     *
     * If you need multiple class names then separate them with a space.
     *
     * @param {string} className The class name(s) to add to the overlay.
     *    This can be a space separated list of class names.
     * @returns {Overlay}
     */
    setClassName(className: string): Overlay {
        this.className = className;
        return this;
    }

    /**
     * Set the map object to display the overlay in
     *
     * Alias to show()
     *
     * @param {Map} map The Map object
     * @returns {Promise<Overlay>}
     */
    setMap(map: Map): Promise<Overlay> {
        return this.show(map);
    }

    /**
     * Set the x,y offset for the overlay
     *
     * This lets you have the offset show a certain number of pixels from it's lat/lng position.
     *
     * @param {PointValue} offset The offset value
     * @returns {Overlay}
     */
    setOffset(offset: PointValue): Overlay {
        this.offset = offset;
        return this;
    }

    /**
     * Set the position of the overlay
     *
     * @param {LatLngValue|undefined} position The latitude/longitude position of where the overlay should show.
     *    Pass undefined to clear the position.
     * @returns {Overlay}
     */
    setPosition(position: LatLngValue | undefined): Overlay {
        this.position = position;
        return this;
    }

    /**
     * Set the aspect ratio to maintain during resizing
     *
     * @param {number} aspectRatio The aspect ratio (width / height)
     * @returns {Overlay}
     */
    setResizeAspectRatio(aspectRatio: number): Overlay {
        if (isNumber(aspectRatio) && aspectRatio > 0) {
            this.#resizeAspectRatio = aspectRatio;
        }
        return this;
    }

    /**
     * Set one more styles for the overlay element. This will merge styles with an existing ones.
     *
     * @param {object} styles The styles to apply to the overlay element
     * @returns {Overlay}
     */
    setStyles(styles: object): Overlay {
        this.styles = styles;
        return this;
    }

    /**
     * Add the overlay to the map.
     *
     * Alias for setMap()
     *
     * @param {Map} map The Map object
     * @returns {Promise<Overlay>}
     */
    show(map: Map): Promise<Overlay> {
        return new Promise((resolve) => {
            if (map instanceof Map) {
                this.#setupGoogleOverlay();
                if (this.#overlayView) {
                    super.setMap(map);
                    this.#attachToGoogleMap(map);
                    this.isVisible = true;
                    this.dispatch(OverlayEvents.OPEN);
                    resolve(this);
                } else {
                    // The Google maps library isn't loaded yet. Wait for it to load.
                    loader().onMapLoad(() => {
                        this.#setupGoogleOverlay();
                        super.setMap(map);
                        if (this.#overlayView) {
                            this.#attachToGoogleMap(map);
                            this.isVisible = true;
                        }
                        this.dispatch(OverlayEvents.OPEN);
                        resolve(this);
                    });
                }
            } else {
                this.dispatch(OverlayEvents.OPEN);
                resolve(this);
            }
        });
    }

    /**
     * Set a single style on the overlay element
     *
     * @param {string} name The style name
     * @param {string} value The style value
     * @returns {Overlay}
     */
    style(name: string, value: string): Overlay {
        if (isString(name) && isString(value)) {
            // Don't write to the DOM if the value hasn't changed. draw() runs on every frame
            // while the map is panned or zoomed and most of the styles it sets are the same
            // every time, so this saves a style write per frame per overlay.
            if (this.#styles[name] === value) {
                return this;
            }
            this.#styles[name] = value;
            // Only written to the element if there is one. #styles is the record either way, and
            // #element() replays it when the element is built, so a style set on an overlay that
            // was never shown still ends up on its element if it is ever needed.
            if (this.#hasElement()) {
                // Index the style declaration by name so that both camelCase and dashed property names work.
                (this.#element().style as unknown as { [key: string]: string })[name] = value;
            }
        }
        return this;
    }

    /**
     * Toggle the display of the overlay on the map
     *
     * @param {Map} map The map object
     * @returns {void}
     */
    toggle(map: Map): void {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show(map);
        }
    }

    /**
     * Set up drag event handlers
     *
     * @private
     */
    #setupDragHandlers(): void {
        // An overlay that can be dragged needs its element, so this builds one rather than
        // waiting. There is nothing to attach a mousedown listener to otherwise.
        const element = this.#element();
        if (this.#drag) {
            element.style.cursor = 'move';
            element.style.pointerEvents = 'auto';
            element.style.border = '2px solid #007bff';
            element.addEventListener('mousedown', this.#handleDragStart);
            element.addEventListener('touchstart', this.#handleDragStart);

            // Ensure map events are prevented
            if (checkForGoogleMaps('Overlay', 'OverlayView', false)) {
                google.maps.OverlayView.preventMapHitsAndGesturesFrom(element);
            }
        } else {
            element.style.cursor = '';
            element.style.pointerEvents = '';
            // Take the outline away again. Resizing draws the same outline, so it's only
            // removed when resizing isn't using it - otherwise turning dragging off would
            // leave a resizable overlay with no handles visible around it.
            if (!this.#resize) {
                element.style.border = 'none';
            }
            element.removeEventListener('mousedown', this.#handleDragStart);
            element.removeEventListener('touchstart', this.#handleDragStart);
        }
    }

    /**
     * Set up resize event handlers
     *
     * @private
     */
    #setupResizeHandlers(): void {
        if (this.#resize) {
            this.#createResizeHandles();
        } else {
            this.#removeResizeHandles();
        }
    }

    /**
     * Create resize handles
     *
     * @private
     */
    #createResizeHandles(): void {
        this.#removeResizeHandles();

        // An overlay that can be resized needs its element - the handles are appended to it.
        const element = this.#element();
        element.style.border = '2px solid #007bff';

        const corners = ['nw', 'ne', 'sw', 'se'];
        const cursors: { [key: string]: string } = {
            nw: 'nwse-resize',
            ne: 'nesw-resize',
            sw: 'nesw-resize',
            se: 'nwse-resize',
        };
        corners.forEach((corner) => {
            const handle = document.createElement('div');
            handle.className = `resize-handle resize-${corner}`;
            handle.style.cssText = `
                position: absolute;
                width: 12px;
                height: 12px;
                background: #fff;
                border: 2px solid #007bff;
                border-radius: 50%;
                cursor: ${cursors[corner]};
                z-index: 1000;
                pointer-events: auto;
            `;

            // Position the handles
            switch (corner) {
                case 'nw':
                    handle.style.top = '-6px';
                    handle.style.left = '-6px';
                    break;
                case 'ne':
                    handle.style.top = '-6px';
                    handle.style.right = '-6px';
                    break;
                case 'sw':
                    handle.style.bottom = '-6px';
                    handle.style.left = '-6px';
                    break;
                case 'se':
                    handle.style.bottom = '-6px';
                    handle.style.right = '-6px';
                    break;
                default:
                    // Default to top-left
                    handle.style.top = '-6px';
                    handle.style.left = '-6px';
                    break;
            }

            handle.addEventListener('mousedown', (e) => this.#handleResizeStart(e, corner));
            handle.addEventListener('touchstart', (e) => this.#handleResizeStart(e, corner));

            // Prevent map events on resize handles
            if (checkForGoogleMaps('Overlay', 'OverlayView', false)) {
                google.maps.OverlayView.preventMapHitsAndGesturesFrom(handle);
            }

            element.appendChild(handle);
            this.#resizeHandles.push(handle);
        });
    }

    /**
     * Remove resize handles
     *
     * @private
     */
    #removeResizeHandles(): void {
        this.#resizeHandles.forEach((handle) => {
            if (handle.parentNode) {
                handle.parentNode.removeChild(handle);
            }
        });
        this.#resizeHandles = [];
        // Dragging draws the same outline, so leave it alone when dragging is still on.
        // #createResizeHandles calls this before building new handles and then sets the border
        // itself, so nothing is lost by skipping it here.
        //
        // There's nothing to clear if the element was never built either, and building one just
        // to take a border off it would be silly.
        if (!this.#drag && this.#hasElement()) {
            this.#element().style.border = 'none';
        }
    }

    /**
     * Handle drag start
     *
     * @private
     * @param {MouseEvent | TouchEvent} e The event
     */
    #handleDragStart = (e: MouseEvent | TouchEvent): void => {
        if (!this.#drag || this.#isResizing) return;

        e.preventDefault();
        e.stopPropagation();

        this.#isDragging = true;
        this.#dragStart = point(
            e instanceof MouseEvent ? [e.clientX, e.clientY] : [e.touches[0].clientX, e.touches[0].clientY],
        );
        // A drag can only start on an element that was pressed, so it exists by now
        const element = this.#element();
        this.#overlayStart = point(parseInt(element.style.left, 10) || 0, parseInt(element.style.top, 10) || 0);

        document.addEventListener('mousemove', this.#handleDrag);
        document.addEventListener('mouseup', this.#handleDragEnd);
        document.addEventListener('touchmove', this.#handleDrag);
        document.addEventListener('touchend', this.#handleDragEnd);

        this.dispatch(OverlayEvents.DRAG_START, { event: e });
    };

    /**
     * Handle drag
     *
     * @private
     * @param {MouseEvent | TouchEvent} e The event
     */
    #handleDrag = (e: MouseEvent | TouchEvent): void => {
        if (!this.#isDragging) return;

        e.preventDefault();

        const currentPos = point(
            e instanceof MouseEvent ? [e.clientX, e.clientY] : [e.touches[0].clientX, e.touches[0].clientY],
        );
        const delta = currentPos.subtract(this.#dragStart);

        // Update the overlay position based on the original overlay position plus the total delta
        const newLeft = this.#overlayStart.getX() + delta.getX();
        const newTop = this.#overlayStart.getY() + delta.getY();

        const element = this.#element();
        element.style.left = `${newLeft}px`;
        element.style.top = `${newTop}px`;

        // Calculate new bounds and dispatch event
        this.updateBoundsFromPosition();
        this.dispatch(OverlayEvents.DRAG, { event: e, delta });
    };

    /**
     * Handle drag end
     *
     * @private
     * @param {MouseEvent | TouchEvent} e The event
     */
    #handleDragEnd = (e: MouseEvent | TouchEvent): void => {
        if (!this.#isDragging) return;

        this.#isDragging = false;

        document.removeEventListener('mousemove', this.#handleDrag);
        document.removeEventListener('mouseup', this.#handleDragEnd);
        document.removeEventListener('touchmove', this.#handleDrag);
        document.removeEventListener('touchend', this.#handleDragEnd);

        this.dispatch(OverlayEvents.DRAG_END, { event: e });
    };

    /**
     * Handle resize start
     *
     * @private
     * @param {MouseEvent | TouchEvent} e The event
     * @param {string} corner The corner being resized
     */
    #handleResizeStart = (e: MouseEvent | TouchEvent, corner: string): void => {
        if (!this.#resize || this.#isDragging) return;

        e.preventDefault();
        e.stopPropagation();

        // Resizing needs the map container and the corners of the overlay's current bounds.
        const mapContainer = this.getMap()?.getDiv();
        const currentBounds = this.getBounds();
        const neBounds = currentBounds?.getNorthEast();
        const swBounds = currentBounds?.getSouthWest();
        if (!mapContainer || !neBounds || !swBounds) return;

        this.#isResizing = true;
        this.resizeCorner = corner;

        const containerRect = mapContainer.getBoundingClientRect();
        // A resize starts from a handle, which lives inside the element, so it exists by now
        const element = this.#element();
        const currentSize = element.getBoundingClientRect();

        // Get the current bounds, position, and size of the overlay before resizing.
        // These values will be used to calculate the new bounds, position, and size of the overlay after resizing.
        this.resizeStart = {
            // Northeast lat/lng
            neBounds,
            // Current top left position of the overlay within the map container.
            // This is used to calculate the new position of the overlay after resizing from the top left.
            nwPos: { x: currentSize.left - containerRect.left, y: currentSize.top - containerRect.top },
            // Southwest lat/lng
            swBounds,
            // Current bottom right position of the overlay within the map container.
            // This is used to calculate the new position of the overlay after resizing from the bottom right.
            sePos: { x: currentSize.right - containerRect.left, y: currentSize.bottom - containerRect.top },
            // Current left position within the overlay container
            left: parseInt(element.style.left, 10) || 0,
            // Current top position within the overlay container
            top: parseInt(element.style.top, 10) || 0,
            // Current width of the overlay container
            width: currentSize.width,
            // Current height of the overlay container
            height: currentSize.height,
        };

        document.addEventListener('mousemove', this.#handleResize);
        document.addEventListener('mouseup', this.#handleResizeEnd);
        document.addEventListener('touchmove', this.#handleResize);
        document.addEventListener('touchend', this.#handleResizeEnd);

        this.dispatch(OverlayEvents.RESIZE_START, { event: e, corner });
    };

    /**
     * Handle resize
     *
     * @private
     * @param {MouseEvent | TouchEvent} e The event
     */
    #handleResize = (e: MouseEvent | TouchEvent): void => {
        if (!this.#isResizing) return;

        e.preventDefault();

        const projection = this.getProjection();

        // Get the map container and its bounding client rectangle to get the mouse position relative to the map
        const mapContainer = this.getMap()?.getDiv();

        // The values recorded when the resize started. They only exist once a resize has begun,
        // and this only runs during one, so there is normally something here - but the field is
        // public, so it can't be taken on trust.
        const start = this.resizeStart;

        if (projection && mapContainer && start) {
            const containerRect = mapContainer.getBoundingClientRect();
            const eventX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
            const eventY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
            const mouseX = eventX - containerRect.left;
            const mouseY = eventY - containerRect.top;

            // Get the top right x/y coordinates
            const neGoogle = start.neBounds.toGoogle();
            const topRight = neGoogle ? projection.fromLatLngToContainerPixel(neGoogle) : null;
            // Get the bottom left x/y coordinates
            const swGoogle = start.swBounds.toGoogle();
            const bottomLeft = swGoogle ? projection.fromLatLngToContainerPixel(swGoogle) : null;

            let newWidth: number;
            let newHeight: number;
            let newLeft: number;
            let newTop: number;

            if (this.resizeCorner === 'nw') {
                // If the current position is below the bottom left corner or to the right of the top right corner,
                // then do not continue with the resize
                if (!bottomLeft || !topRight || mouseY > bottomLeft.y || mouseX > topRight.x) {
                    return;
                }
                // Calculate the difference between the current position and the top right
                const diffX = start.nwPos.x - mouseX;
                const diffY = start.nwPos.y - mouseY;
                // Calculate new dimensions
                newWidth = start.width + diffX;
                newHeight = start.height + diffY;
                newLeft = start.left - diffX;
                newTop = start.top - diffY;
            } else if (this.resizeCorner === 'ne') {
                // If the current position is below the bottom left corner or to the left of the bottom left corner,
                // then do not continue with the resize
                if (!bottomLeft || !topRight || mouseY > bottomLeft.y || mouseX < bottomLeft.x) {
                    return;
                }
                // Calculate the difference between the current position and the top right
                const diffX = topRight.x - mouseX;
                const diffY = topRight.y - mouseY;
                // Calculate new dimensions
                newWidth = start.width - diffX;
                newHeight = start.height + diffY;
                newLeft = start.left;
                newTop = start.top - diffY;
            } else if (this.resizeCorner === 'sw') {
                // If the current position is above the top left corner or to the right of the top right corner,
                // then do not continue with the resize
                if (!bottomLeft || !topRight || mouseY < start.top || mouseX > topRight.x) {
                    return;
                }

                // Calculate the difference between the current position and the bottom left
                const diffX = bottomLeft.x - mouseX;
                const diffY = bottomLeft.y - mouseY;

                // Calculate new dimensions
                newWidth = start.width + diffX;
                newHeight = start.height - diffY;
                newLeft = start.left - diffX;
                newTop = start.top;
            } else if (this.resizeCorner === 'se') {
                // If the current position is above the top left corner or to the left of the top left corner,
                // then do not continue with the resize
                if (mouseY < start.top || mouseX < start.left) {
                    return;
                }

                // Calculate the difference between the current position and the bottom right
                const diffX = start.sePos.x - mouseX;
                const diffY = start.sePos.y - mouseY;

                // Calculate new dimensions
                newWidth = start.width - diffX;
                newHeight = start.height - diffY;
                newLeft = start.left;
                newTop = start.top;
            } else {
                // Not a known corner so there is nothing to resize
                return;
            }

            // Apply aspect ratio constraint if set
            const constrained = calculateDimensions(this.#resizeAspectRatio, newWidth, newHeight);

            // Update the overlay dimensions and position
            const element = this.#element();
            element.style.width = `${constrained.width}px`;
            element.style.height = `${constrained.height}px`;
            element.style.left = `${newLeft}px`;
            element.style.top = `${newTop}px`;

            if (this.#resizeAspectRatio > 0) {
                // If the aspect ratio is set, then we need to calculate the new lat/lng position based on the new dimensions.
                const newContainerRect = element.getBoundingClientRect();
                const mapContainerRect = mapContainer.getBoundingClientRect();
                // Need to get the NE and SW pixel coordinates of the container within the map container.
                const nePos = {
                    x: newContainerRect.right - mapContainerRect.left,
                    y: newContainerRect.top - mapContainerRect.top,
                };
                const swPos = {
                    x: newContainerRect.left - mapContainerRect.left,
                    y: newContainerRect.bottom - mapContainerRect.top,
                };
                const neLatLng = this.getContainerLatLngFromPixel(nePos.x, nePos.y);
                const swLatLng = this.getContainerLatLngFromPixel(swPos.x, swPos.y);
                this.setBoundsFromResize(neLatLng, swLatLng);
            } else {
                // Set the new lat/lng position based on the mouse position.
                const newLatLng = this.getContainerLatLngFromPixel(mouseX, mouseY);
                this.updateBoundsFromResize(newLatLng);
            }

            this.dispatch(OverlayEvents.RESIZE, { event: e, corner: this.resizeCorner });
        }
    };

    /**
     * Handle resize end
     *
     * @private
     * @param {MouseEvent | TouchEvent} e The event
     */
    #handleResizeEnd = (e: MouseEvent | TouchEvent): void => {
        if (!this.#isResizing) return;

        this.#isResizing = false;
        this.resizeCorner = '';

        document.removeEventListener('mousemove', this.#handleResize);
        document.removeEventListener('mouseup', this.#handleResizeEnd);
        document.removeEventListener('touchmove', this.#handleResize);
        document.removeEventListener('touchend', this.#handleResizeEnd);

        this.dispatch(OverlayEvents.RESIZE_END, { event: e });
    };

    /**
     * Update bounds from current position
     *
     * @protected
     */
    // eslint-disable-next-line class-methods-use-this
    updateBoundsFromPosition(): void {
        // This method will be overridden by subclasses
    }

    /**
     * Update bounds from resize
     *
     * @protected
     * @param {LatLng} neLatLng The new lat/lng position for the northeast corner
     * @param {LatLng} swLatLng The new lat/lng position for the southwest corner
     */
    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
    setBoundsFromResize(neLatLng: LatLng, swLatLng: LatLng): void {
        // This method will be overridden by subclasses
    }

    /**
     * Update bounds from resize
     *
     * @protected
     * @param {LatLng} newLatLng The new lat/lng position
     */
    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
    updateBoundsFromResize(newLatLng: LatLng): void {
        // This method will be overridden by subclasses
    }

    /**
     * Set up the Google maps overlay object if necessary
     *
     * @private
     */
    /**
     * Attach the overlay to the Google map object.
     *
     * The Google map object doesn't exist until the map has been initialized, so toGoogle()
     * returns undefined until then. Passing that on as null attached the overlay to nothing,
     * which left it silently off the map even though it reported itself as visible.
     *
     * When the map isn't set up yet it's told to initialize and the overlay is attached once
     * it's ready. The promise that show() and move() return is deliberately not tied to
     * init(): the map waits on an IntersectionObserver when its element is hidden, so init()
     * can take a long time to settle, or never settle at all. Marker and Polyline trigger the
     * map the same way.
     *
     * @private
     * @param {Map} map The map to attach the overlay to
     */
    #attachToGoogleMap(map: Map): void {
        const overlayView = this.#overlayView;
        if (!overlayView) {
            return;
        }
        const googleMap = map.toGoogle();
        if (googleMap) {
            overlayView.setMap(googleMap);
        } else {
            // See the note in Marker: a dropped rejection becomes an unhandled error
            map.init().catch((error) => {
                // eslint-disable-next-line no-console
                console.error('The map could not be loaded, so the overlay was not set up.', error);
            });
            map.onReady(() => {
                // The overlay could have been hidden, or moved to another map, while the map
                // was being set up, so only attach it if it's still waiting for this one.
                if (this.getMap() === map) {
                    const readyMap = map.toGoogle();
                    if (readyMap) {
                        overlayView.setMap(readyMap);
                    }
                }
            });
        }
    }

    #setupGoogleOverlay() {
        if (!isObject(this.#overlayView)) {
            if (checkForGoogleMaps('Overlay', 'OverlayView', false)) {
                // Get the overlay view class
                // eslint-disable-next-line no-use-before-define
                this.#overlayView = getOverlayViewClass(this);

                // Stops click, tap, drag, and wheel events on the element from bubbling up to the map.
                // This prevents map dragging and zooming, as well as map "click" events.
                //
                // This runs when the overlay is being shown, which is the point at which the
                // element is needed anyway, so building it here costs nothing that was avoidable.
                google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.#element());
            }
        }
    }

    /**
     * Add the overlay to the map. Called once after setMap() is called on the overlay with a valid map.
     *
     * This is called by the internal OverlayView class. It should not be called directly.
     *
     * @internal
     * @param {google.maps.MapPanes} panes The Google maps panes object
     */
    add(panes: google.maps.MapPanes) {} // eslint-disable-line class-methods-use-this, @typescript-eslint/no-unused-vars

    /**
     * Draw the overlay. Called when the overlay is being drawn or updated.
     *
     * This is called by the internal OverlayView class. It should not be called directly.
     *
     * @internal
     * @param {google.maps.MapCanvasProjection} projection The Google maps projection object
     */
    draw(projection: google.maps.MapCanvasProjection) {} // eslint-disable-line class-methods-use-this, @typescript-eslint/no-unused-vars

    /**
     * Remove the overlay from the map.
     * This method is called once following a call to setMap(null).
     *
     * This is called by the internal OverlayView class. It should not be called directly.
     *
     * @internal
     */
    remove() {
        // An overlay that was never built has nothing on the page to take off it. Google calls
        // this through onRemove(), so it has to be safe for an overlay that never drew.
        if (!this.#hasElement()) {
            return;
        }
        const element = this.#element();
        if (element.parentElement) {
            element.parentElement.removeChild(element);
        }
    }
}

/**
 * Gets the overlay view class object
 *
 * Because the Google maps library may not be loaded yet, we need to check for it.
 * We can't simply extend the google.maps.OverlayView class because it may not exist
 * when this code is loaded. This ensures that it exists.
 *
 * @param {Overlay} classObject The overlay class object
 * @returns {OverlayView}
 */
// Holds the overlay view class once it's been built. The class can't be declared at the top
// level because google.maps.OverlayView doesn't exist until the Google Maps library loads, but
// it only needs to be built once. Declaring it inside the function gave every overlay its own
// class and its own prototype, which meant the engine saw a different shape at each draw() call
// site and couldn't optimise them.
let OverlayViewClass: (new (overlay: Overlay) => google.maps.OverlayView) | undefined;

/**
 * Build the overlay view class, once
 *
 * @returns {Function} The overlay view class
 */
const buildOverlayViewClass = () => {
    /**
     * Basic overlay class to handle displaying the overlay
     */
    class OverlayView extends google.maps.OverlayView {
        /**
         * Holds the class instance for this overlay
         *
         * @private
         * @type {Overlay}
         */
        #overlay: Overlay;

        /**
         * Constructor
         *
         * @param {Overlay} overlay The overlay class instance
         */
        constructor(overlay: Overlay) {
            super();
            this.#overlay = overlay;
        }

        /**
         * Called when the overlay is being drawn or updated. Use the position
         * from projection.fromLatLngToDivPixel() to correctly position the overlay
         * relative to the MapPanes. This method is called after onAdd(), and is
         * called on change of zoom or center.
         */
        draw() {
            this.#overlay.draw(this.getProjection());
        }

        /**
         * Called once after setMap() is called with a valid map. At this point,
         * panes and projection will have been initialized. Used to initialize the overlay DOM elements.
         */
        onAdd() {
            this.#overlay.add(this.getPanes()!);
        }

        /**
         * This method is called once following a call to setMap(null).
         * Used to remove the overlay from the map.
         */
        onRemove() {
            this.#overlay.remove();
        }
    }
    return OverlayView;
};

/**
 * Gets an overlay view object for the overlay
 *
 * @param {Overlay} classObject The overlay class object
 * @returns {google.maps.OverlayView}
 */
const getOverlayViewClass = (classObject: Overlay): google.maps.OverlayView => {
    if (!OverlayViewClass) {
        OverlayViewClass = buildOverlayViewClass() as unknown as new (overlay: Overlay) => google.maps.OverlayView;
    }
    return new OverlayViewClass(classObject);
};

/**
 * Helper function to set up the overlay object
 *
 * @returns {Overlay}
 */
export const overlay = (): Overlay => new Overlay('overlay', 'OverlayView');
