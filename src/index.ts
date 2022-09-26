import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import { Marpit } from '@marp-team/marpit';
import { ResponseType } from 'axios';

import { DefaultApi } from './openapi';
import { SpeakerOption } from './types';

const basePath = 'http://localhost:50021';
const api = new DefaultApi(undefined, basePath);

const marpit = new Marpit();

export class Voide {
  async speakerOptions(): Promise<SpeakerOption[]> {
    const { data: speakers } = await api.speakersSpeakersGet();
    const options = await speakers.reduce(async (prev, current) => {
      return [
        ...(await prev),
        ...(await Promise.all(
          current.styles.map(async (style) => ({
            id: style.id,
            label: `${style.id}: ${current.name} (${style.name})`,
            copyright: await this.copyright(current.speaker_uuid),
          }))
        )),
      ];
    }, Promise.resolve([] as SpeakerOption[]));
    return options.sort((a, b) => a.id - b.id);
  }

  async generate(input: string, output: string, speaker: number) {
    const markdown = fs.readFileSync(input, 'utf8');

    fs.mkdirSync(output);

    const templatesPath = path.join(__dirname, '../lib/templates');
    fse.copySync(templatesPath, output);

    const rendered = marpit.render(markdown);
    const { comments } = rendered;

    fs.writeFileSync(
      path.join(output, 'rendered.json'),
      JSON.stringify(rendered, null, 2),
      'utf8'
    );

    const queriesPath = path.join(output, 'queries');
    const voicesPath = path.join(output, 'voices');

    fs.mkdirSync(queriesPath);
    fs.mkdirSync(voicesPath);

    await Promise.all(
      comments.map(async (comment, i) => {
        const text = comment.join();
        const { data: query } = await api.audioQueryAudioQueryPost(
          text,
          speaker
        );
        fs.writeFileSync(
          path.join(queriesPath, `${i}.json`),
          JSON.stringify(query, null, 2)
        );

        const responseType: ResponseType = 'arraybuffer';
        const config = {
          responseType,
        };
        const { data: wav } = await api.synthesisSynthesisPost(
          speaker,
          query,
          undefined,
          undefined,
          config
        );
        fs.writeFileSync(path.join(voicesPath, `${i}.wav`), Buffer.from(wav));
      })
    );
  }

  async copyright(uuid: string) {
    const { data: info } = await api.speakerInfoSpeakerInfoGet(uuid);
    return (info.policy.match(/VOICEVOX:[^」]+/) ?? [])[0];
  }
}
