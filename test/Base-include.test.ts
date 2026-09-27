/* ===========================================================================
    Tests for Base.include(), the mixin mechanism that plugins use.

    The library uses it on itself: popups, tooltips and InfoWindows each register their attach*()
    methods this way, so the behaviour here is load-bearing for three shipped features.
=========================================================================== */

import { describe, expect, it } from 'vitest';
import Base from '../src/lib/Base';

/**
 * A throwaway class to include mixins into, so that one test can't affect another
 *
 * @returns {typeof Base}
 */
const target = () => class extends Base {};

describe('Base.include()', () => {
    it('adds methods to the prototype', () => {
        const Target = target();
        Target.include({
            greet(): string {
                return 'hi';
            },
        });
        expect(new Target('test', 'Test').greet()).toBe('hi');
    });

    it('keeps a getter as a getter', () => {
        const Target = target();
        let calls = 0;
        Target.include({
            get counted(): number {
                calls += 1;
                return calls;
            },
        });
        const object = new Target('test', 'Test');

        // Object.assign() would have run the getter once and copied the number it returned, so both
        // of these would be 1 and the accessor would be gone.
        expect(object.counted).toBe(1);
        expect(object.counted).toBe(2);
    });

    it('keeps a setter as a setter', () => {
        const Target = target();
        const received: string[] = [];
        Target.include({
            set name(value: string) {
                received.push(value);
            },
        });
        const object = new Target('test', 'Test');
        object.name = 'first';
        object.name = 'second';

        expect(received).toEqual(['first', 'second']);
    });

    it('replaces something that is already there', () => {
        const Target = target();
        Target.include({
            greet(): string {
                return 'first';
            },
        });
        Target.include({
            greet(): string {
                return 'second';
            },
        });

        // Last one wins. This is what lets the popup and tooltip modules replace the placeholder
        // methods on Layer and Map with the real ones.
        expect(new Target('test', 'Test').greet()).toBe('second');
    });

    it('leaves the mixin object alone', () => {
        const Target = target();
        const mixin = {
            greet(): string {
                return 'hi';
            },
        };
        Target.include(mixin);

        expect(typeof mixin.greet).toBe('function');
    });
});
