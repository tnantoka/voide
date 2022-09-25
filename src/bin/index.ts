#!/usr/bin/env node

import yargs from 'yargs';

import { Voide } from '..';

const argv = yargs(process.argv.slice(2))
  .options({
    i: {
      type: 'string',
      demandOption: true,
      alias: 'input',
      description: 'path/to/source.md',
    },
    o: {
      type: 'string',
      demandOption: true,
      alias: 'output',
      description: 'path/to/output.d/',
    },
    f: {
      type: 'boolean',
      alias: 'force',
      default: false,
    },
  })
  .parseSync();

const voide = new Voide(argv.i, argv.o, argv.f);
voide.generate();
