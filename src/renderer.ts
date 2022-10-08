import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as ejs from 'ejs';
import { Marp } from '@marp-team/marp-core';
import { ResponseType } from 'axios';

import { SpeakerOption, WaitOption } from './types';
import { apiClient } from './api_client';

export class Renderer {
  input: string;
  output: string;
  speakerOption: SpeakerOption;
  title: string;
  description: string;
  wait: WaitOption[];
  url: string;

  constructor(
    input: string,
    output: string,
    speakerOption: SpeakerOption,
    title: string,
    description: string,
    wait: WaitOption[],
    url: string
  ) {
    this.input = input;
    this.output = output;
    this.speakerOption = speakerOption;
    this.title = title;
    this.description = description;
    this.wait = wait;
    this.url = url;
  }

  async render() {
    const markdown = fs.readFileSync(this.input, 'utf8');
    const { html, css, comments } = new Marp({
      inlineSVG: false,
      script: false,
      html: true,
    }).render(markdown, {
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
      template({
        title: this.title,
        description: this.description,
        copyright,
        sections: this.sections(html),
        css,
        comments,
        url: this.url
      }),
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
        const { data } = await apiClient.audioQueryAudioQueryPost(
          text,
          this.speakerOption.id
        );
        const postPhonemeLength =
          (this.wait.find((w) => w.page === index)?.seconds ?? 0) +
          data.postPhonemeLength;
        const query = {
          ...data,
          postPhonemeLength,
        };
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

  sections(html: string[]) {
    return [
      html[0]
        .replace('"1"', '"0"')
        .replace(
          /(<section[^>]+>).*(<\/section.+)/s,
          `$1<h1>${this.title}</h1><p>${this.description}</p>$2`
        ),
      ...html,
    ];
  }
}
