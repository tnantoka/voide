import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';

export class Voide {
  input: string;
  output: string;
  force: boolean;

  constructor(input: string, output: string, force: boolean) {
    this.input = input;
    this.output = output;
    this.force = force;
  }

  generate() {
    const markdown = fs.readFileSync(this.input, 'utf8');

    if (this.force) {
      fs.rmSync(this.output, { recursive: true, force: true });
    }

    fs.mkdirSync(this.output);

    const templatesPath = path.join(__dirname, '../lib/templates');
    fse.copySync(templatesPath, this.output);
  }
}
