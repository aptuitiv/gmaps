/* ===========================================================================
    Display a custom image overlay on the map

    See https://developers.google.com/maps/documentation/javascript/customoverlays more information.
=========================================================================== */

/* global google */

import { LatLngBounds, LatLngBoundsValue } from './LatLngBounds';
import { Overlay } from './Overlay';
import { isBoolean, isNullOrUndefined, isNumber, isObject, isString, isStringWithValue } from './helpers';
import { Map } from './Map';

export type ImageOverlayOptions = {
    // The image URL to display
    imageUrl: string;
    // The bounds where the image should be displayed
    bounds: LatLngBoundsValue;
    // The class name for the image overlay element
    className?: string;
    // Whether to set a background and border on the overlay div to help show where the image is being displayed
    debug?: boolean;
    // The opacity of the image (0.0 to 1.0)
    opacity?: number;
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
     * Holds the opacity of the image
     *
     * @private
     * @type {number}
     */
    #opacity: number = 1.0;

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
     * @param {number} [opacity] The opacity of the image (if options is a string)
     */
    constructor(options: ImageOverlayOptions | string, bounds?: LatLngBoundsValue, opacity?: number) {
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
            if (opacity !== undefined) {
                this.opacity = opacity;
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
            this.style('background-color', '#ff000080');
            this.style('outline', '2px solid #ff0000');
        }
        if (options.imageUrl) {
            this.imageUrl = options.imageUrl;
        }
        if (options.opacity !== undefined) {
            this.opacity = options.opacity;
        }
        if (options.className) {
            this.setClassName(options.className);
        }
        if (options.styles) {
            this.styles = options.styles;
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
     * Add the overlay to the element. Called once after setMap() is called on the overlay with a valid map.
     *
     * @internal
     * @param {google.maps.MapPanes} panes The Google maps panes object
     */
    add(panes: google.maps.MapPanes) {
        // Add the image element to the overlay container
        this.getOverlayElement().appendChild(this.#imageElement);
        // Add the overlay to the map pane
        panes.overlayLayer.appendChild(this.getOverlayElement());
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

                    this.style('left', `${left}px`);
                    this.style('top', `${top}px`);
                    this.style('width', `${width}px`);
                    this.style('height', `${height}px`);
                    this.style('display', 'block');
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
 * @param {number} [opacity] The opacity of the image (if options is a string)
 * @returns {ImageOverlay}
 */
export const imageOverlay = (
    options?: ImageOverlayValue,
    bounds?: LatLngBoundsValue,
    opacity?: number,
): ImageOverlay => {
    if (options instanceof ImageOverlay) {
        return options;
    }
    return new ImageOverlay(options, bounds, opacity);
};
