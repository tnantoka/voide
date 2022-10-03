#!/usr/bin/env node

import { program } from 'commander';

import { Voide } from '..';

(async () => {
  const voide = new Voide();

  program
    .requiredOption('-i, --input <path>', 'path/to/source.md')
    .requiredOption('-o, --output <path>', 'path/to/output.d/')
    .requiredOption(
      '-s, --speaker <id>',
      (await voide.speakerOptions()).map((style) => style.label).join('\n')
    )
    .requiredOption('-t, --title <title>')
    .option('-d, --description <description>')
    .option('-w, --wait <page:seconds...>');
  program.parse();
  const options = program.opts();

  voide.generate(
    options.input,
    options.output,
    parseInt(options.speaker),
    options.title,
    options.description ?? '',
    (options.wait ?? []).map((w: string | number) => ({
      page: parseInt(w.toString().split(':')[0]),
      seconds: parseInt(w.toString().split(':')[1]),
    }))
  );
})();
