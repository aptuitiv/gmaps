/* ===========================================================================
    Build script for esbuild
=========================================================================== */

import * as esbuild from 'esbuild';
import config from './config.js';

esbuild.build(config);