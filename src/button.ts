/* ===========================================================================
    Button entry point for the Google Map Display library.

    A control that responds to clicks, and optionally remembers whether it is active and whether it
    is enabled. It's a separate entry point rather than part of the main one so that a project only
    carries it if it asks for it:

        import { button } from '@aptuitiv/gmaps/button';

    It's on the global G object in the standalone browser build, which contains everything.
=========================================================================== */

export { button, Button, ButtonOptions, ButtonStates, ButtonStateStyle, ButtonValue } from './lib/Button';
