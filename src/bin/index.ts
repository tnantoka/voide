#!/usr/bin/env node

import yargs from 'yargs';

import { Voide } from '..';

(async () => {
  const voide = new Voide();

  const speakers = await voide.speakers();
  const styles = speakers
    .reduce(
      (prev, current) => [
        ...prev,
        ...current.styles.map((style) => ({
          id: style.id,
          name: `${current.name} (${style.name})`,
        })),
      ],
      [] as { id: number; name: string }[]
    )
    .sort((a, b) => a.id - b.id)
    .map((style) => `${style.id}: ${style.name}`)
    .join('\n');

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
        description: styles,
      },
      force: {
        type: 'boolean',
        alias: 'f',
        default: false,
      },
    })
    .parseSync();

  voide.generate(argv.input, argv.output, argv.speaker, argv.force);
})();
