// @vitest-environment jsdom

/* ===========================================================================
    Tests for the Popup class and the attachPopup mixin.

    The centrepiece is section 6.4, fixed in Phase 1. Tooltip had an #isThemeApplied guard so
    that its theme styles are written once instead of on every frame; Popup did not, so its
    draw() rebuilt the theme object and re-applied all five styles every time it ran - on every
    frame of every pan and zoom while a popup was open. Popup now has the same guard, and these
    tests hold it in place.

    draw() takes the projection as a parameter, so it can be called directly with a fake one.
    That makes the per-frame work observable rather than something to take on trust.

    One thing that tempers 6.4: Popup's theme defaults to 'none', not 'default'. The rebuild
    only happens for callers who opt into the default theme.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { closeAllPopups, Popup, popup } from '../src/lib/Popup';
import { Tooltip, tooltip } from '../src/lib/Tooltip';
import { marker } from '../src/lib/Marker';
import { polyline } from '../src/lib/Polyline';
import { installGoogleMaps, mapsStats, uninstallGoogleMaps } from './support/googleMaps';
import { fakeMap } from './support/fakeMap';

/**
 * Let any pending promise callbacks run
 *
 * @returns {Promise<void>}
 */
const tick = async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
};

const path = [
    { lat: 48.85, lng: 2.35 },
    { lat: 48.86, lng: 2.36 },
];

/**
 * A stand-in for the Google projection, which is all draw() needs
 *
 * @returns {object}
 */
const fakeProjection = () =>
    ({
        fromLatLngToDivPixel: () => ({ x: 10, y: 20 }),
    }) as unknown as google.maps.MapCanvasProjection;

describe('Popup', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
        vi.restoreAllMocks();
    });

    describe('building a popup', () => {
        it('takes a plain string as the content', () => {
            const p = popup('Trail 12');
            expect(p.content).toBe('Trail 12');
            expect(p.hasContent()).toBe(true);
        });

        it('takes an options object', () => {
            const p = popup({ content: 'Trail 12', center: false, autoClose: false });
            expect(p.content).toBe('Trail 12');
            expect(p.center).toBe(false);
            expect(p.autoClose).toBe(false);
        });

        it('takes an HTMLElement', () => {
            const element = document.createElement('span');
            const p = popup(element);
            expect(p.content).toBe(element);
            expect(p.getOverlayElement().firstChild).toBe(element);
        });

        it('returns the same object when the factory is given a Popup', () => {
            const p = popup('x');
            expect(popup(p)).toBe(p);
        });

        it('centers and auto-closes by default', () => {
            const p = popup('x');
            expect(p.center).toBe(true);
            expect(p.autoClose).toBe(true);
        });

        // Unlike Tooltip, whose theme is 'default'.
        it("defaults the theme to 'none'", () => {
            expect(popup('x').theme).toBe('none');
            expect(tooltip('x').theme).toBe('default');
        });
    });

    // O-2, the same as Tooltip: the content setter parses into the DOM, and the constructor
    // calls it.
    describe('content is parsed into the DOM at construction (O-2)', () => {
        it('writes the content into the element before anything is shown', () => {
            const p = popup('<b>Trail 12</b>');
            expect(p.getOverlayElement().innerHTML).toBe('<b>Trail 12</b>');
            expect(p.isVisible).toBe(false);
        });

        it('parses for every popup built, shown or not', () => {
            const popups: Popup[] = [];
            for (let i = 0; i < 100; i += 1) {
                popups.push(popup(`<b>Segment ${i}</b>`));
            }
            popups.forEach((p, i) => {
                expect(p.getOverlayElement().innerHTML).toBe(`<b>Segment ${i}</b>`);
                expect(p.getOverlayElement().parentElement).toBeNull();
            });
        });

        it('clears the old children when an element replaces the content', () => {
            const first = document.createElement('span');
            const second = document.createElement('div');
            const p = popup(first);
            p.setContent(second);
            expect(p.getOverlayElement().childNodes).toHaveLength(1);
            expect(p.getOverlayElement().firstChild).toBe(second);
        });
    });

    describe('the event option', () => {
        it('accepts the three allowed values', () => {
            expect(popup({ content: 'x', event: 'click' }).event).toBe('click');
            expect(popup({ content: 'x', event: 'HOVER' }).event).toBe('hover');
        });

        it('throws on anything else', () => {
            expect(() => popup({ content: 'x', event: 'dblclick' })).toThrow(/Invalid event value/);
        });
    });

    // Section 6.4, now fixed in Phase 1. Popup was given the same #isThemeApplied guard that
    // Tooltip already had, so the theme styles are written once instead of on every frame.
    describe('the theme is applied once, not on every draw (6.4)', () => {
        /**
         * Record the style names written during one draw
         *
         * @param {Popup|Tooltip} overlayObject The overlay to draw
         * @returns {string[]}
         */
        const styleNamesForOneDraw = (overlayObject: Popup | Tooltip): string[] => {
            const spy = vi.spyOn(overlayObject, 'style');
            overlayObject.draw(fakeProjection());
            const names = spy.mock.calls.map((call) => call[0] as string);
            spy.mockRestore();
            return names;
        };

        it('writes the theme styles on the first draw', () => {
            const p = popup({ content: 'x', theme: 'default' });
            p.setPosition([1, 2]);

            const first = styleNamesForOneDraw(p);

            expect(first).toEqual(expect.arrayContaining(['backgroundColor', 'color', 'padding', 'borderRadius']));
        });

        it('does not write them again on the second draw', () => {
            const p = popup({ content: 'x', theme: 'default' });
            p.setPosition([1, 2]);

            styleNamesForOneDraw(p);
            const second = styleNamesForOneDraw(p);

            // Only the position and transform are left, which is the point of the fix
            expect(second).not.toContain('backgroundColor');
        });

        it('stops writing them on every draw after that', () => {
            const p = popup({ content: 'x', theme: 'default' });
            p.setPosition([1, 2]);

            p.draw(fakeProjection());
            p.draw(fakeProjection());
            const fifth = styleNamesForOneDraw(p);

            expect(fifth).not.toContain('backgroundColor');
        });

        // Applying once does not mean the styles go away. They stay on the element, so a later
        // draw has nothing to do - #applyTheme() only writes keys that aren't set yet, and
        // style() now skips a write when the value hasn't changed.
        it('leaves the theme styles on the element after later draws', () => {
            const p = popup({ content: 'x', theme: 'default' });
            p.setPosition([1, 2]);

            p.draw(fakeProjection());
            p.draw(fakeProjection());
            p.draw(fakeProjection());

            expect(p.getOverlayElement().style.backgroundColor).toBe('rgb(255, 255, 255)');
            expect(p.styles).toMatchObject({ backgroundColor: '#fff', padding: '3px 6px' });
        });

        // The precedence rule that #applyTheme() has to keep: a style the caller set explicitly
        // is never overwritten by the theme.
        it('lets a custom style win over the theme', () => {
            const p = popup({ content: 'x', theme: 'default', styles: { backgroundColor: 'red' } });
            p.setPosition([1, 2]);

            p.draw(fakeProjection());

            expect(p.styles).toMatchObject({ backgroundColor: 'red' });
            // The rest of the theme is still applied around it
            expect(p.styles).toMatchObject({ padding: '3px 6px' });
        });

        // Tooltip had this guard first; Popup now matches it.
        it('Tooltip writes them on the first draw only', () => {
            const t = tooltip('x');
            t.setPosition([1, 2]);

            const first = styleNamesForOneDraw(t);
            const second = styleNamesForOneDraw(t);

            expect(first).toContain('backgroundColor');
            expect(second).not.toContain('backgroundColor');
        });

        it('a popup with no theme writes no theme styles at all', () => {
            const p = popup({ content: 'x' });
            p.setPosition([1, 2]);

            expect(styleNamesForOneDraw(p)).not.toContain('backgroundColor');
        });

        // The transform is written on every draw too, with no comparison against the current
        // value. Tooltip guards this one; Popup does not.
        it('writes the transform on every draw', () => {
            const p = popup({ content: 'x' });
            p.setPosition([1, 2]);

            styleNamesForOneDraw(p);
            expect(styleNamesForOneDraw(p)).toContain('transform');
        });
    });

    describe('draw positions the element', () => {
        it('sets left and top from the projection', () => {
            const p = popup('x');
            p.setPosition([1, 2]);
            p.draw(fakeProjection());

            expect(p.getOverlayElement().style.left).toBe('10px');
            expect(p.getOverlayElement().style.top).toBe('20px');
        });

        it('does nothing without a position', () => {
            const p = popup('x');
            expect(() => p.draw(fakeProjection())).not.toThrow();
            expect(p.getOverlayElement().style.left).toBe('');
        });

        it('does nothing without a projection', () => {
            const p = popup('x');
            p.setPosition([1, 2]);
            expect(() => p.draw(undefined as never)).not.toThrow();
            expect(p.getOverlayElement().style.left).toBe('');
        });
    });
});

// The popup half of M-1, and the Layer popup accessors.
describe('attaching a popup (M-1)', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
    });

    it('attaching to a polyline builds nothing', async () => {
        const p = polyline({ path });
        p.attachPopup('Trail 12');
        await tick();

        expect(mapsStats.countOf('Polyline')).toBe(0);
    });

    it('attaching to 100 polylines builds nothing', async () => {
        for (let i = 0; i < 100; i += 1) {
            polyline({ path }).attachPopup(`Segment ${i}`);
        }
        await tick();

        expect(mapsStats.countOf('Polyline')).toBe(0);
    });

    // M-1 fixed in Phase 3. Marker.init() no longer builds the Google marker, so attaching a
    // popup costs nothing until something actually shows the marker.
    it('attaching to a marker builds nothing (M-1)', async () => {
        const m = marker({ position: [1, 2] });
        m.attachPopup('Marker 1');
        await tick();

        expect(mapsStats.countOf('Marker')).toBe(0);
    });

    it('a tooltip and a popup on the same polyline still build nothing', async () => {
        const p = polyline({ path });
        p.attachTooltip('Trail 12');
        p.attachPopup('Trail 12 details');
        await tick();

        expect(mapsStats.countOf('Polyline')).toBe(0);
    });

    it('sets the popup on the layer so the accessors find it', async () => {
        const p = polyline({ path });
        const attached = p.attachPopup('Trail 12');
        await tick();

        expect(attached).toBeInstanceOf(Popup);
        expect(p.hasPopup()).toBe(true);
        expect(p.getPopup()).toBe(attached);
    });

    it('closePopup is safe when nothing is open', async () => {
        const p = polyline({ path });
        p.attachPopup('Trail 12');
        await tick();
        expect(() => p.closePopup()).not.toThrow();
    });

    it('a layer with no popup reports none', () => {
        const p = polyline({ path });
        expect(p.hasPopup()).toBe(false);
        expect(p.getPopup()).toBeUndefined();
    });
});

/*
    Showing a popup on something that isn't on a map.

    show() marks the popup as open and puts it in the collection before it works out where to
    display it. Both of those used to be left set when it turned out there was nowhere to show
    it, so the popup reported itself as open while nothing was on screen.

    The one that actually bites is the third test: the guard at the top of show() returns early
    when the popup is already in the collection AND marked open, so a popup that failed this way
    could never be shown afterwards - putting the layer on a map and calling show() again did
    nothing at all. That is the same shape as the remembered-failure bug in PlacesSearchBox.init().

    The marker version of this branch is not covered here. Marker's anchorPoint is undefined in
    these tests, so Popup retries five times on real timers - 100 + 200 + 400 + 600 + 1000ms -
    before it reaches the no-map check. A test would add 2.3 seconds to the suite, or need fake
    timers, which nothing else here uses. The two branches are the same three lines, and the
    layer branch pins them.
*/
/*
    Hiding a popup when a callback returned a different one.

    A callback can return a whole Popup object to show instead of the one it belongs to, and that
    one is held in #activePopup. hide() only ever took down the popup it was called on, so the
    other one was left on the map with nothing referring to it. close() and Layer.closePopup()
    both come through hide(), so there was no way to get rid of it except by clicking the layer
    again. It isn't in the popup collection either - only the "clickon" branch adds it - so
    closeAllPopups() couldn't reach it.

    The second test is the one that would fail loudly rather than silently. A callback that
    returns content or options is applied to the base popup, and #activePopup is then set to the
    base popup itself, so hiding it without checking would call hide() again and never stop.
*/
describe('hiding a popup that a callback replaced', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
    });

    it('takes the callback popup down as well', async () => {
        const other = popup('Other');
        const line = polyline({ path });
        const base = line.attachPopup(() => other);
        await line.setMap(fakeMap());
        await tick();

        line.dispatch('click', { latLng: { lat: 48.85, lng: 2.35 } });
        await tick();
        // Proves the popup really was shown, so the assertion after hide() means something
        expect(other.isVisible).toBe(true);

        base.hide();
        await tick();

        expect(other.isVisible).toBe(false);
        expect(other.isOpen()).toBe(false);
    });

    // #activePopup is the base popup itself whenever the callback returns content or options,
    // which is the common case. Hiding it must not call hide() again.
    it('does not call itself forever when the callback returned content', async () => {
        const line = polyline({ path });
        const base = line.attachPopup(() => 'just content');
        await line.setMap(fakeMap());
        await tick();

        line.dispatch('click', { latLng: { lat: 48.85, lng: 2.35 } });
        await tick();

        expect(() => base.hide()).not.toThrow();
        expect(base.isVisible).toBe(false);
    });
});

describe('showing a popup on a layer that is not on a map', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
    });

    it('does not report itself as open', async () => {
        const p = popup('Trail 12');
        const line = polyline({ path });
        expect(line.getMap()).toBeNull();

        await p.show(line);

        expect(p.isOpen()).toBe(false);
    });

    it('is not left displayed', async () => {
        const p = popup('Trail 12');

        await p.show(polyline({ path }));

        expect(p.isVisible).toBe(false);
    });

    // The one that matters. A popup left in the collection and marked open takes the early
    // return at the top of show(), so it could never be opened once the layer had a map.
    it('can still be shown once the layer is on a map', async () => {
        const p = popup('Trail 12');
        const line = polyline({ path });
        await p.show(line);

        await line.setMap(fakeMap());
        await p.show(line);
        await tick();

        expect(p.isOpen()).toBe(true);
    });
});

/* ===========================================================================
    Accessibility: focus, Escape, role and name, and a keyboard close element.

    The Google stub doesn't call onAdd() or draw(), so openOnPage() does what Google would: put
    the element in a pane on the page and draw it. Focus only moves on the first draw, because
    the element isn't on the page before then.
=========================================================================== */
describe('popup accessibility', () => {
    let pane: HTMLElement;

    /**
     * Show the popup, then add and draw it the way Google would
     *
     * @param {Popup} p The popup
     * @returns {Promise<Popup>}
     */
    const openOnPage = async (p: Popup): Promise<Popup> => {
        p.position = { lat: 48.85, lng: 2.35 };
        // Fitting pans the map, which the fake map can't do, and isn't what these tests are about
        p.fit = false;
        await p.show(fakeMap());
        p.add({ floatPane: pane } as unknown as google.maps.MapPanes);
        p.draw(fakeProjection());
        return p;
    };

    /**
     * A button on the page, outside any popup, with focus on it
     *
     * @returns {HTMLButtonElement}
     */
    const focusedOpener = (): HTMLButtonElement => {
        const opener = document.createElement('button');
        document.body.appendChild(opener);
        opener.focus();
        return opener;
    };

    /**
     * Press a key on an element
     *
     * @param {EventTarget} target Where the key is pressed
     * @param {string} key The key
     * @returns {KeyboardEvent}
     */
    const press = (target: EventTarget, key: string): KeyboardEvent => {
        const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
        target.dispatchEvent(event);
        return event;
    };

    beforeEach(() => {
        installGoogleMaps();
        pane = document.createElement('div');
        document.body.appendChild(pane);
    });

    afterEach(() => {
        closeAllPopups();
        document.body.innerHTML = '';
        uninstallGoogleMaps();
    });

    describe('role and name', () => {
        it("defaults the role to 'dialog'", async () => {
            const p = await openOnPage(popup('Trail 12'));
            expect(p.getOverlayElement().getAttribute('role')).toBe('dialog');
        });

        it("has the 'tooltip' role on hover", async () => {
            const p = popup({ content: 'Trail 12', event: 'hover' });
            await openOnPage(p);
            expect(p.getOverlayElement().getAttribute('role')).toBe('tooltip');
            expect(p.getOverlayElement().hasAttribute('tabindex')).toBe(false);
        });

        it('uses the role it was given', async () => {
            const p = await openOnPage(popup({ content: 'Trail 12', role: 'region' }));
            expect(p.getOverlayElement().getAttribute('role')).toBe('region');
        });

        it('writes ariaLabel to the element', async () => {
            const p = await openOnPage(popup({ content: 'Trail 12', ariaLabel: 'Trail details' }));
            expect(p.getOverlayElement().getAttribute('aria-label')).toBe('Trail details');
        });

        it('updates aria-label when it changes on an open popup', async () => {
            const p = await openOnPage(popup({ content: 'Trail 12', ariaLabel: 'Trail details' }));
            p.ariaLabel = 'Other';
            expect(p.getOverlayElement().getAttribute('aria-label')).toBe('Other');
            p.ariaLabel = '';
            expect(p.getOverlayElement().hasAttribute('aria-label')).toBe(false);
        });

        // Attaching a popup to thousands of layers relies on the element being built lazily
        it('does not build the element to set the name on a popup that is not shown', () => {
            const p = popup({ content: 'Trail 12' });
            const getElement = vi.spyOn(p, 'getOverlayElement');
            p.ariaLabel = 'Trail details';
            p.role = 'region';
            expect(getElement).not.toHaveBeenCalled();
        });

        it('makes the popup focusable from code but not part of the tab order', async () => {
            const p = await openOnPage(popup('Trail 12'));
            expect(p.getOverlayElement().getAttribute('tabindex')).toBe('-1');
        });
    });

    describe('moving focus in', () => {
        it('defaults focus to true', () => {
            expect(popup('x').focus).toBe(true);
        });

        it('focuses the first focusable element', async () => {
            const p = await openOnPage(popup('<p>Trail 12</p><a href="#">More</a><button>Close</button>'));
            expect(document.activeElement).toBe(p.getOverlayElement().querySelector('a'));
        });

        it('skips elements that cannot take focus', async () => {
            const p = await openOnPage(
                popup('<button disabled>A</button><span tabindex="-1">B</span><button class="c">C</button>'),
            );
            expect(document.activeElement).toBe(p.getOverlayElement().querySelector('.c'));
        });

        it('focuses the popup itself when nothing in it can take focus', async () => {
            const p = await openOnPage(popup('<p>Trail 12</p>'));
            expect(document.activeElement).toBe(p.getOverlayElement());
        });

        it('only moves focus on the first draw, not on every frame', async () => {
            const p = await openOnPage(popup('<button>Close</button>'));
            const opener = focusedOpener();
            p.draw(fakeProjection());
            expect(document.activeElement).toBe(opener);
        });

        it('leaves focus where it is with focus: false', async () => {
            const opener = focusedOpener();
            await openOnPage(popup({ content: '<button>Close</button>', focus: false }));
            expect(document.activeElement).toBe(opener);
        });

        it('never takes focus on hover', async () => {
            const opener = focusedOpener();
            await openOnPage(popup({ content: '<button>Close</button>', event: 'hover' }));
            expect(document.activeElement).toBe(opener);
        });
    });

    describe('giving focus back', () => {
        it('gives focus back to the opener when it closes', async () => {
            const opener = focusedOpener();
            const p = await openOnPage(popup('<button>Close</button>'));
            p.hide();
            expect(document.activeElement).toBe(opener);
        });

        it('does not take focus back when the user has moved it elsewhere', async () => {
            focusedOpener();
            const p = await openOnPage(popup('<button>Close</button>'));
            const elsewhere = focusedOpener();
            p.hide();
            expect(document.activeElement).toBe(elsewhere);
        });

        it('does nothing when the opener has been removed from the page', async () => {
            const opener = focusedOpener();
            const p = await openOnPage(popup('<button>Close</button>'));
            opener.remove();
            expect(() => p.hide()).not.toThrow();
            expect(document.activeElement).not.toBe(opener);
        });

        it('gives focus back when closed by closeAllPopups()', async () => {
            const opener = focusedOpener();
            await openOnPage(popup('<button>Close</button>'));
            closeAllPopups();
            expect(document.activeElement).toBe(opener);
        });

        // The first popup hands focus back to the opener, which is then where the second one
        // gives it back to - not to an element inside a popup that's gone.
        it('gives focus back to the original opener when autoClose replaces one popup with another', async () => {
            const opener = focusedOpener();
            await openOnPage(popup('<button>First</button>'));
            const second = await openOnPage(popup('<button>Second</button>'));
            expect(document.activeElement).toBe(second.getOverlayElement().querySelector('button'));
            second.hide();
            expect(document.activeElement).toBe(opener);
        });
    });

    describe('Escape', () => {
        it('closes the popup from inside it', async () => {
            const p = await openOnPage(popup('<button>Close</button>'));
            press(document.activeElement!, 'Escape');
            expect(p.isOpen()).toBe(false);
        });

        it('closes the popup when focus is outside it', async () => {
            const opener = focusedOpener();
            const p = await openOnPage(popup({ content: 'Trail 12', focus: false }));
            press(opener, 'Escape');
            expect(p.isOpen()).toBe(false);
        });

        it('gives focus back when Escape closes the popup', async () => {
            const opener = focusedOpener();
            await openOnPage(popup('<button>Close</button>'));
            press(document.activeElement!, 'Escape');
            expect(document.activeElement).toBe(opener);
        });

        it('closes only the most recently opened popup', async () => {
            const first = await openOnPage(popup({ content: 'First', autoClose: false }));
            const second = await openOnPage(popup({ content: 'Second', autoClose: false }));
            press(document.body, 'Escape');
            expect(second.isOpen()).toBe(false);
            expect(first.isOpen()).toBe(true);
            press(document.body, 'Escape');
            expect(first.isOpen()).toBe(false);
        });

        it('does nothing to a closed popup', async () => {
            const p = await openOnPage(popup('Trail 12'));
            p.hide();
            const hide = vi.spyOn(p, 'hide');
            press(document.body, 'Escape');
            expect(hide).not.toHaveBeenCalled();
        });

        it('leaves a hover popup alone', async () => {
            const p = await openOnPage(popup({ content: 'Trail 12', event: 'hover' }));
            const hide = vi.spyOn(p, 'hide');
            press(document.body, 'Escape');
            expect(hide).not.toHaveBeenCalled();
        });

        it('ignores an Escape that something else already handled', async () => {
            const p = await openOnPage(popup('<input type="text">'));
            const input = p.getOverlayElement().querySelector('input')!;
            input.addEventListener('keydown', (e) => e.preventDefault());
            press(input, 'Escape');
            expect(p.isOpen()).toBe(true);
        });

        // clickon shows the popup through move() rather than show()
        it('closes a clickon popup', async () => {
            const line = polyline({ path });
            const p = line.attachPopup('Trail 12', 'clickon');
            await line.setMap(fakeMap());
            await tick();
            line.dispatch('click', { latLng: { lat: 48.85, lng: 2.35 } });
            await tick();
            expect(p.isOpen()).toBe(true);

            press(document.body, 'Escape');
            expect(p.isOpen()).toBe(false);
            expect(p.isVisible).toBe(false);
        });

        it('ignores other keys', async () => {
            const p = await openOnPage(popup('Trail 12'));
            press(document.body, 'Enter');
            expect(p.isOpen()).toBe(true);
        });
    });

    describe('a keyboard close element', () => {
        it('gives a div button semantics', async () => {
            const p = await openOnPage(popup({ content: '<div class="close">x</div>', closeElement: '.close' }));
            const close = p.getOverlayElement().querySelector('.close')!;
            expect(close.getAttribute('role')).toBe('button');
            expect(close.getAttribute('tabindex')).toBe('0');
        });

        it('closes the popup with Enter and Space', async () => {
            const p = await openOnPage(popup({ content: '<div class="close">x</div>', closeElement: '.close' }));
            const event = press(p.getOverlayElement().querySelector('.close')!, 'Enter');
            expect(p.isOpen()).toBe(false);
            expect(event.defaultPrevented).toBe(true);

            await openOnPage(p);
            press(p.getOverlayElement().querySelector('.close')!, ' ');
            expect(p.isOpen()).toBe(false);
        });

        it('leaves a real button alone', async () => {
            const p = await openOnPage(popup({ content: '<button class="close">x</button>', closeElement: '.close' }));
            const close = p.getOverlayElement().querySelector('.close')!;
            expect(close.hasAttribute('role')).toBe(false);
            expect(close.hasAttribute('tabindex')).toBe(false);
        });
    });
});
