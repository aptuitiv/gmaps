/* ===========================================================================
    Base class that others can extend from. This provides support
    for incorporating mixins into the class.
=========================================================================== */

class Base {
    /**
     * Include the mixin into the class
     *
     * @link https://javascript.info/mixins
     * @link https://www.digitalocean.com/community/tutorials/js-using-js-mixins
     * @param mixin The mixin to include
     */
    static include(mixin: any) {
        Object.assign(this.prototype, mixin);
    }
}

export default Base;
