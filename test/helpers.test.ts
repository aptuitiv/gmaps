/* ===========================================================================
    Tests for the helper functions.

    These are pure functions, so no Google Maps stub is needed apart from the
    checkForGoogleMaps() tests.

    Some of these lock in behavior that is arguably wrong. Those are marked with a
    QUIRK comment and a reference to the plan. They are here so that a refactor has to
    change them deliberately rather than by accident.
=========================================================================== */

import { afterEach, describe, expect, it } from 'vitest';
import {
    checkForGoogleMaps,
    getBoolean,
    getNumber,
    getSizeWithUnit,
    isBoolean,
    isFunction,
    isNumber,
    isNumberOrNumberString,
    isNumberString,
    isObject,
    isObjectWithValues,
    isPromise,
    isString,
    isStringWithValue,
    objectEquals,
    renderTemplate,
} from '../src/lib/helpers';
import { installGoogleMaps, uninstallGoogleMaps } from './support/googleMaps';

describe('type checks', () => {
    it('isBoolean', () => {
        expect(isBoolean(true)).toBe(true);
        expect(isBoolean(false)).toBe(true);
        expect(isBoolean(0)).toBe(false);
        expect(isBoolean('true')).toBe(false);
    });

    it('isString and isStringWithValue', () => {
        expect(isString('')).toBe(true);
        expect(isString(1)).toBe(false);
        expect(isStringWithValue('a')).toBe(true);
        expect(isStringWithValue('')).toBe(false);
        expect(isStringWithValue('   ')).toBe(false);
    });

    it('isFunction', () => {
        expect(isFunction(() => {})).toBe(true);
        expect(isFunction(null)).toBe(false);
    });

    it('isPromise', () => {
        expect(isPromise(Promise.resolve())).toBe(true);
        expect(isPromise({ then: () => {} })).toBe(true);
        expect(isPromise({})).toBe(false);
        expect(isPromise(null)).toBe(false);
    });
});

describe('isNumber', () => {
    it('accepts real numbers', () => {
        expect(isNumber(0)).toBe(true);
        expect(isNumber(-12.5)).toBe(true);
    });

    it('rejects things that are not numbers', () => {
        expect(isNumber('1')).toBe(false);
        expect(isNumber(NaN)).toBe(false);
        expect(isNumber(null)).toBe(false);
        expect(isNumber(undefined)).toBe(false);
    });

    it('rejects Infinity', () => {
        expect(isNumber(Infinity)).toBe(false);
    });

    // QUIRK: -Infinity passes. The check is `thing !== Infinity`, which only excludes the
    // positive one. Noted as C-19 / L5 in ai-plans/active/performance-improvements.md.
    // When that is fixed this expectation flips to false.
    it('accepts -Infinity, which is a bug (C-19)', () => {
        expect(isNumber(-Infinity)).toBe(true);
    });
});

describe('isNumberString', () => {
    it('accepts strings that are numbers', () => {
        expect(isNumberString('34')).toBe(true);
        expect(isNumberString('-2.5')).toBe(true);
    });

    it('rejects strings that are not numbers, and real numbers', () => {
        expect(isNumberString('text34')).toBe(false);
        expect(isNumberString(34)).toBe(false);
    });

    it('rejects "Infinity" but accepts "-Infinity", matching isNumber (C-19)', () => {
        expect(isNumberString('Infinity')).toBe(false);
        expect(isNumberString('-Infinity')).toBe(true);
    });

    it('isNumberOrNumberString accepts both forms', () => {
        expect(isNumberOrNumberString(34)).toBe(true);
        expect(isNumberOrNumberString('34')).toBe(true);
        expect(isNumberOrNumberString('nope')).toBe(false);
    });
});

describe('isObject', () => {
    it('accepts plain objects only', () => {
        expect(isObject({})).toBe(true);
        expect(isObject({ a: 1 })).toBe(true);
    });

    // This is the behavior that a `typeof` fast path would change. C-3 in the plan calls for
    // speeding this up; these expectations are what must not change silently when it does.
    it('rejects arrays, null, dates, maps and sets (C-3 - do not change silently)', () => {
        expect(isObject([])).toBe(false);
        expect(isObject(null)).toBe(false);
        expect(isObject(new Date())).toBe(false);
        expect(isObject(new Map())).toBe(false);
        expect(isObject(new Set())).toBe(false);
    });

    it('accepts class instances', () => {
        class Thing {}
        expect(isObject(new Thing())).toBe(true);
    });

    it('isObjectWithValues needs at least one key', () => {
        expect(isObjectWithValues({})).toBe(false);
        expect(isObjectWithValues({ a: 1 })).toBe(true);
        expect(isObjectWithValues([])).toBe(false);
    });
});

describe('conversions', () => {
    it('getNumber', () => {
        expect(getNumber(3)).toBe(3);
        expect(getNumber('3')).toBe(3);
        expect(Number.isNaN(getNumber('x'))).toBe(true);
    });

    it('getBoolean', () => {
        expect(getBoolean(true)).toBe(true);
        expect(getBoolean('true')).toBe(true);
        expect(getBoolean('YES')).toBe(true);
        expect(getBoolean('1')).toBe(true);
        expect(getBoolean(1)).toBe(true);
        expect(getBoolean(0)).toBe(false);
        expect(getBoolean('no')).toBe(false);
        expect(getBoolean(null)).toBe(false);
    });
});

describe('getSizeWithUnit', () => {
    it('adds the default unit to a number', () => {
        expect(getSizeWithUnit(10)).toBe('10px');
        expect(getSizeWithUnit('10')).toBe('10px');
    });

    it('keeps a value that already has an allowed unit', () => {
        expect(getSizeWithUnit('50%')).toBe('50%');
        expect(getSizeWithUnit('50px')).toBe('50px');
    });

    it('rejects a negative number and an unknown unit', () => {
        expect(getSizeWithUnit(-1)).toBe(false);
        expect(getSizeWithUnit('10em')).toBe(false);
    });
});

describe('objectEquals', () => {
    it('compares values and nested objects', () => {
        expect(objectEquals({ a: 1 }, { a: 1 })).toBe(true);
        expect(objectEquals({ a: { b: 2 } }, { a: { b: 2 } })).toBe(true);
        expect(objectEquals({ a: 1 }, { a: 2 })).toBe(false);
        expect(objectEquals({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });

    it('compares dates and primitives', () => {
        expect(objectEquals(new Date(5), new Date(5))).toBe(true);
        expect(objectEquals(1, 1)).toBe(true);
        expect(objectEquals('a', 'b')).toBe(false);
    });
});

describe('renderTemplate', () => {
    it('replaces placeholders', () => {
        expect(renderTemplate('Hello {name}', () => 'Bob')).toBe('Hello Bob');
        expect(renderTemplate('{a} and {b}', (k) => k.toUpperCase())).toBe('A and B');
    });

    it('allows spaces inside the braces', () => {
        expect(renderTemplate('Hello { name }', (k) => k)).toBe('Hello name');
    });

    it('replaces a missing value with an empty string rather than "undefined"', () => {
        expect(renderTemplate('x{missing}y', () => undefined)).toBe('xy');
        expect(renderTemplate('x{missing}y', () => null)).toBe('xy');
    });

    it('leaves text with no placeholders alone', () => {
        expect(renderTemplate('nothing here', () => 'x')).toBe('nothing here');
    });
});

describe('checkForGoogleMaps', () => {
    afterEach(() => {
        uninstallGoogleMaps();
    });

    it('returns false rather than throwing when asked not to throw', () => {
        uninstallGoogleMaps();
        expect(checkForGoogleMaps('Test', 'Map', false)).toBe(false);
    });

    it('throws by default when Google Maps is missing', () => {
        uninstallGoogleMaps();
        expect(() => checkForGoogleMaps('Test', 'Map')).toThrow(/Google Maps/);
    });

    it('passes when the library and the requested class are present', () => {
        installGoogleMaps();
        expect(checkForGoogleMaps('Test', 'Map', false)).toBe(true);
        expect(checkForGoogleMaps('Test', undefined, false)).toBe(true);
    });

    it('fails when the requested class is missing', () => {
        installGoogleMaps();
        expect(checkForGoogleMaps('Test', 'NotARealClass', false)).toBe(false);
    });
});
