// https://github.com/alclimb/nodejs-ogp-sample

import * as fs from 'fs';
import * as path from 'path';
import * as opentype from 'opentype.js';
const sharp = require('sharp');

const font = opentype.loadSync(path.join(__dirname, '../lib/fonts/NotoSansJP-Regular.otf'));
const width = 1200;
const height = 630;
const rhythm = 8;
const padding = rhythm * 10;
const textWidth = width - padding * 2;
const fontSize = rhythm * 9;
const lineHeight = rhythm * 10;
const backgroundColor = '#fff8e1';
const textColor = '#455a64';

export class OGP {
  output: string;
  title: string;

  constructor(
    output: string,
    title: string
  ) {
    this.output = output;
    this.title = title;
  }

  async generate() {
    const textPaths = this.textPath();
    const marginY = height * 0.5 - (lineHeight * textPaths.length * 0.5) - rhythm * 1.5;
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}">
      <rect style="fill: ${backgroundColor};" width="100%" height="100%" />

      <g transform="translate(${padding}, ${marginY})">
        ${textPaths.join()}
      </g>
    </svg>`;

    const buffer = await sharp(Buffer.from(svg))
      .png()
      .toBuffer();

    fs.writeFileSync(
      path.join(this.output, 'og.png'),
      buffer
    );
  }

  textPath() {
    const columns = [''];
    const renderOptions = {};
  
    for (let i = 0; i < this.title.length; i++) {
      const char = this.title.charAt(i);
  
      const measureWidth = font.getAdvanceWidth(
        columns[columns.length - 1] + char,
        fontSize,
        renderOptions
      );
  
      if (textWidth < measureWidth) {
        columns.push('');
      }
  
      columns[columns.length - 1] += char;
    }
  
    const paths: opentype.Path[] = [];
  
    for (let i = 0; i < columns.length; i++) {
      const measureWidth = font.getAdvanceWidth(
        columns[i],
        fontSize,
        renderOptions
      );
  
      let offsetX = (textWidth - measureWidth) * 0.5;
  
      const path = font.getPath(
        columns[i],
        offsetX,
        lineHeight * (i + 1),
        fontSize,
        renderOptions);
  
      path.fill = textColor;
  
      paths.push(path);
    }
  
    return paths.map(path => path.toSVG(2));
  }
}
