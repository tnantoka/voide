import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import { Marpit } from '@marp-team/marpit';
import { ResponseType } from 'axios';

import { SpeakerOption } from './types';
import { apiClient } from './api_client';

const marpit = new Marpit();

export class Renderer {
  input: string;
  output: string;
  speakerOption: SpeakerOption;

  constructor(input: string, output: string, speakerOption: SpeakerOption) {
    this.input = input;
    this.output = output;
    this.speakerOption = speakerOption;
  }

  async render() {
    const markdown = fs.readFileSync(this.input, 'utf8');

    fs.mkdirSync(this.output);

    const templatesPath = path.join(__dirname, '../lib/templates');
    fse.copySync(templatesPath, this.output);

    const rendered = marpit.render(markdown);
    const { html, comments } = rendered;

    const copyright = this.speakerOption.copyright;

    const cover = `
      <section id="0">
        <p>${copyright}</p>
      </section>
    `;

    fs.writeFileSync(
      path.join(this.output, 'rendered.json'),
      JSON.stringify(
        {
          ...rendered,
          html: html.replace(/(<div class="marpit">)/, `$1${cover}`),
        },
        null,
        2
      ),
      'utf8'
    );

    const queriesPath = path.join(this.output, 'queries');
    const voicesPath = path.join(this.output, 'voices');

    fs.mkdirSync(queriesPath);
    fs.mkdirSync(voicesPath);

    await Promise.all(
      comments.map(async (comment, i) => {
        const index = i + 1;
        const text = comment.join();
        const { data: query } = await apiClient.audioQueryAudioQueryPost(
          text,
          this.speakerOption.id
        );
        fs.writeFileSync(
          path.join(queriesPath, `${index}.json`),
          JSON.stringify(query, null, 2)
        );

        const responseType: ResponseType = 'arraybuffer';
        const config = {
          responseType,
        };
        const { data: wav } = await apiClient.synthesisSynthesisPost(
          this.speakerOption.id,
          query,
          undefined,
          undefined,
          config
        );
        fs.writeFileSync(
          path.join(voicesPath, `${index}.wav`),
          Buffer.from(wav)
        );
      })
    );
  }
}
