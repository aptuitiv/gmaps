/* ===========================================================================
    Base class that others can extend from. This provides support
    for incorporating mixins into the class.
=========================================================================== */

/* eslint-disable @typescript-eslint/no-explicit-any */

import BaseMixin from './BaseMixin';

class Base {
    /**
     * Holds the object type
     *
     * The BaseMixin object has methods that use this.
     *
     * @type {string}
     */
    private objectType: string;

    /**
     * Constructor
     *
     * @param {string} objectType The object type for the class
     */
    constructor(objectType: string) {
        this.objectType = objectType;
    }

    /**
     * Include the mixin into the class
     *
     * https://javascript.info/mixins
     * https://www.digitalocean.com/community/tutorials/js-using-js-mixins
     *
     * @param {any} mixin The mixin to include
     */
    static include(mixin: any) {
        Object.assign(this.prototype, mixin);
    }
}

Base.include(BaseMixin);

export default Base;
