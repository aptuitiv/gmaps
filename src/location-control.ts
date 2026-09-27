/* ===========================================================================
    Location control entry point for the Google Map Display library.

    Shows the user's position on the map as a marker that keeps up with them, and gives them a
    control that takes the map back to it. It's a separate entry point rather than part of the main
    one so that a project only carries it if it asks for it:

        import { locationControl } from '@aptuitiv/gmaps/location-control';

    It's on the global G object in the standalone browser build, which contains everything.
=========================================================================== */

export {
    locationControl,
    LocationControl,
    LocationControlOptions,
    LocationControlValue,
} from './lib/LocationControl';
