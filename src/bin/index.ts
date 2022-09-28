#!/usr/bin/env node

import yargs from 'yargs';

import { Voide } from '..';

(async () => {
  const voide = new Voide();

  const argv = yargs(process.argv.slice(2))
    .options({
      input: {
        type: 'string',
        demandOption: true,
        alias: 'i',
        description: 'path/to/source.md',
      },
      output: {
        type: 'string',
        demandOption: true,
        alias: 'o',
        description: 'path/to/output.d/',
      },
      title: {
        type: 'string',
        demandOption: true,
        alias: 't',
      },
      speaker: {
        type: 'number',
        demandOption: true,
        alias: 's',
        description: (await voide.speakerOptions())
          .map((style) => style.label)
          .join('\n'),
      },
    })
    .parseSync();

  voide.generate(argv.input, argv.output, argv.title, argv.speaker);
})();
