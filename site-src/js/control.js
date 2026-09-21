/* ===========================================================================
    Javascript for the Control and Button page

    Four controls on one map:
      - an action button
      - a toggle that reports its state through an attribute this page styles
      - a button that starts disabled and enables itself later
      - a plain Control wrapping markup that was already on the page

    Plus buttons off the map that move and remove that last one, which is what a bare
    addCustomControl() can't do.
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

G.button({
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
