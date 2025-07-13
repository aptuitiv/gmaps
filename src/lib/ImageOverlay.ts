/* ===========================================================================
    Display a custom image overlay on the map

    See https://developers.google.com/maps/documentation/javascript/customoverlays more information.
=========================================================================== */

/* global google */

import { LatLngBounds, LatLngBoundsValue } from './LatLngBounds';
import { OverlayEvents } from './constants';
import { Overlay } from './Overlay';
import {
    calculateDimensions,
    isBoolean,
    isNullOrUndefined,
    isNumber,
    isObject,
    isString,
    isStringWithValue,
    checkForGoogleMaps,
} from './helpers';
import { Map } from './Map';
import { latLng, LatLng } from './LatLng';
import { point, Point } from './Point';

export type ImageOverlayOptions = {
    // The image URL to display
    imageUrl: string;
    // The bounds where the image should be displayed
    bounds: LatLngBoundsValue;
    // The class name for the image overlay element
    className?: string;
    // Whether to set a background and border on the overlay div to help show where the image is being displayed
    debug?: boolean;
    // The map to add the overlay to.
    map?: Map;
    // The opacity of the image (0.0 to 1.0)
    opacity?: number;
    // The rotation angle in degrees (0 to 360)
    rotation?: number;
    // Whether rotation is enabled
    rotate?: boolean;
    // Styles that will be set on the image overlay container div
    styles?: object;
};

/**
 * ImageOverlay class
 */
export class ImageOverlay extends Overlay {
    /**
     * Holds the bounds where the image should be displayed
     *
     * @private
     * @type {LatLngBounds}
     */
    #bounds: LatLngBounds;

    /**
     * Holds the image element
     *
     * @private
     * @type {HTMLImageElement}
     */
    #imageElement: HTMLImageElement;

    /**
     * Holds the image URL
     *
     * @private
     * @type {string}
     */
    #imageUrl: string;

    /**
     * Whether the overlay is currently being rotated
     *
     * @private
     * @type {boolean}
     */
    #isRotating: boolean = false;

    /**
     * Holds the opacity of the image
     *
     * @private
     * @type {number}
     */
    #opacity: number = 1.0;

    /**
     * Whether rotation is enabled
     *
     * @private
     * @type {boolean}
     */
    #rotate: boolean = false;

    /**
     * Holds the rotation angle in degrees
     *
     * @private
     * @type {number}
     */
    #rotation: number = 0;

    /**
     * The starting center point when rotation begins
     *
     * @private
     * @type {Point}
     */
    #rotationCenter: Point;

    /**
     * The rotation container element (wraps the image when rotation is enabled)
     *
     * @private
     * @type {HTMLElement}
     */
    #rotationContainer: HTMLElement;

    /**
     * The rotation handle element
     *
     * @private
     * @type {HTMLElement}
     */
    #rotationHandle: HTMLElement;

    /**
     * Holds the styles for the image element
     *
     * This overrides the styles property of the Overlay class.
     *
     * @private
     * @type {object}
     */
    #styles: object = {};

    /**
     * Constructor
     *
     * @param {ImageOverlayOptions | string} options The ImageOverlay options or image URL
     * @param {LatLngBoundsValue} [bounds] The bounds where the image should be displayed (if options is a string)
     */
    constructor(options: ImageOverlayOptions | string, bounds?: LatLngBoundsValue) {
        super('imageoverlay', 'ImageOverlay');

        // Initialize the image element
        this.#imageElement = document.createElement('img');
        this.#imageElement.style.width = '100%';
        this.#imageElement.style.height = '100%';
        this.#imageElement.style.objectFit = 'contain';

        if (isObject(options)) {
            this.setOptions(options);
        } else {
            // The image URL was passed as the first parameter
            this.image = options;
            if (bounds) {
                this.bounds = bounds;
            }
        }
    }

    /**
     * Returns the bounds where the image should be displayed
     *
     * @returns {LatLngBounds}
     */
    get bounds(): LatLngBounds {
        return this.#bounds;
    }

    /**
     * Set the bounds where the image should be displayed
     *
     * @param {LatLngBoundsValue} bounds The bounds where the image should be displayed
     */
    set bounds(bounds: LatLngBoundsValue) {
        if (bounds) {
            if (bounds instanceof LatLngBounds) {
                this.#bounds = bounds;
            } else {
                this.#bounds = new LatLngBounds(bounds);
            }
        }
    }

    /**
     * Get the class name for the image element
     *
     * This overrides the className property of the Overlay class.
     *
     * @returns {string}
     */
    get className(): string {
        return this.#imageElement.className;
    }

    /**
     * Set the class name(s) for the image element
     *
     * This overrides the className property of the Overlay class.
     *
     * If you need multiple class names then separate them with a space.
     *
     * @param {string} className The class name(s) to add to the image element.
     *    This can be a space separated list of class names.
     */
    set className(className: string) {
        if (isString(className)) {
            const classes = className.split(' ');
            classes.forEach((cn) => {
                this.#imageElement.classList.add(cn.trim());
            });
        } else if (isNullOrUndefined(className)) {
            this.#imageElement.className = '';
        }
    }

    /**
     * Returns the image URL
     *
     * @returns {string}
     */
    get imageUrl(): string {
        return this.#imageUrl;
    }

    /**
     * Set the image URL
     *
     * @param {string} imageUrl The image URL to display
     */
    set imageUrl(imageUrl: string) {
        if (isStringWithValue(imageUrl)) {
            this.#imageUrl = imageUrl;
            this.#imageElement.src = imageUrl;
        }
    }

    /**
     * Returns the opacity of the image
     *
     * @returns {number}
     */
    get opacity(): number {
        return this.#opacity;
    }

    /**
     * Set the opacity of the image
     *
     * @param {number} opacity The opacity value (0.0 to 1.0)
     */
    set opacity(opacity: number) {
        if (isNumber(opacity) && opacity >= 0 && opacity <= 1) {
            this.#opacity = opacity;
            this.#imageElement.style.opacity = opacity.toString();
        }
    }

    /**
     * Returns the rotation angle in degrees
     *
     * @returns {number}
     */
    get rotation(): number {
        return this.#rotation;
    }

    /**
     * Set the rotation angle in degrees
     *
     * @param {number} rotation The rotation angle in degrees (0 to 360)
     */
    set rotation(rotation: number) {
        if (isNumber(rotation)) {
            this.#rotation = rotation;
            this.#updateImageRotation();
        }
    }

    /**
     * Returns whether rotation is enabled
     *
     * @returns {boolean}
     */
    get rotate(): boolean {
        return this.#rotate;
    }

    /**
     * Set whether rotation is enabled
     *
     * @param {boolean} rotate Whether rotation is enabled
     */
    set rotate(rotate: boolean) {
        this.#rotate = rotate;
        this.#setupRotationHandlers();
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
                this.#imageElement.style[key] = styles[key];
            });
        }
    }

    /**
     * Display the image overlay on the map
     *
     * Alias to show()
     *
     * @param {Map} map The Map object
     * @returns {Promise<ImageOverlay>}
     */
    display(map: Map): Promise<ImageOverlay> {
        return this.show(map) as Promise<ImageOverlay>;
    }

    /**
     * Get the bounds where the image should be displayed
     *
     * @returns {LatLngBounds}
     */
    getBounds(): LatLngBounds {
        return this.#bounds;
    }

    /**
     * Get the image URL
     *
     * @returns {string}
     */
    getImageUrl(): string {
        return this.#imageUrl;
    }

    /**
     * Get the opacity of the image
     *
     * @returns {number}
     */
    getOpacity(): number {
        return this.#opacity;
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
            this.#imageElement.classList.remove(cn.trim());
        });
        return this;
    }

    /**
     * Set the bounds where the image should be displayed
     *
     * @param {LatLngBoundsValue} bounds The bounds where the image should be displayed
     * @returns {ImageOverlay}
     */
    setBounds(bounds: LatLngBoundsValue): ImageOverlay {
        this.bounds = bounds;
        return this;
    }

    /**
     * Set the class name(s) for the image element
     *
     * If you need multiple class names then separate them with a space.
     *
     * @param {string} className The class name(s) to add to the image element.
     *    This can be a space separated list of class names.
     * @returns {Overlay}
     */
    setClassName(className: string): Overlay {
        this.className = className;
        return this;
    }

    /**
     * Set the image URL
     *
     * @param {string} imageUrl The image URL to display
     * @returns {ImageOverlay}
     */
    setImageUrl(imageUrl: string): ImageOverlay {
        this.imageUrl = imageUrl;
        return this;
    }

    /**
     * Set the opacity of the image
     *
     * @param {number} opacity The opacity value (0.0 to 1.0)
     * @returns {ImageOverlay}
     */
    setOpacity(opacity: number): ImageOverlay {
        this.opacity = opacity;
        return this;
    }

    /**
     * Sets the options for the image overlay
     *
     * @param {ImageOverlayOptions} options ImageOverlay options
     * @returns {ImageOverlay}
     */
    setOptions(options: ImageOverlayOptions): ImageOverlay {
        if (options.bounds) {
            this.bounds = options.bounds;
        }
        if (isBoolean(options.debug) && options.debug) {
            super.style('background-color', '#ff000080');
            super.style('outline', '2px solid #ff0000');
        }
        if (options.imageUrl) {
            this.imageUrl = options.imageUrl;
        }
        if (options.opacity !== undefined) {
            this.opacity = options.opacity;
        }
        if (options.rotation !== undefined) {
            this.rotation = options.rotation;
        }
        if (options.rotate !== undefined) {
            this.rotate = options.rotate;
        }
        if (options.className) {
            this.setClassName(options.className);
        }
        if (options.styles) {
            this.styles = options.styles;
        }

        // Set the map. This must come last so that the other options are set.
        if (options.map) {
            this.setMap(options.map);
        }

        return this;
    }

    /**
     * Set a single style on the image element
     *
     * @param {string} name The style name
     * @param {string} value The style value
     * @returns {Overlay}
     */
    style(name: string, value: string): Overlay {
        if (isString(name) && isString(value)) {
            this.#styles[name] = value;
            this.#imageElement.style[name] = value;
        }
        return this;
    }

    /**
     * Toggle the display of the image overlay on the map
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
     * Override the updateBoundsFromPosition method to handle dragging
     *
     * @protected
     */
    updateBoundsFromPosition(): void {
        if (!this.#bounds) return;

        const projection = this.getProjection();
        if (!projection) return;

        // Get the current overlay position in pixels
        const overlayRect = this.getOverlayElement().getBoundingClientRect();
        const mapDiv = this.getMap().getDiv();
        const mapRect = mapDiv.getBoundingClientRect();

        // Calculate the overlay position relative to the map
        const overlayLeft = overlayRect.left - mapRect.left;
        const overlayTop = overlayRect.top - mapRect.top;

        // Convert pixel positions to lat/lng
        const nePixel = point(overlayLeft + overlayRect.width, overlayTop);
        const swPixel = point(overlayLeft, overlayTop + overlayRect.height);

        const neLatLng = this.getContainerLatLngFromPixel(nePixel.getX(), nePixel.getY());
        const swLatLng = this.getContainerLatLngFromPixel(swPixel.getX(), swPixel.getY());

        // Update bounds
        this.#bounds = new LatLngBounds({
            ne: neLatLng,
            sw: swLatLng,
        });
    }

    /**
     * Update bounds from resize
     *
     * @protected
     * @param {LatLng} neLatLng The new lat/lng position for the northeast corner
     * @param {LatLng} swLatLng The new lat/lng position for the southwest corner
     */
    setBoundsFromResize(neLatLng: LatLng, swLatLng: LatLng): void {
        this.#bounds = new LatLngBounds({
            ne: neLatLng,
            sw: swLatLng,
        });
    }

    /**
     * Override the updateBoundsFromResize method to handle resizing
     *
     * @protected
     * @param {LatLng} newLatLng The new lat/lng position
     */
    updateBoundsFromResize(newLatLng: LatLng): void {
        if (!this.#bounds || !this.resizeStart) return;

        let newNe = this.resizeStart.neBounds;
        let newSw = this.resizeStart.swBounds;

        // Update the appropriate corner based on which handle is being dragged
        switch (this.resizeCorner) {
            case 'nw':
                newNe = latLng(newLatLng.latitude, newNe.longitude);
                newSw = latLng(newSw.latitude, newLatLng.longitude);
                break;
            case 'ne':
                newNe = latLng(newLatLng.latitude, newLatLng.longitude);
                newSw = latLng(newSw.latitude, newSw.longitude);
                break;
            case 'sw':
                newNe = latLng(newNe.latitude, newNe.longitude);
                newSw = latLng(newLatLng.latitude, newLatLng.longitude);
                break;
            case 'se':
                newNe = latLng(newNe.latitude, newLatLng.longitude);
                newSw = latLng(newLatLng.latitude, newSw.longitude);
                break;
            default:
                // No change
                break;
        }

        // Ensure ne is north and east of sw
        const north = Math.max(newNe.latitude, newSw.latitude);
        const south = Math.min(newNe.latitude, newSw.latitude);
        const east = Math.max(newNe.longitude, newSw.longitude);
        const west = Math.min(newNe.longitude, newSw.longitude);

        this.#bounds = new LatLngBounds({
            ne: latLng(north, east),
            sw: latLng(south, west),
        });
    }

    /**
     * Get the rotation angle in degrees
     *
     * @returns {number}
     */
    getRotation(): number {
        return this.#rotation;
    }

    /**
     * Set the rotation angle in degrees
     *
     * @param {number} rotation The rotation angle in degrees (0 to 360)
     * @returns {ImageOverlay}
     */
    setRotation(rotation: number): ImageOverlay {
        this.rotation = rotation;
        return this;
    }

    /**
     * Enable rotation for this overlay
     *
     * @returns {ImageOverlay}
     */
    enableRotation(): ImageOverlay {
        this.rotate = true;
        return this;
    }

    /**
     * Disable rotation for this overlay
     *
     * @returns {ImageOverlay}
     */
    disableRotation(): ImageOverlay {
        this.rotate = false;
        return this;
    }

    /**
     * Fit the overlay to the exact dimensions of the image
     *
     * @returns {Promise<ImageOverlay>}
     */
    fitToImage(): Promise<ImageOverlay> {
        return new Promise((resolve) => {
            if (!this.#imageElement.complete) {
                // Wait for the image to load
                this.#imageElement.onload = () => {
                    this.#performFitToImage();
                    resolve(this);
                };
            } else {
                this.#performFitToImage();
                resolve(this);
            }
        });
    }

    /**
     * Perform the fit to image operation
     *
     * @private
     */
    #performFitToImage(): void {
        const imageWidth = this.#imageElement.naturalWidth;
        const imageHeight = this.#imageElement.naturalHeight;

        if (imageWidth === 0 || imageHeight === 0) {
            // eslint-disable-next-line no-console
            console.warn('Image dimensions are not available');
            return;
        }

        // Calculate the aspect ratio
        const aspectRatio = imageWidth / imageHeight;

        // Calculate the container width and height from the image aspect ratio
        const overlayElement = this.getOverlayElement();
        const containerRect = overlayElement.getBoundingClientRect();
        const { width: newContainerWidth, height: newContainerHeight } = calculateDimensions(
            aspectRatio,
            containerRect.width,
            containerRect.height,
        );
        super.style('width', `${newContainerWidth}px`);
        super.style('height', `${newContainerHeight}px`);

        // Adjust the left and top positions of the container to center the image within the container.
        const leftDelta = (containerRect.width - newContainerWidth) / 2;
        const topDelta = (containerRect.height - newContainerHeight) / 2;

        const currentLeft = parseInt(overlayElement.style.left, 10) || 0;
        const currentTop = parseInt(overlayElement.style.top, 10) || 0;

        super.style('left', `${currentLeft + leftDelta}px`);
        super.style('top', `${currentTop + topDelta}px`);

        // Set the aspect ratio for resizing
        this.setResizeAspectRatio(aspectRatio);

        // Get the new bounds from the lat/lng positions of the container.
        // Get those positions from the NE and SW pixel coordinates of the container.
        const newContainerRect = overlayElement.getBoundingClientRect();
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
        this.bounds = new LatLngBounds({
            ne: neLatLng,
            sw: swLatLng,
        });
    }

    /**
     * Update the image rotation transform
     *
     * @private
     */
    #updateImageRotation(): void {
        if (this.#rotationContainer) {
            this.#rotationContainer.style.transform = `rotate(${this.#rotation}deg)`;
        } else {
            if (this.#rotation !== 0) {
                this.#imageElement.style.transform = `rotate(${this.#rotation}deg)`;
            } else {
                this.#imageElement.style.transform = '';
            }
        }
    }

    /**
     * Set up rotation event handlers
     *
     * @private
     */
    #setupRotationHandlers(): void {
        if (this.rotate) {
            this.#createRotationContainer();
            this.#createRotationHandle();
        } else {
            this.#removeRotationHandle();
            this.#removeRotationContainer();
        }
    }

    /**
     * Create rotation container
     *
     * @private
     */
    #createRotationContainer(): void {
        this.#removeRotationContainer();

        // Create the rotation container
        this.#rotationContainer = document.createElement('div');
        this.#rotationContainer.className = 'rotation-container';
        this.#rotationContainer.style.cssText = `
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: rotate(${this.#rotation}deg);
        `;

        // Remove any rotation from the image element
        this.#imageElement.style.transform = '';

        // Move the image into the rotation container
        if (this.#imageElement.parentNode) {
            this.#imageElement.parentNode.insertBefore(this.#rotationContainer, this.#imageElement);
        }
        this.#rotationContainer.appendChild(this.#imageElement);

        // Apply current rotation
        this.#updateImageRotation();
    }

    /**
     * Remove rotation container
     *
     * @private
     */
    #removeRotationContainer(): void {
        if (this.#rotationContainer) {
            // Move the image back to the overlay element
            this.getOverlayElement().appendChild(this.#imageElement);

            // Remove the rotation container
            if (this.#rotationContainer.parentNode) {
                this.#rotationContainer.parentNode.removeChild(this.#rotationContainer);
            }
            this.#rotationContainer = null;
        }
    }

    /**
     * Create rotation handle
     *
     * @private
     */
    #createRotationHandle(): void {
        this.#removeRotationHandle();

        this.#rotationHandle = document.createElement('div');
        this.#rotationHandle.className = 'rotation-handle';
        this.#rotationHandle.style.cssText = `
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            width: 4px;
            height: 40px;
            background: #007bff;
            border-radius: 2px;
            cursor: grab;
            z-index: 1001;
            pointer-events: auto;
        `;

        // Add the handle circle at the top
        const handleCircle = document.createElement('div');
        handleCircle.style.cssText = `
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 16px;
            height: 16px;
            background: #007bff;
            border: 2px solid #fff;
            border-radius: 50%;
            cursor: grab;
        `;

        this.#rotationHandle.appendChild(handleCircle);

        this.#rotationHandle.addEventListener('mousedown', this.#handleRotationStart);
        this.#rotationHandle.addEventListener('touchstart', this.#handleRotationStart);

        // Prevent map events on rotation handle
        if (checkForGoogleMaps('ImageOverlay', 'OverlayView', false)) {
            google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.#rotationHandle);
        }

        // Add the handle to the rotation container if it exists, otherwise to the overlay
        const parentElement = this.#rotationContainer || this.getOverlayElement();
        parentElement.appendChild(this.#rotationHandle);
    }

    /**
     * Remove rotation handle
     *
     * @private
     */
    #removeRotationHandle(): void {
        if (this.#rotationHandle && this.#rotationHandle.parentNode) {
            this.#rotationHandle.parentNode.removeChild(this.#rotationHandle);
            this.#rotationHandle = null;
        }
    }

    /**
     * Handle rotation start
     *
     * @private
     * @param {MouseEvent | TouchEvent} e The event
     */
    #handleRotationStart = (e: MouseEvent | TouchEvent): void => {
        if (!this.rotate || this.#isRotating) return;

        e.preventDefault();
        e.stopPropagation();

        this.#isRotating = true;

        // Get the center of the overlay
        const overlayRect = this.getOverlayElement().getBoundingClientRect();
        this.#rotationCenter = point(
            overlayRect.left + overlayRect.width / 2,
            overlayRect.top + overlayRect.height / 2,
        );

        document.addEventListener('mousemove', this.#handleRotation);
        document.addEventListener('mouseup', this.#handleRotationEnd);
        document.addEventListener('touchmove', this.#handleRotation);
        document.addEventListener('touchend', this.#handleRotationEnd);

        this.dispatch(OverlayEvents.ROTATE_START, { event: e });
    };

    /**
     * Handle rotation
     *
     * @private
     * @param {MouseEvent | TouchEvent} e The event
     */
    #handleRotation = (e: MouseEvent | TouchEvent): void => {
        if (!this.#isRotating) return;

        e.preventDefault();

        const currentPos = point(
            e instanceof MouseEvent ? [e.clientX, e.clientY] : [e.touches[0].clientX, e.touches[0].clientY],
        );

        // Calculate the angle between the center and the current mouse position
        const deltaX = currentPos.getX() - this.#rotationCenter.getX();
        const deltaY = currentPos.getY() - this.#rotationCenter.getY();
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        // Convert to 0-360 range and adjust for the starting angle
        let newRotation = (angle + 90) % 360;
        if (newRotation < 0) newRotation += 360;

        this.#rotation = newRotation;
        this.#updateImageRotation();

        this.dispatch(OverlayEvents.ROTATE, { event: e, angle: newRotation });
    };

    /**
     * Handle rotation end
     *
     * @private
     * @param {MouseEvent | TouchEvent} e The event
     */
    #handleRotationEnd = (e: MouseEvent | TouchEvent): void => {
        if (!this.#isRotating) return;

        this.#isRotating = false;

        document.removeEventListener('mousemove', this.#handleRotation);
        document.removeEventListener('mouseup', this.#handleRotationEnd);
        document.removeEventListener('touchmove', this.#handleRotation);
        document.removeEventListener('touchend', this.#handleRotationEnd);

        this.dispatch(OverlayEvents.ROTATE_END, { event: e, angle: this.#rotation });
    };

    /**
     * Add the overlay to the element. Called once after setMap() is called on the overlay with a valid map.
     *
     * @internal
     * @param {google.maps.MapPanes} panes The Google maps panes object
     */
    add(panes: google.maps.MapPanes) {
        // Set up rotation handlers if rotation is enabled
        if (this.rotate) {
            this.#setupRotationHandlers();
        }

        // Add the image element to the overlay container
        if (this.#rotationContainer) {
            this.getOverlayElement().appendChild(this.#rotationContainer);
        } else {
            this.getOverlayElement().appendChild(this.#imageElement);
        }

        if (this.resizable || this.draggable || this.rotate) {
            // Add the overlay to the float pane to ensure it's above the map and can receive events
            // https://developers.google.com/maps/documentation/javascript/customoverlays#intitialize
            panes.floatPane.appendChild(this.getOverlayElement());
        } else {
            // Add the overlay to the overlay layer to ensure it's below markers
            // https://developers.google.com/maps/documentation/javascript/customoverlays#intitialize
            panes.overlayLayer.appendChild(this.getOverlayElement());
        }
    }

    /**
     * Draw the overlay. Called when the overlay is being drawn or updated.
     *
     * @internal
     * @param {google.maps.MapCanvasProjection} projection The Google maps projection object
     */
    draw(projection: google.maps.MapCanvasProjection) {
        if (this.#bounds && projection) {
            const ne = this.#bounds.getNorthEast();
            const sw = this.#bounds.getSouthWest();

            if (ne && sw) {
                const nePixel = projection.fromLatLngToDivPixel(ne.toGoogle());
                const swPixel = projection.fromLatLngToDivPixel(sw.toGoogle());

                if (nePixel && swPixel) {
                    const left = Math.min(nePixel.x, swPixel.x);
                    const top = Math.min(nePixel.y, swPixel.y);
                    const width = Math.abs(nePixel.x - swPixel.x);
                    const height = Math.abs(nePixel.y - swPixel.y);

                    super.style('left', `${left}px`);
                    super.style('top', `${top}px`);
                    super.style('width', `${width}px`);
                    super.style('height', `${height}px`);
                    super.style('display', 'block');
                }
            }
        }
    }
}

export type ImageOverlayValue = ImageOverlay | ImageOverlayOptions | string;

/**
 * Helper function to set up the ImageOverlay class
 *
 * @param {ImageOverlayValue} [options] The ImageOverlay options or image URL
 * @param {LatLngBoundsValue} [bounds] The bounds where the image should be displayed (if options is a string)
 * @returns {ImageOverlay}
 */
export const imageOverlay = (options?: ImageOverlayValue, bounds?: LatLngBoundsValue): ImageOverlay => {
    if (options instanceof ImageOverlay) {
        return options;
    }
    return new ImageOverlay(options, bounds);
};
