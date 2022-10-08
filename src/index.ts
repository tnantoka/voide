import { SpeakerOption, WaitOption } from './types';
import { Renderer } from './renderer';
import { OGP } from './ogp';
import { apiClient } from './api_client';
import * as fs from 'fs';

export class Voide {
  async speakerOptions(): Promise<SpeakerOption[]> {
    const { data: speakers } = await apiClient.speakersSpeakersGet();
    const options = await speakers.reduce(async (prev, current) => {
      return [
        ...(await prev),
        ...(await Promise.all(
          current.styles.map(async (style) => ({
            id: style.id,
            uuid: current.speaker_uuid,
            label: `${style.id}: ${current.name} (${style.name})`,
            copyright: await this.copyright(current.speaker_uuid),
          }))
        )),
      ];
    }, Promise.resolve([] as SpeakerOption[]));
    return options.sort((a, b) => a.id - b.id);
  }

  async generate(
    input: string,
    output: string,
    speaker: number,
    title: string,
    description: string,
    wait: WaitOption[],
    url: string
  ) {
    const options = await this.speakerOptions();
    const option = options.find((o) => o.id === speaker)!;

    new Renderer(input, output, option, title, description, wait, url).render();
    new OGP(output, title).generate();
  }

  async copyright(uuid: string) {
    const { data: info } = await apiClient.speakerInfoSpeakerInfoGet(uuid);
    return (info.policy.match(/VOICEVOX:[^」]+/) ?? [])[0];
  }
}
