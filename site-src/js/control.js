/* ===========================================================================
    Javascript for the Control and Button page

    Six controls on one map:
      - an action button
      - a toggle that reports its state through an attribute this page styles
      - a button that starts disabled and enables itself later
      - an icon-only button, whose tooltip is also its aria-label
      - an icon-only toggle that gets text while it's on, and loses its aria-label then
      - a plain Control wrapping markup that was already on the page

    Plus buttons off the map that move and remove that last one, which is what a bare
    addCustomControl() can't do, and a table under the map that shows what each button is called.
=========================================================================== */

/* global G */

G.loader({ apiKey: apiKey }).load();

const start = { latitude: 40.73061, longitude: -73.935242 };
const statusElement = document.getElementById('status');

const map = G.map('#map', { ...start, zoom: 12 });
map.show();

const marker = G.marker({ map: map, position: [start.latitude, start.longitude], title: 'A marker' });

/**
 * Say what just happened, so the page shows the state without opening the console
 *
 * @param {string} message The message to show
 */
const say = (message) => {
    statusElement.textContent = message;
};

/* ---------------------------------------------------------------------------
    An action button. No state, it just does something.
--------------------------------------------------------------------------- */

const resetButton = G.button({
    className: 'TestBtn',
    content: 'Reset',
    map: map,
    position: G.ControlPosition.BLOCK_START_INLINE_END,
    onClick: () => {
        map.setCenter(start.latitude, start.longitude);
        map.zoom = 12;
        say('Reset the map.');
    },
});

/* ---------------------------------------------------------------------------
    A toggle. The library decides when each state applies; this page decides what it looks
    like, through the attribute and the tooltip named below.
--------------------------------------------------------------------------- */

const markerToggle = G.button({
    className: 'TestBtn',
    content: 'Marker',
    map: map,
    position: G.ControlPosition.BLOCK_START_INLINE_END,
    toggle: true,
    active: true,
    states: {
        active: { attributes: { 'data-visible': 'yes' }, tooltip: 'Hide the marker' },
        inactive: { attributes: { 'data-visible': 'no' }, tooltip: 'Show the marker' },
    },
});

markerToggle.onChange((active) => {
    if (active) {
        marker.show(map);
        say('Marker shown.');
    } else {
        marker.hide();
        say('Marker hidden.');
    }
});

/* ---------------------------------------------------------------------------
    A button that isn't usable yet. The timeout stands in for data that has to load.

    While it's disabled the CSS on this page makes it invisible - and clicking where it is does
    nothing, because a disabled Button ignores clicks. Hand-written versions of this usually leave
    the listener bound, so an invisible button still fires.
--------------------------------------------------------------------------- */

const layerButton = G.button({
    className: 'TestBtn',
    content: 'Layer',
    enabled: false,
    map: map,
    position: G.ControlPosition.BLOCK_START_INLINE_END,
    toggle: true,
    states: {
        active: { attributes: { 'data-visible': 'yes' }, tooltip: 'Hide the layer' },
        inactive: { attributes: { 'data-visible': 'no' }, tooltip: 'Show the layer' },
    },
    onClick: () => {
        say('The layer button was clicked. It only gets here while it is enabled.');
    },
});

window.setTimeout(() => {
    layerButton.enable();
    say('The layer button is enabled now.');
}, 2000);

/* ---------------------------------------------------------------------------
    An icon-only button. There's no text to name it, so the tooltip is written to aria-label as
    well as title. The <title> inside the svg doesn't count as text you can see. The svg is
    aria-hidden too, because the icon is decorative and the aria-label already names the button.

    An action button has no active state, so the tooltip goes on the enabled state.
--------------------------------------------------------------------------- */

const zoomButton = G.button({
    className: 'TestBtn TestBtn--icon',
    content:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><title>Plus icon</title><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" /></svg>',
    map: map,
    position: G.ControlPosition.BLOCK_START_INLINE_END,
    states: {
        enabled: { tooltip: 'Zoom in' },
    },
    onClick: () => {
        map.zoom += 1;
        say(`Zoomed in to ${map.zoom}.`);
    },
});

/* ---------------------------------------------------------------------------
    An icon-only toggle that shows a word while it's on.

    Off, it's icon-only and the tooltip is its aria-label. On, the state puts "Satellite" in the
    span, so it has text you can see. The aria-label the tooltip set is taken off then, so the
    name is the word on the button, and a voice control user can say it to press it. The tooltip
    stays in title either way.
--------------------------------------------------------------------------- */

const satelliteButton = G.button({
    className: 'TestBtn TestBtn--icon',
    content:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 6h-3a15.7 15.7 0 0 0-1.4-3.6A8 8 0 0 1 18.9 8zM12 4a14 14 0 0 1 1.9 4h-3.8A14 14 0 0 1 12 4zM4.3 14a8.2 8.2 0 0 1 0-4h3.4a16.5 16.5 0 0 0 0 4zm.8 2h3a15.7 15.7 0 0 0 1.4 3.6A8 8 0 0 1 5.1 16zm3-8h-3a8 8 0 0 1 4.4-3.6A15.7 15.7 0 0 0 8.1 8zM12 20a14 14 0 0 1-1.9-4h3.8A14 14 0 0 1 12 20zm2.3-6H9.7a14.7 14.7 0 0 1 0-4h4.6a14.7 14.7 0 0 1 0 4zm.3 5.6a15.7 15.7 0 0 0 1.4-3.6h3a8 8 0 0 1-4.4 3.6zm1.7-5.6a16.5 16.5 0 0 0 0-4h3.4a8.2 8.2 0 0 1 0 4z" /></svg>'
        + '<span class="TestBtn-text"></span>',
    map: map,
    position: G.ControlPosition.BLOCK_START_INLINE_END,
    toggle: true,
    states: {
        active: {
            attributes: { 'data-visible': 'yes' },
            text: { selector: '.TestBtn-text', text: 'Satellite' },
            tooltip: 'Show the road map',
        },
        inactive: {
            attributes: { 'data-visible': 'no' },
            text: { selector: '.TestBtn-text', text: '' },
            tooltip: 'Show the satellite view',
        },
    },
});

satelliteButton.onChange((active) => {
    map.mapTypeId = active ? 'satellite' : 'roadmap';
    say(active ? 'Showing the satellite view.' : 'Showing the road map.');
});

/* ---------------------------------------------------------------------------
    A plain Control wrapping markup that was already on the page, the way a server-rendered
    legend would be. Nothing is built and the element is used as it is.
--------------------------------------------------------------------------- */

const legendElement = document.getElementById('legend');
legendElement.hidden = false;

const legend = G.control({
    element: legendElement,
    map: map,
    position: G.ControlPosition.RIGHT_TOP,
});

legend.on('add', () => say('Legend added to the map.'));
legend.on('remove', () => say('Legend taken off the map.'));

document.getElementById('moveLegend').addEventListener('click', () => {
    // Moving an attached control takes it off one position array and pushes it onto another
    legend.position =
        legend.position === G.ControlPosition.RIGHT_TOP
            ? G.ControlPosition.BLOCK_END_INLINE_START
            : G.ControlPosition.RIGHT_TOP;
    say(`Legend moved. Position is now ${legend.position}.`);
});

document.getElementById('removeLegend').addEventListener('click', () => {
    legend.remove();
});

document.getElementById('addLegend').addEventListener('click', () => {
    if (legend.isAttached) {
        say('The legend is already on the map.');
        return;
    }
    legend.addTo(map);
});

/* ---------------------------------------------------------------------------
    The table under the map that shows what each button is called.

    The name here is worked out the simple way, which is all these buttons need: the aria-label
    if there is one, otherwise the text you can see. A browser's accessibility tree does more,
    but this is enough to show which of the two wins.
--------------------------------------------------------------------------- */

/**
 * The text you can see on a button. Text inside an svg or something aria-hidden doesn't count,
 * the same as the library's own check.
 *
 * @param {HTMLElement} element The button element
 * @returns {string}
 */
const visibleText = (element) => {
    const copy = element.cloneNode(true);
    copy.querySelectorAll('svg, [aria-hidden="true"]').forEach((hidden) => hidden.remove());
    return copy.textContent.trim();
};

const nameRows = document.getElementById('buttonNames');

/**
 * A table cell, greyed out when there's nothing in it
 *
 * @param {string|null} value What goes in the cell
 * @returns {HTMLTableCellElement}
 */
const cell = (value) => {
    const td = document.createElement('td');
    if (value) {
        td.textContent = value;
    } else {
        td.textContent = 'none';
        td.className = 'is-empty';
    }
    return td;
};

/**
 * Redraw the table from the buttons as they are now
 */
const showNames = () => {
    nameRows.replaceChildren(
        ...[
            ['Reset', resetButton],
            ['Marker', markerToggle],
            ['Layer', layerButton],
            ['Zoom in', zoomButton],
            ['Satellite', satelliteButton],
        ].map(([label, b]) => {
            const { element } = b;
            const text = visibleText(element);
            const ariaLabel = element.getAttribute('aria-label');
            const row = document.createElement('tr');
            const th = document.createElement('th');
            th.scope = 'row';
            th.textContent = label;
            row.append(
                th,
                cell(text),
                cell(element.getAttribute('title')),
                cell(ariaLabel),
                cell(ariaLabel ? `${ariaLabel} (from aria-label)` : text && `${text} (from the text)`),
            );
            return row;
        }),
    );
};

// Redraw whenever a button's attributes or text change, whatever changed them
const observer = new MutationObserver(showNames);
[resetButton, markerToggle, layerButton, zoomButton, satelliteButton].forEach((b) => {
    observer.observe(b.element, { attributes: true, characterData: true, childList: true, subtree: true });
});
showNames();
