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
      speaker: {
        type: 'number',
        demandOption: true,
        alias: 's',
        description: (await voide.speakerOptions())
          .map((style) => style.label)
          .join('\n'),
      },
      title: {
        type: 'string',
        demandOption: true,
        alias: 't',
      },
      description: {
        type: 'string',
        alias: 'd',
      },
      wait: {
        type: 'array',
        alias: 'w',
        description: 'page:seconds',
      },
    })
    .parseSync();

  voide.generate(
    argv.input,
    argv.output,
    argv.speaker,
    argv.title,
    argv.description ?? '',
    (argv.wait ?? []).map((w: string | number) => ({
      page: parseInt(w.toString().split(':')[0]),
      seconds: parseInt(w.toString().split(':')[1]),
    }))
  );
})();
