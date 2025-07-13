/* ===========================================================================
    Base class to help with drawing overlays on the map.

    https://developers.google.com/maps/documentation/javascript/customoverlays

    See https://aptuitiv.github.io/gmaps-docs/api-reference/overlay for documentation.
=========================================================================== */

/* global google, HTMLElement, OverlayView */
/* eslint-disable max-classes-per-file */

import { EventCallback } from './Evented';
import { loader } from './Loader';
import { latLng, LatLng, LatLngValue } from './LatLng';
import Layer from './Layer';
import { Map } from './Map';
import { Point, point, PointValue } from './Point';
import { checkForGoogleMaps, isNullOrUndefined, isNumber, isObject, isString } from './helpers';
import { OverlayEvents } from './constants';

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
     * Holds the offset for the overlay
     *
     * @private
     * @type {Point}
     */
    #offset: Point;

    /**
     * Holds the overlay HTML element. This is the container element that the
     * content for the overlay will get displayed in.
     * That could be a tooltip, a custom info window (popup), or a map overlay.
     *
     * private
     *
     * @type {HTMLElement}
     */
    #overlay: HTMLElement;

    /**
     * Holds the overlay view class instance
     *
     * @private
     * @type {google.maps.OverlayView}
     */
    #overlayView: google.maps.OverlayView;

    /**
     * Holds the position of the overlay
     *
     * @private
     * @type {LatLng}
     */
    #position: LatLng;

    /**
     * Holds the styles for the overlay.
     *
     * @private
     * @type {object}
     */
    #styles: object = {};

    /**
     * Whether dragging is enabled for this overlay
     *
     * @private
     * @type {boolean}
     */
    #draggable: boolean = false;

    /**
     * Whether resizing is enabled for this overlay
     *
     * @private
     * @type {boolean}
     */
    #resizable: boolean = false;

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
     * The corner being resized (nw, ne, sw, se)
     *
     * @private
     * @type {string}
     */
    #resizeCorner: string = '';

    /**
     * The starting position when dragging begins
     *
     * @private
     * @type {Point}
     */
    #dragStart: Point;

    /**
     * The starting overlay position when dragging begins
     *
     * @private
     * @type {Point}
     */
    #overlayStart: Point;

    /**
     * The starting bounds when resizing begins
     *
     * @protected
     * @type {object}
     */
    resizeStart: ResizeStart;

    /**
     * The resize handles
     *
     * @private
     * @type {HTMLElement[]}
     */
    #resizeHandles: HTMLElement[] = [];

    /**
     * The corner being resized (nw, ne, sw, se)
     *
     * @protected
     * @type {string}
     */
    resizeCorner: string = '';

    /**
     * The aspect ratio to maintain during resizing (width / height)
     *
     * @private
     * @type {number}
     */
    #resizeAspectRatio: number = 0;

    /**
     * Constructor
     *
     * @param {string} objectType The object type for the class
     * @param {string} testObject The object that needs Google maps. This should be the name of the object that calls this method.
     * @param {string} [testLibrary] An optional Google maps library class to check for. This needs to be part of the google.maps object.
     */
    constructor(objectType: string, testObject: string, testLibrary?: string) {
        super(objectType, testObject, testLibrary || 'OverlayView');

        // Initialize the overlay element
        this.#overlay = document.createElement('div');
        this.#overlay.style.position = 'absolute';
        this.#overlay.style.pointerEvents = 'auto';
        this.#overlay.style.zIndex = '1000';

        // Set the default offset
        this.setOffset([0, 0]);
    }

    /**
     * Get the class name for the overlay element
     *
     * @returns {string}
     */
    get className(): string {
        return this.#overlay.className;
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
            const classes = className.split(' ');
            classes.forEach((cn) => {
                this.#overlay.classList.add(cn.trim());
            });
        } else if (isNullOrUndefined(className)) {
            this.#overlay.className = '';
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
     * @returns {LatLng}
     */
    get position(): LatLng {
        return this.#position;
    }

    /**
     * Set the position of the overlay
     *
     * @param {LatLngValue} value The position of the overlay
     */
    set position(value: LatLngValue) {
        const position = latLng(value);
        if (position.isValid()) {
            this.#position = position;
        } else if (isNullOrUndefined(value)) {
            this.#position = undefined;
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
     * Set the styles for the overlay element
     *
     * @param {object} styles The styles to apply to the overlay element
     */
    set styles(styles: object) {
        if (isObject(styles)) {
            this.#styles = styles;
            Object.keys(styles).forEach((key) => {
                this.#overlay.style[key] = styles[key];
            });
        }
    }

    /**
     * Returns whether dragging is enabled
     *
     * @returns {boolean}
     */
    get draggable(): boolean {
        return this.#draggable;
    }

    /**
     * Set whether dragging is enabled
     *
     * @param {boolean} draggable Whether dragging is enabled
     */
    set draggable(draggable: boolean) {
        this.#draggable = draggable;
        this.#setupDragHandlers();
    }

    /**
     * Returns whether resizing is enabled
     *
     * @returns {boolean}
     */
    get resizable(): boolean {
        return this.#resizable;
    }

    /**
     * Set whether resizing is enabled
     *
     * @param {boolean} resizable Whether resizing is enabled
     */
    set resizable(resizable: boolean) {
        this.#resizable = resizable;
        this.#setupResizeHandlers();
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
        // const pixel = point(x, y);
        const gp = new google.maps.Point(x as number, y);
        const pixel = point(gp);
        const projection = this.getProjection();
        if (projection) {
            return latLng(projection.fromContainerPixelToLatLng(pixel.toGoogle()));
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
        // const pixel = point(x, y);
        const gp = new google.maps.Point(x as number, y);
        const pixel = point(gp);
        const projection = this.getProjection();
        if (projection) {
            return latLng(projection.fromDivPixelToLatLng(pixel.toGoogle()));
        }
        return latLng();
    }

    /**
     * Get the offset value
     *
     * @returns {Point}
     */
    getOffset(): Point {
        return this.#offset;
    }

    /**
     * Get the overlay HTML element
     *
     * @returns {HTMLElement}
     */
    getOverlayElement(): HTMLElement {
        return this.#overlay;
    }

    /**
     * Get the position of the overlay
     *
     * @returns {LatLng}
     */
    getPosition(): LatLng {
        return this.position;
    }

    /**
     * Returns the MapCanvasProjection object associated with this OverlayView.
     *
     * The projection is not initialized until onAdd is called by the API.
     *
     * https://developers.google.com/maps/documentation/javascript/reference/overlay-view#MapCanvasProjection
     *
     * @returns {google.maps.MapCanvasProjection}
     */
    getProjection(): google.maps.MapCanvasProjection {
        return this.#overlayView.getProjection();
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
     * Moves the overlay to a new position.
     *
     * If the overlay is not visible, it will be shown.
     * If it's already visible on the map, it will be moved to the new position.
     *
     * @param {LatLngValue} position The latitude/longitude position of where the overlay should show
     * @param {Map} [map] The Map object
     * @returns {Promise<Overlay>}
     */
    move(position: LatLngValue, map?: Map): Promise<Overlay> {
        return new Promise((resolve, reject) => {
            let mapObject = map;
            if (typeof mapObject === 'undefined') {
                mapObject = this.getMap();
            }
            this.position = position;
            if (mapObject instanceof Map) {
                if (this.#overlayView) {
                    // Setting the map will trigger the redraw
                    this.#overlayView.setMap(mapObject.toGoogle());
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
     * Add an event listener for when the overlay is opened.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onOpen(callback: EventCallback): void {
        this.on(OverlayEvents.OPEN, callback);
    }

    /**
     * Removes a class name from the overlay element
     *
     * @param {string} className The class name to remove from the overlay element
     * @returns {Overlay}
     */
    removeClassName(className: string): Overlay {
        const classes = className.split(' ');
        classes.forEach((cn) => {
            this.#overlay.classList.remove(cn.trim());
        });
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
     * @param {LatLngValue} position The latitude/longitude position of where the overlay should show
     * @returns {Overlay}
     */
    setPosition(position: LatLngValue): Overlay {
        this.position = position;
        return this;
    }

    /**
     * Set the styles for the overlay element
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
                    this.#overlayView.setMap(map.toGoogle());
                    this.isVisible = true;
                    super.setMap(map);
                    this.dispatch(OverlayEvents.OPEN);
                    resolve(this);
                } else {
                    // The Google maps library isn't loaded yet. Wait for it to load.
                    loader().onMapLoad(() => {
                        this.#setupGoogleOverlay();
                        if (this.#overlayView) {
                            this.#overlayView.setMap(map.toGoogle());
                            this.isVisible = true;
                        }
                        super.setMap(map);
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
            this.#styles[name] = value;
            this.#overlay.style[name] = value;
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
     * Enable dragging for this overlay
     *
     * @returns {Overlay}
     */
    enableDrag(): Overlay {
        this.draggable = true;
        return this;
    }

    /**
     * Disable dragging for this overlay
     *
     * @returns {Overlay}
     */
    disableDrag(): Overlay {
        this.draggable = false;
        return this;
    }

    /**
     * Enable resizing for this overlay
     *
     * @returns {Overlay}
     */
    enableResize(): Overlay {
        this.resizable = true;
        return this;
    }

    /**
     * Disable resizing for this overlay
     *
     * @returns {Overlay}
     */
    disableResize(): Overlay {
        this.resizable = false;
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
     * Get the current aspect ratio for resizing
     *
     * @returns {number}
     */
    getResizeAspectRatio(): number {
        return this.#resizeAspectRatio;
    }

    /**
     * Calculate dimensions that maintain the aspect ratio
     *
     * @private
     * @param {number} newWidth The new width
     * @param {number} newHeight The new height
     * @returns {object} The constrained dimensions
     */
    #calculateConstrainedDimensions(newWidth: number, newHeight: number): { width: number; height: number } {
        if (this.#resizeAspectRatio <= 0) {
            return { width: newWidth, height: newHeight };
        }

        // Determine which dimension to use as the primary constraint
        const widthFromHeight = newHeight * this.#resizeAspectRatio;
        const heightFromWidth = newWidth / this.#resizeAspectRatio;

        // Use the dimension that results in a smaller change
        if (Math.abs(newWidth - widthFromHeight) < Math.abs(newHeight - heightFromWidth)) {
            return { width: widthFromHeight, height: newHeight };
        }
        return { width: newWidth, height: heightFromWidth };
    }

    /**
     * Set up drag event handlers
     *
     * @private
     */
    #setupDragHandlers(): void {
        if (this.#draggable) {
            this.#overlay.style.cursor = 'move';
            this.#overlay.style.pointerEvents = 'auto';
            this.#overlay.style.border = '2px solid #007bff';
            this.#overlay.addEventListener('mousedown', this.#handleDragStart);
            this.#overlay.addEventListener('touchstart', this.#handleDragStart);

            // Ensure map events are prevented
            if (checkForGoogleMaps('Overlay', 'OverlayView', false)) {
                google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.#overlay);
            }
        } else {
            this.#overlay.style.cursor = '';
            this.#overlay.style.pointerEvents = '';
            this.#overlay.removeEventListener('mousedown', this.#handleDragStart);
            this.#overlay.removeEventListener('touchstart', this.#handleDragStart);
        }
    }

    /**
     * Set up resize event handlers
     *
     * @private
     */
    #setupResizeHandlers(): void {
        if (this.#resizable) {
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

        this.#overlay.style.border = '2px solid #007bff';

        const corners = ['nw', 'ne', 'sw', 'se'];
        const cursors = {
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

            this.#overlay.appendChild(handle);
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
        this.#overlay.style.border = 'none';
    }

    /**
     * Handle drag start
     *
     * @private
     * @param {MouseEvent | TouchEvent} e The event
     */
    #handleDragStart = (e: MouseEvent | TouchEvent): void => {
        if (!this.#draggable || this.#isResizing) return;

        e.preventDefault();
        e.stopPropagation();

        this.#isDragging = true;
        this.#dragStart = point(
            e instanceof MouseEvent ? [e.clientX, e.clientY] : [e.touches[0].clientX, e.touches[0].clientY],
        );
        this.#overlayStart = point(
            parseInt(this.#overlay.style.left, 10) || 0,
            parseInt(this.#overlay.style.top, 10) || 0,
        );

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

        this.#overlay.style.left = `${newLeft}px`;
        this.#overlay.style.top = `${newTop}px`;

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
        if (!this.#resizable || this.#isDragging) return;

        e.preventDefault();
        e.stopPropagation();

        this.#isResizing = true;
        this.resizeCorner = corner;

        const mapContainer = this.getMap().getDiv();
        const containerRect = mapContainer.getBoundingClientRect();
        const currentSize = this.#overlay.getBoundingClientRect();

        // Get the current bounds, position, and size of the overlay before resizing.
        // These values will be used to calculate the new bounds, position, and size of the overlay after resizing.
        this.resizeStart = {
            // Northeast lat/lng
            neBounds: this.getCurrentBounds().ne,
            // Current top left position of the overlay within the map container.
            // This is used to calculate the new position of the overlay after resizing from the top left.
            nwPos: { x: currentSize.left - containerRect.left, y: currentSize.top - containerRect.top },
            // Southwest lat/lng
            swBounds: this.getCurrentBounds().sw,
            // Current bottom right position of the overlay within the map container.
            // This is used to calculate the new position of the overlay after resizing from the bottom right.
            sePos: { x: currentSize.right - containerRect.left, y: currentSize.bottom - containerRect.top },
            // Current left position within the overlay container
            left: parseInt(this.#overlay.style.left, 10) || 0,
            // Current top position within the overlay container
            top: parseInt(this.#overlay.style.top, 10) || 0,
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

        if (projection) {
            // Get the map container and its bounding client rectangle to get the mouse position relative to the map
            const mapContainer = this.getMap().getDiv();
            const containerRect = mapContainer.getBoundingClientRect();
            const eventX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
            const eventY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
            const mouseX = eventX - containerRect.left;
            const mouseY = eventY - containerRect.top;

            // Get the top right x/y coordinates
            const topRight = projection.fromLatLngToContainerPixel(this.resizeStart.neBounds.toGoogle());
            // Get the bottom left x/y coordinates
            const bottomLeft = projection.fromLatLngToContainerPixel(this.resizeStart.swBounds.toGoogle());

            let newWidth: number;
            let newHeight: number;
            let newLeft: number;
            let newTop: number;

            if (this.resizeCorner === 'nw') {
                // If the current position is below the bottom left corner or to the right of the top right corner,
                // then do not continue with the resize
                if (mouseY > bottomLeft.y || mouseX > topRight.x) {
                    return;
                }
                // Calculate the difference between the current position and the top right
                const diffX = this.resizeStart.nwPos.x - mouseX;
                const diffY = this.resizeStart.nwPos.y - mouseY;
                // Calculate new dimensions
                newWidth = this.resizeStart.width + diffX;
                newHeight = this.resizeStart.height + diffY;
                newLeft = this.resizeStart.left - diffX;
                newTop = this.resizeStart.top - diffY;
            } else if (this.resizeCorner === 'ne') {
                // If the current position is below the bottom left corner or to the left of the bottom left corner,
                // then do not continue with the resize
                if (mouseY > bottomLeft.y || mouseX < bottomLeft.x) {
                    return;
                }
                // Calculate the difference between the current position and the top right
                const diffX = topRight.x - mouseX;
                const diffY = topRight.y - mouseY;
                // Calculate new dimensions
                newWidth = this.resizeStart.width - diffX;
                newHeight = this.resizeStart.height + diffY;
                newLeft = this.resizeStart.left;
                newTop = this.resizeStart.top - diffY;
            } else if (this.resizeCorner === 'sw') {
                // If the current position is above the top left corner or to the right of the top right corner,
                // then do not continue with the resize
                if (mouseY < this.resizeStart.top || mouseX > topRight.x) {
                    return;
                }

                // Calculate the difference between the current position and the bottom left
                const diffX = bottomLeft.x - mouseX;
                const diffY = bottomLeft.y - mouseY;

                // Calculate new dimensions
                newWidth = this.resizeStart.width + diffX;
                newHeight = this.resizeStart.height - diffY;
                newLeft = this.resizeStart.left - diffX;
                newTop = this.resizeStart.top;
            } else if (this.resizeCorner === 'se') {
                // If the current position is above the top left corner or to the left of the top left corner,
                // then do not continue with the resize
                if (mouseY < this.resizeStart.top || mouseX < this.resizeStart.left) {
                    return;
                }

                // Calculate the difference between the current position and the bottom right
                const diffX = this.resizeStart.sePos.x - mouseX;
                const diffY = this.resizeStart.sePos.y - mouseY;

                // Calculate new dimensions
                newWidth = this.resizeStart.width - diffX;
                newHeight = this.resizeStart.height - diffY;
                newLeft = this.resizeStart.left;
                newTop = this.resizeStart.top;
            }

            // Apply aspect ratio constraint if set
            const constrained = this.#calculateConstrainedDimensions(newWidth, newHeight);

            // Update the overlay dimensions and position
            this.#overlay.style.width = `${constrained.width}px`;
            this.#overlay.style.height = `${constrained.height}px`;
            this.#overlay.style.left = `${newLeft}px`;
            this.#overlay.style.top = `${newTop}px`;

            if (this.#resizeAspectRatio > 0) {
                // If the aspect ratio is set, then we need to calculate the new lat/lng position based on the new dimensions.
                const newContainerRect = this.#overlay.getBoundingClientRect();
                const mapContainerRect = this.getMap().getDiv().getBoundingClientRect();
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
     * Get current bounds
     *
     * @protected
     * @returns {object} The current bounds
     */
    // eslint-disable-next-line class-methods-use-this
    getCurrentBounds(): { ne: LatLng; sw: LatLng } {
        // This method will be overridden by subclasses
        return { ne: latLng(), sw: latLng() };
    }

    /**
     * Set up the Google maps overlay object if necessary
     *
     * @private
     */
    #setupGoogleOverlay() {
        if (!isObject(this.#overlayView)) {
            if (checkForGoogleMaps('Overlay', 'OverlayView', false)) {
                // Get the overlay view class
                // eslint-disable-next-line no-use-before-define
                this.#overlayView = getOverlayViewClass(this);

                // Stops click, tap, drag, and wheel events on the element from bubbling up to the map.
                // This prevents map dragging and zooming, as well as map "click" events.
                google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.#overlay);
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
        if (this.#overlay.parentElement) {
            this.#overlay.parentElement.removeChild(this.#overlay);
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
const getOverlayViewClass = (classObject: Overlay) => {
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
    return new OverlayView(classObject);
};

/**
 * Helper function to set up the overlay object
 *
 * @returns {Overlay}
 */
export const overlay = (): Overlay => new Overlay('overlay', 'OverlayView');
