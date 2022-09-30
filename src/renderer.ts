import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as ejs from 'ejs';
import { Marp } from '@marp-team/marp-core';
import { ResponseType } from 'axios';

import { SpeakerOption } from './types';
import { apiClient } from './api_client';

const marp = new Marp({ inlineSVG: false, script: false });

export class Renderer {
  input: string;
  output: string;
  title: string;
  speakerOption: SpeakerOption;

  constructor(
    input: string,
    output: string,
    title: string,
    speakerOption: SpeakerOption
  ) {
    this.input = input;
    this.output = output;
    this.title = title;
    this.speakerOption = speakerOption;
  }

  async render() {
    const markdown = fs.readFileSync(this.input, 'utf8');
    const { html, css, comments } = marp.render(markdown, {
      htmlAsArray: true,
    });

    this.generateHTML(html, css, comments);
    this.generateVoices(comments);
  }

  async generateHTML(html: string[], css: string, comments: string[][]) {
    fs.mkdirSync(this.output);

    const templatesPath = path.join(__dirname, '../lib/templates');
    fse.copySync(templatesPath, this.output);

    const copyright = this.speakerOption.copyright;

    const ejsPath = path.join(this.output, 'index.html.ejs');
    const htmlPath = path.join(this.output, 'index.html');
    const template = ejs.compile(fs.readFileSync(ejsPath, 'utf8'));
    fs.writeFileSync(
      htmlPath,
      template({ title: this.title, copyright, html, css, comments }),
      'utf8'
    );
    fs.rmSync(ejsPath);
  }

  async generateVoices(comments: string[][]) {
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

        process.stdout.write('*');
      })
    );
  }
}