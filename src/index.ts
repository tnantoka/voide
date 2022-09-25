import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';

import { DefaultApi } from './openapi';

const basePath = 'http://localhost:50021';
const api = new DefaultApi(undefined, basePath);

export class Voide {
  async speakers() {
    const { data: speakers } = await api.speakersSpeakersGet();
    return speakers;
  }

  async generate(
    input: string,
    output: string,
    speaker: number,
    force: boolean
  ) {
    const markdown = fs.readFileSync(input, 'utf8');

    this.createOutputDirectory(output, force);
  }

  createOutputDirectory(output: string, force: boolean) {
    if (force) {
      fs.rmSync(output, { recursive: true, force: true });
    }

    fs.mkdirSync(output);

    const templatesPath = path.join(__dirname, '../lib/templates');
    fse.copySync(templatesPath, output);
  }
}
